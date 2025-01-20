import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Products } from '../products/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Products])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule { }