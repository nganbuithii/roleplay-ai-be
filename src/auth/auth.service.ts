import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserSafe } from '../users/users.service';

export interface AuthResponse {
  user: UserSafe;
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }
    console.log("registerDto", registerDto);
    // Tạo user mới
    const user = await this.usersService.create(registerDto);
    
    // Tạo JWT token
    const token = this.generateToken(user);

    return {
      user,
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    // Tìm user theo email
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Tạo JWT token
    const token = this.generateToken(user);

    // Loại bỏ password khỏi user object
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  private generateToken(user: any) {
    const payload = { 
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.sign(payload);
  }
}
