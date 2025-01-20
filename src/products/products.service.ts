import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Products } from './products.entity';
import { CreateProductDto } from './products.dto';
import { Category } from '../categories/categories.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Products) private productsRepository: Repository<Products>,
        @InjectRepository(Category) private categoriesRepository: Repository<Category>
    ) { }

    async create(createProductDto: CreateProductDto): Promise<Products> {
        const { categoryId, ...productData } = createProductDto;

        const category = await this.categoriesRepository.findOne({
            where: { id: categoryId },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        const existingProduct = await this.productsRepository.findOne({
            where: { name: productData.name, category: category },
        });

        if (existingProduct) {
            throw new ConflictException('Product name must be unique within the category');
        }

        const product = this.productsRepository.create({
            ...productData,
            category,
        });

        try {
            return await this.productsRepository.save(product);
        } catch (error) {            
            if (error instanceof QueryFailedError && error.driverError.code === '23505') {
                throw new ConflictException('Product name must be unique within the category');
            }
            throw new InternalServerErrorException('Database error: ' + error.message);
        }
    }

    async findAll(): Promise<Products[]> {
        return await this.productsRepository.find({ 
            relations: ['category'],
            order: {
                id: 'DESC'
            }
        });
    }
}