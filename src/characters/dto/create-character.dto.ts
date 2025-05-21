import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateCharacterDto {
  @ApiProperty({
    example: 'Shadow Knight',
    description: 'Tên nhân vật',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Một hiệp sĩ bóng đêm với sức mạnh bí ẩn',
    description: 'Mô tả về nhân vật',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'https://example.com/character.jpg',
    description: 'URL ảnh đại diện của nhân vật',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID của user sở hữu nhân vật',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  userId?: string;
} 