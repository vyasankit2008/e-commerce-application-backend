import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({
        description: 'The name of the category',
        example: 'Electronics',
    })
    @IsString({ message: 'Category name must be a string' })
    @IsNotEmpty({ message: 'Category name cannot be empty' })
    name: string;
}