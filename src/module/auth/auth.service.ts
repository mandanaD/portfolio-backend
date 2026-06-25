import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dtos/login.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../../../generated/prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PayloadType } from './type/auth.type';

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
    };
    const accessToken = this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });

    const refreshToken = this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    const hashedToken = await bcrypt.hash(refreshToken, 10);

    void this.prisma.token.create({
      data: {
        token: hashedToken,
        user,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
          is_admin: user.role,
        };
      }

      throw new BadRequestException('incorrect email or password');
    }
  }
}
