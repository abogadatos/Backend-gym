import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Classes } from './classes.entity';

@Entity({
  name: 'reviews',
})
export class Reviews {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  rating: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  comment: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  created_at: number;

  @ManyToOne(() => Classes, (classEntity) => classEntity.reviews)
  @JoinColumn({ name: 'class_id' })
  class: Classes;

  // @ManyToOne(() => User, (user) => user.reviews)
  // @JoinColumn({ name: 'user_id' })
  // user: User;
}
