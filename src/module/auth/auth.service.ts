import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dtos/login.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../../../generated/prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PayloadType } from './type/auth.type';
import { SignupDto } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(user: User) {
    const payload: PayloadType = {
      sub: user.id,
      jti: crypto.randomUUID(),
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    const hashedToken = await bcrypt.hash(refreshToken, 10);

    void this.prisma.token.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        jti: payload.jti,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: loginDto.email },
    });

    if (user) {
      const isMatch = await bcrypt.compare(
        loginDto.password,
        user.password || '',
      );
      if (isMatch) {
        const tokens = await this.generateToken(user);
        return {
          ...tokens,
          id: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          role: user.role,
        };
      }

      throw new BadRequestException('incorrect email or password');
    }
  }

  async signup(signupDto: SignupDto) {
    const savedUser = await this.userService.createUser({
      ...signupDto,
      role: 'VISITOR',
    });

    if (savedUser) {
      const tokens = await this.generateToken(savedUser);
      return {
        ...tokens,
        id: savedUser.id,
        email: savedUser.email,
        first_name: savedUser.firstName,
        last_name: savedUser.lastName,
        role: savedUser.role,
      };
    }
  }

  async validateRefreshToken(refreshToken: string) {
    let decodeToken: PayloadType;
    try {
      decodeToken = this.jwtService.verify<PayloadType>(refreshToken);
    } catch {
      throw new BadRequestException('Invalid or expired refresh token');
    }

    const tokenExist = await this.prisma.token.findFirst({
      where: {
        jti: decodeToken.jti,
      },
      include: {
        user: true,
      },
    });

    if (!tokenExist) {
      throw new BadRequestException('Invalid refresh token');
    }

    const user = tokenExist.user;

    if (tokenExist.revoked) {
      throw new BadRequestException('Refresh token has been revoked');
    }

    if (tokenExist.expiresAt < new Date()) {
      throw new BadRequestException('Refresh token expired');
    }

    const isValid = await bcrypt.compare(refreshToken, tokenExist.token);

    if (!isValid) {
      throw new BadRequestException('Invalid refresh token');
    }
    return { tokenExist, user };
  }

  async refresh(refreshToken: string) {
    const { tokenExist, user } = await this.validateRefreshToken(refreshToken);
    if (tokenExist) {
      await this.prisma.token.update({
        where: {
          id: tokenExist.id,
        },
        data: {
          revoked: true,
        },
      });

      return this.generateToken(user);
    }
  }

  async logout(refreshToken: string) {
    const { tokenExist } = await this.validateRefreshToken(refreshToken);
    await this.prisma.token.update({
      where: {
        id: tokenExist.id,
      },
      data: {
        revoked: true,
      },
    });
    return null;
  }
}
