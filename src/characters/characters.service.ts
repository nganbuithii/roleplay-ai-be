import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Character, Prisma } from 'generated/prisma';

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}

  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    if (!createCharacterDto.userId) {
      throw new BadRequestException('User ID is required');
    }

    // Kiểm tra user có tồn tại không
    const user = await this.prisma.user.findUnique({
      where: { id: createCharacterDto.userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${createCharacterDto.userId} not found`);
    }

    const { userId, ...characterData } = createCharacterDto;

    const createData: Prisma.CharacterUncheckedCreateInput = {
      ...characterData,
      userId: userId as string,
    };

    return this.prisma.character.create({
      data: createData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<Character[]> {
    return this.prisma.character.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Character> {
    const character = await this.prisma.character.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
      },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    return character;
  }

  async update(id: string, updateCharacterDto: UpdateCharacterDto, userId: string): Promise<Character> {
    try {
      console.log('Update DTO:', updateCharacterDto); // Log DTO nhận được

      // Kiểm tra character có tồn tại không
      const existingCharacter = await this.prisma.character.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });

      if (!existingCharacter) {
        throw new NotFoundException(`Character with ID ${id} not found`);
      }

      // Kiểm tra quyền sở hữu
      if (existingCharacter.userId !== userId) {
        throw new ForbiddenException('Bạn không có quyền cập nhật nhân vật này');
      }

      // Thực hiện update trực tiếp với dữ liệu từ DTO
      const updatedCharacter = await this.prisma.character.update({
        where: { id },
        data: {
          name: updateCharacterDto.name,
          description: updateCharacterDto.description,
          avatar: updateCharacterDto.avatar,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              displayName: true,
            },
          },
        },
      });

      console.log('Updated Character:', updatedCharacter); // Log kết quả sau khi update

      return updatedCharacter;
    } catch (error) {
      console.error('Update Error:', error); // Log lỗi nếu có
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new Error('Failed to update character: ' + error.message);
    }
  }

  async remove(id: string, userId: string): Promise<Character> {
    try {
      // Kiểm tra character có tồn tại không
      const existingCharacter = await this.prisma.character.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });

      if (!existingCharacter) {
        throw new NotFoundException(`Character with ID ${id} not found`);
      }

      // Kiểm tra quyền sở hữu
      if (existingCharacter.userId !== userId) {
        throw new ForbiddenException('Bạn không có quyền xóa nhân vật này');
      }

      return await this.prisma.character.delete({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              displayName: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new Error('Failed to delete character: ' + error.message);
    }
  }
}
