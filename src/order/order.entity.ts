import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'jsonb' })
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;

  @Column({ type: 'jsonb' })
  shippingDetails: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  @Column({ type: 'varchar', length: 50 })
  paymentMethod: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
