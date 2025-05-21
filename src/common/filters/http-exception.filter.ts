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
      [HttpStatus.UNAUTHORIZED]: 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.',
      [HttpStatus.NOT_FOUND]: 'Không tìm thấy dữ liệu.',
      [HttpStatus.BAD_REQUEST]: 'Dữ liệu không hợp lệ.',
    };

    // Format error response
    const errorResponse = {
      success: false,
      statusCode: status,
      message: errorMessages[status] || exception.message,
      error: exception.name,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    };

    response.status(status).json(errorResponse);
  }
} 