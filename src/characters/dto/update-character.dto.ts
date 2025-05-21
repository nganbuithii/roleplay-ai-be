import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCharacterDto {
  @ApiProperty({
    example: 'Shadow Knight',
    description: 'Tên nhân vật',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Một hiệp sĩ bóng đêm với sức mạnh bí ẩn',
    description: 'Mô tả về nhân vật',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/character.jpg',
    description: 'URL ảnh đại diện của nhân vật',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;
} 