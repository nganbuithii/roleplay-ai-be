import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CharactersModule } from './characters/characters.module';
import { CharactersController } from './characters/characters.controller';

@Module({
  imports: [AuthModule, UsersModule, UsersModule, CharactersModule, CharactersModule],
  controllers: [AppController, CharactersController],
  providers: [AppService],
})
export class AppModule {}
