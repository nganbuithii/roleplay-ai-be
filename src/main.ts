import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();
  
  // Add request logging middleware
  app.use((req, res, next) => {
    console.log('Request:', {
      method: req.method,
      url: req.url,
      body: req.body,
      headers: req.headers,
    });
    next();
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  app.useGlobalFilters(new HttpExceptionFilter());

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('ChatBot API')
    .setDescription('API for Chat with virtual characters')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
