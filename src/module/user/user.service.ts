import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException('User do not exists');
    } else {
      return user;
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    const userExist = await this.prisma.user.findFirst({
      where: { email: createUserDto.email },
    });

    if (!userExist) {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      return this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
          role: (createUserDto.role as 'VISITOR' | 'OWNER') || 'VISITOR',
        },
      });
    }

    throw new BadRequestException('User already exists');
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const userExist = await this.getUser(id);
    if (userExist) {
      let pass = userExist.password;
      if (updateUserDto.password) {
        pass = await bcrypt.hash(updateUserDto.password, 10);
      }
      return this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          password: pass,
          role: (updateUserDto.role as 'VISITOR' | 'OWNER') || 'VISITOR',
        },
      });
    }
  }

  async deleteUser(id: string) {
    const existUser = await this.getUser(id);
    if (existUser) {
      void this.prisma.user.delete({
        where: { id },
      });
      return null;
    }
  }
}
