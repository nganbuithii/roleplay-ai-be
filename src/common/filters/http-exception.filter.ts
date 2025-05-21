import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Custom error messages
    const errorMessages = {
      [HttpStatus.CONFLICT]: 'Email này đã được sử dụng. Vui lòng sử dụng email khác.',
      [HttpStatus.UNAUTHORIZED]: 'Bạn chưa đăng nhập hoặc token đã hết hạn. Vui lòng đăng nhập lại.',
      [HttpStatus.FORBIDDEN]: 'Bạn không có quyền truy cập tài nguyên này.',
      [HttpStatus.NOT_FOUND]: 'Không tìm thấy tài nguyên. Vui lòng kiểm tra lại URL.',
      [HttpStatus.BAD_REQUEST]: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.',
      [HttpStatus.METHOD_NOT_ALLOWED]: 'Phương thức không được hỗ trợ. Vui lòng kiểm tra lại method.',
    };

    // Format error response
    const errorResponse = {
      success: false,
      statusCode: status,
      message: errorMessages[status] || exception.message,
      error: exception.name,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      method: ctx.getRequest().method,
    };

    response.status(status).json(errorResponse);
  }
} 