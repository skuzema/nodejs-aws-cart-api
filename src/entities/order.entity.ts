import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { User } from './user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  user_id: User;

  @ManyToOne(() => Cart, (cart) => cart.orders)
  cart_id: Cart;

  @Column('json')
  payment: any;

  @Column('json')
  delivery: any;

  @Column('text')
  comments: string;

  @Column({ type: 'enum', enum: ['PENDING', 'COMPLETED', 'CANCELLED'] })
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';

  @Column('decimal')
  total: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
