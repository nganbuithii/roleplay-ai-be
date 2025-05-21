import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Character } from 'generated/prisma';

@ApiTags('characters')
@Controller('characters')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo nhân vật mới' })
  @ApiResponse({ status: 201, description: 'Nhân vật đã được tạo thành công.' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCharacterDto: CreateCharacterDto, @Request() req): Promise<Character> {
    // Lấy userId từ JWT token
    createCharacterDto.userId = req.user.id;
    return this.charactersService.create(createCharacterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả nhân vật' })
  @ApiResponse({ status: 200, description: 'Trả về danh sách nhân vật.' })
  findAll(): Promise<Character[]> {
    return this.charactersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin một nhân vật theo ID' })
  @ApiResponse({ status: 200, description: 'Trả về thông tin nhân vật.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân vật.' })
  findOne(@Param('id') id: string): Promise<Character> {
    return this.charactersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin nhân vật' })
  @ApiResponse({ status: 200, description: 'Nhân vật đã được cập nhật thành công.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân vật.' })
  @ApiResponse({ status: 403, description: 'Không có quyền cập nhật nhân vật này.' })
  update(
    @Param('id') id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
    @Request() req,
  ): Promise<Character> {
    return this.charactersService.update(id, updateCharacterDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa nhân vật' })
  @ApiResponse({ status: 200, description: 'Nhân vật đã được xóa thành công.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân vật.' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa nhân vật này.' })
  remove(@Param('id') id: string, @Request() req): Promise<Character> {
    return this.charactersService.remove(id, req.user.id);
  }
}
