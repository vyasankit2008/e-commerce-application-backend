import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CreateCartDto } from './cart.dto';
import { Products } from '../products/products.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart) private cartRepository: Repository<Cart>,
        @InjectRepository(Products) private productRepository: Repository<Products>,
    ) { }

    async createCart(createCartDto: CreateCartDto): Promise<Cart> {
        const { userId, items } = createCartDto;

        let cart = await this.cartRepository.findOne({
            where: { userId },
            order: { id: 'DESC' },
        });

        if (!cart) {
            cart = this.cartRepository.create({
                userId,
                items: [],
            });
        }

        // console.log('Existing cart items:', cart.items);

        for (const item of items) {
            // console.log('Processing item:', item);

            const product = await this.productRepository.findOne({ where: { id: item.productId } });
            if (!product) {
                throw new NotFoundException(`Product with ID ${item.productId} not found`);
            }

            const existingItem = cart.items.find(cartItem => cartItem.productId === item.productId);

            if (existingItem) {
                existingItem.quantity += item.quantity;
                existingItem.price = item.price;
                // console.log('Updated existing item:', existingItem);
            } else {
                cart.items.push({
                    productId: product.id,
                    quantity: item.quantity,
                    price: item.price,
                });
                // console.log('Added new item to cart:', item);
            }
        }

        return await this.cartRepository.save(cart);
    }

    async createCart1(createCartDto: CreateCartDto): Promise<Cart> {
        const { userId, items } = createCartDto;

        const cart = this.cartRepository.create({ userId, items: [] });

        for (const item of items) {
            const product = await this.productRepository.findOne({ where: { id: item.productId } });

            if (!product) {
                throw new NotFoundException(`Product with ID ${item.productId} not found`);
            }

            const existingItem = cart.items.find(cartItem => cartItem.productId === item.productId);
            // console.log('existingItem---->', existingItem);

            cart.items.push({
                productId: product.id,
                quantity: item.quantity,
                price: item.price,
            });
        }

        return await this.cartRepository.save(cart);
    }

    async getCart(userId: string): Promise<Cart[]> {
        const carts = await this.cartRepository.find({
            where: { userId },
            order: { id: 'DESC' },
        });

        if (carts.length === 0) {
            // throw new NotFoundException(`No carts found for user ID ${userId}`);
            return [];
        }

        for (let cart of carts) {
            for (let item of cart.items) {
                const product = await this.productRepository.findOne({ where: { id: item.productId } });

                if (product) {
                    item['product'] = {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        description: product.description,
                        createdat: product.createdat
                    };
                }
            }
        }

        return carts;
    }

    async deleteCart1(cartId: number): Promise<void> {
        const cart = await this.cartRepository.findOne({ where: { id: cartId } });
        if (!cart) {
            throw new NotFoundException(`Cart not found for ID ${cartId}`);
        }

        await this.cartRepository.delete(cartId);
    }

    async deleteCart2(cartId: number, productId: number): Promise<void> {
        const cart = await this.cartRepository.findOne({ where: { id: cartId } });
        if (!cart) {
            throw new NotFoundException(`Cart not found for ID ${cartId}`);
        }

        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) {
            throw new NotFoundException(`Item with product ID ${productId} not found in the cart`);
        }

        cart.items.splice(itemIndex, 1);
        
        await this.cartRepository.save(cart);
    }

    async deleteCart(cartId: number, productId: number): Promise<void> {
        const cart = await this.cartRepository.findOne({ where: { id: cartId }});
        if (!cart) {
            throw new NotFoundException(`Cart not found for ID ${cartId}`);
        }

        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) {
            throw new NotFoundException(`Item with product ID ${productId} not found in the cart`);
        }        
        
        cart.items.splice(itemIndex, 1);        
        
        if (cart.items.length === 0) {
            await this.cartRepository.delete(cartId);
        } else {
            await this.cartRepository.save(cart);
        }
    }
}