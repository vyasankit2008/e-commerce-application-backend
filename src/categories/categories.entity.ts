import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Products } from '../products/products.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Products, (product) => product.category)
  products: Products[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdat: Date;
}