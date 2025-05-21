import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Lấy danh sách tất cả người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách người dùng',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          displayName: { type: 'string' },
          roleplayName: { type: 'string' },
          avatar: { type: 'string' },
          createdAt: { type: 'string' },
        },
      },
    },
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin người dùng',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        displayName: { type: 'string' },
        roleplayName: { type: 'string' },
        avatar: { type: 'string' },
        createdAt: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin người dùng đã được cập nhật',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    // Kiểm tra xem người dùng có quyền cập nhật không
    if (req.user.id !== id) {
      throw new Error('Unauthorized');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Xóa người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Người dùng đã được xóa',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    // Kiểm tra xem người dùng có quyền xóa không
    if (req.user.id !== id) {
      throw new Error('Unauthorized');
    }
    return this.usersService.remove(id);
  }
}
