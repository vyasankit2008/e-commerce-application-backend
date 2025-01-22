import { Controller, Post, Get, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './cart.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Cart } from './cart.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a new cart' })
    async create(@Body() createCartDto: CreateCartDto): Promise<Cart> {
        return this.cartService.createCart(createCartDto);
    }

    @Get(':userId')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get cart by user ID' })
    async getCart(@Param('userId') userId: string): Promise<Cart[]> {
        return this.cartService.getCart(userId);
    }    

    @Delete(':cartId/product/:productId')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a specific item from the cart by cart ID and product ID' })
    async deleteCart(
        @Param('cartId') cartId: number,
        @Param('productId') productId: number
    ): Promise<void> {
        return this.cartService.deleteCart(cartId, productId);
    }
}