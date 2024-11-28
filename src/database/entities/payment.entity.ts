import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Memberships } from './membership.entity';
import { User } from './user.entity';


@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  user_id: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  membership_id: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  payment_date: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  amount: number;

  @Column({ 
    type: 'varchar', 
    length: 50, 
    nullable: false })
  payment_method: string;
  

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'failed'],
    nullable: false,
  })
  status: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  transaction_id: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Memberships, (membership) => membership.payments)
  @JoinColumn({ name: 'membership_id' })
  membership: Memberships;
}
