import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './order.dto';
import { Products } from 'src/products/products.entity';
import { Cart } from 'src/cart/cart.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
        @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
        @InjectRepository(Products) private productRepository: Repository<Products>,
    ) { }

    async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
        const { userId, items, shippingDetails, paymentMethod } = createOrderDto;

        // Step 1: Validate product existence for each item
        for (const item of items) {
            const product = await this.productRepository.findOne({ where: { id: item.productId } });
            if (!product) {
                throw new NotFoundException(`Product with ID ${item.productId} not found`);
            }
        }

        // Step 2: Calculate the total amount of the order
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Step 3: Create the order
        const order = this.orderRepository.create({
            userId,
            items,
            shippingDetails,
            paymentMethod,
            totalAmount,
        });

        const savedOrder = await this.orderRepository.save(order);

        // Step 4: Delete cart items after order is created
        await this.deleteCartAfterOrder(userId, items);

        return savedOrder;
    }

    async deleteCartAfterOrder(userId: any, items: any[]): Promise<void> {
        // Fetch the cart for the user
        const cart = await this.cartRepository.findOne({ where: { userId } });
        if (!cart) {
            throw new NotFoundException(`Cart not found for user ID ${userId}`);
        }

        // Step 5: Delete each item in the cart
        for (const item of items) {
            await this.deleteCart(cart.id, item.productId);
        }
    }

    async deleteCart(cartId: number, productId: number): Promise<void> {
        const cart = await this.cartRepository.findOne({ where: { id: cartId } });
        if (!cart) {
            throw new NotFoundException(`Cart not found for ID ${cartId}`);
        }

        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) {
            throw new NotFoundException(`Item with product ID ${productId} not found in the cart`);
        }

        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);

        // If cart is empty, delete it, else save updated cart
        if (cart.items.length === 0) {
            await this.cartRepository.delete(cartId);
        } else {
            await this.cartRepository.save(cart);
        }
    }    

    async getOrder(userId: string): Promise<any> {
        const orders = await this.orderRepository.find({
            where: { userId },
            order: { id: 'DESC' },
        });

        if (orders.length === 0) {
            return [];
        }

        for (let order of orders) {
            for (let item of order.items) {
                const product = await this.productRepository.findOne({ where: { id: item.productId } });

                if (product) {
                    item['product'] = {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        description: product.description,
                        createdat: product.createdat,
                    };
                }
            }
        }

        return orders;
    }
}