import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Classes } from './classes.entity';
import { User } from './user.entity';

@Entity('booked_classes')
export class BookedClasses {
  @PrimaryGeneratedColumn('uuid')
  id: string;

   @ManyToOne(()=>User,user=>user.bookedClasses)
   @JoinColumn({name:'user_id'})
    user:User

  @ManyToOne(() => Classes, (classEntity) => classEntity.bookedClasses)
  @JoinColumn({ name: 'class_id' })
  class: Classes;

  @Column({ type: 'timestamp' })
  booking_date: Date;

  @Column({ type: 'enum', enum: BookedClasses })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
