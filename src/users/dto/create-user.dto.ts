import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mật khẩu của người dùng (tối thiểu 6 ký tự)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Tên hiển thị của người dùng',
  })
  @IsString()
  displayName: string;

  @ApiProperty({
    example: 'Shadow Knight',
    description: 'Tên nhân vật roleplay (không bắt buộc)',
    required: false,
  })
  @IsString()
  @IsOptional()
  roleplayName?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'URL ảnh đại diện (không bắt buộc)',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;
} 