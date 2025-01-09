import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { Category } from '../categories/categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Category])],  
  controllers: [ProductsController],
  providers: [ProductsService],  
})
export class ProductsModule {}
