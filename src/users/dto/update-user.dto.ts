import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'New Password',
    description: 'Mật khẩu mới (tối thiểu 6 ký tự)',
    required: false,
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: 'John Doe Updated',
    description: 'Tên hiển thị mới',
    required: false,
  })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({
    example: 'Dark Knight',
    description: 'Tên nhân vật roleplay mới',
    required: false,
  })
  @IsString()
  @IsOptional()
  roleplayName?: string;

  @ApiProperty({
    example: 'https://example.com/new-avatar.jpg',
    description: 'URL ảnh đại diện mới',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;
} 