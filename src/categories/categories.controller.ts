import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './categories.dto';
import { Category } from './categories.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/role.enum';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()    
    @UseGuards(JwtAuthGuard, RolesGuard)    
    @Roles(Role.ADMIN) // @Roles('admin')
    @ApiOperation({ summary: 'Create a new category' })
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)    
    @Roles(Role.ADMIN, Role.USER) // @Roles('admin','user') 
    @ApiOperation({ summary: 'Get all categories' })
    async findAll(): Promise<Category[]> {
        return this.categoriesService.findAll();
    }
}