import { IsNotEmpty, IsInt, IsString, IsArray, ValidateNested, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class OrderItemDto {
  @ApiProperty({ description: 'Product ID', example: 16 })
  @IsInt({ message: 'Product ID must be an integer' })
  productId: number;

  @ApiProperty({ description: 'Quantity of the product', example: 2 })
  @IsInt({ message: 'Quantity must be an integer' })
  quantity: number;

  @ApiProperty({ description: 'Price of the product', example: 300 })
  @IsNotEmpty({ message: 'Price is required' })
  price: number;
}

class ShippingDetailsDto {
  @ApiProperty({ description: 'Shipping address', example: '123 Street Name' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'City', example: 'New York' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'State', example: 'NY' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'Postal Code', example: '10001' })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ description: 'Country', example: 'USA' })
  @IsString()
  @IsNotEmpty()
  country: string;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'User ID associated with the order', example: 'user123' })
  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @ApiProperty({
    type: [OrderItemDto],
    description: 'List of items in the order',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    type: ShippingDetailsDto,
    description: 'Shipping details for the order',
  })
  @ValidateNested()
  @Type(() => ShippingDetailsDto)
  shippingDetails: ShippingDetailsDto;

  @ApiProperty({
    description: 'Payment method (cash, card, UPI)',
    example: 'card',
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}
