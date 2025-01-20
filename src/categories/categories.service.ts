import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';
import { CreateCategoryDto } from './categories.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category) private categoriesRepository: Repository<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {        
        const categoryName = createCategoryDto.name.toLowerCase();
        const existingCategory = await this.categoriesRepository.findOne({
            where: { name: categoryName },
        });

        if (existingCategory) {
            throw new ConflictException('Category name must be unique');
        }
        
        const category = this.categoriesRepository.create({ ...createCategoryDto, name: categoryName });
        return this.categoriesRepository.save(category);
    }

    async findAll(): Promise<Category[]> {
        return this.categoriesRepository.find({
            order: {
                id: 'DESC',
            },
        });    
    }
}