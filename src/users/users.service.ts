import { Injectable, NotFoundException, Logger } from '@nestjs/common';
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


    try {
      // Kiểm tra user có tồn tại không
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      const updateData: any = {};

      // Chỉ update các trường được gửi lên
      if (updateUserDto.displayName !== undefined) {
        updateData.displayName = updateUserDto.displayName;
      }
      if (updateUserDto.roleplayName !== undefined) {
        updateData.roleplayName = updateUserDto.roleplayName;
      }
      if (updateUserDto.avatar !== undefined) {
        updateData.avatar = updateUserDto.avatar;
      }
      if (updateUserDto.password) {
        updateData.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      // Kiểm tra xem có data nào để update không
      if (Object.keys(updateData).length === 0) {
        return existingUser as UserSafe;
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          displayName: true,
          roleplayName: true,
          avatar: true,
          createdAt: true,
        },
      });
      return updatedUser as UserSafe;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to update user: ' + error.message);
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
