import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [UsersService, JwtService],
  controllers: [UsersController],
  exports: [UsersService], // Export UsersService for use in other modules
})
export class UsersModule {}

