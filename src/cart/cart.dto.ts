import { IsNotEmpty, IsInt, IsString, IsDecimal, Min, ValidateNested, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CartItemDto {
  @ApiProperty({ description: 'Product ID', example: 1 })
  @IsInt({ message: 'Product ID must be an integer' })
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: number;

  @ApiProperty({ description: 'Quantity of the product', example: 2 })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be greater than 0' })
  @IsNotEmpty({ message: 'Quantity is required' })
  quantity: number;

  @ApiProperty({ description: 'Price of the product', example: 19.99 })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  @IsNotEmpty({ message: 'Price is required' })
  price: number;
}

export class CreateCartDto {
  @ApiProperty({ description: 'User ID associated with the cart', example: 'user123' })
  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @ApiProperty({
    description: 'List of cart items (product details)',
    type: [CartItemDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}

export class UpdateCartItemDto {
  @ApiProperty({ description: 'Product ID', example: 1 })
  @IsInt({ message: 'Product ID must be an integer' })
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: number;

  @ApiProperty({ description: 'Quantity of the product', example: 2 })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be greater than 0' })
  @IsNotEmpty({ message: 'Quantity is required' })
  quantity: number;

  @ApiProperty({ description: 'Price of the product', example: 19.99 })
  @IsDecimal({ decimal_digits: '2', force_decimal: true }, { message: 'Price must be a valid decimal number' })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  @IsNotEmpty({ message: 'Price is required' })
  price: number;
}

export class UpdateCartDto {
  @ApiProperty({ description: 'User ID associated with the cart', example: 'user123' })
  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @ApiProperty({
    description: 'Updated list of cart items',
    type: [UpdateCartItemDto],
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateCartItemDto)
  items: UpdateCartItemDto[];
}