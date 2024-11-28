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
import { Status } from 'src/enum/bookingStatus.enum';
import { ClassSchedule } from './ClassSchedule.entity';

@Entity('booked_classes')
export class BookedClasses {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.bookedClasses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Classes, (classEntity) => classEntity.bookedClasses)
  @JoinColumn({ name: 'class_id' })
  class: Classes;

  @ManyToOne(() => ClassSchedule, (schedule) => schedule.bookedClasses)
  @JoinColumn({ name: 'schedule_id' }) 
  schedule: ClassSchedule;
}
