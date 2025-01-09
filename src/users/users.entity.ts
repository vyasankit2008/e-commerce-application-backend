import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.enum';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;
  
  @Column()
  role: Role;
  
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdat: Date;
}