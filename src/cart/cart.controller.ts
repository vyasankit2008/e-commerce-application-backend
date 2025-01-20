import { Controller, Post, Get, Body, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './cart.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Cart } from './cart.entity';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new cart' })
    async create(@Body() createCartDto: CreateCartDto): Promise<Cart> {
        return this.cartService.createCart(createCartDto);
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Get cart by user ID' })
    async getCart(@Param('userId') userId: string): Promise<Cart[]> {
        return this.cartService.getCart(userId);
    }

    // @Delete(':cartId')
    // @ApiOperation({ summary: 'Delete cart by cart ID' })
    // async deleteCart(@Param('cartId') cartId: number): Promise<void> {
    //     return this.cartService.deleteCart(cartId);
    // }

    @Delete(':cartId/product/:productId')
    @ApiOperation({ summary: 'Delete a specific item from the cart by cart ID and product ID' })
    async deleteCart(
        @Param('cartId') cartId: number,
        @Param('productId') productId: number
    ): Promise<void> {
        return this.cartService.deleteCart(cartId, productId);
    }
}