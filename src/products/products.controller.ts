import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './products.dto';
import { Products } from './products.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    async create(@Body(new ValidationPipe()) createProductDto: CreateProductDto): Promise<Products> {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    async findAll(): Promise<Products[]> {
        return this.productsService.findAll();
    }
}