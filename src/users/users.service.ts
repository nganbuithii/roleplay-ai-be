import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

export type UserSafe = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<UserSafe[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        displayName: true,
        roleplayName: true,
        avatar: true,
        createdAt: true,
      },
    }) as Promise<UserSafe[]>;
  }

  async findOne(id: string): Promise<UserSafe> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        displayName: true,
        roleplayName: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user as UserSafe;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserSafe> {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        roleplayName: true,
        avatar: true,
        createdAt: true,
      },
    }) as Promise<UserSafe>;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserSafe> {
    const { password, ...rest } = updateUserDto;
    const data: any = { ...rest };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          displayName: true,
          roleplayName: true,
          avatar: true,
          createdAt: true,
        },
      }) as UserSafe;
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<UserSafe> {
    try {
      return await this.prisma.user.delete({
        where: { id },
        select: {
          id: true,
          email: true,
          displayName: true,
          roleplayName: true,
          avatar: true,
          createdAt: true,
        },
      }) as UserSafe;
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
