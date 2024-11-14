import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Classes } from './classes.entity';
import { User } from './user.entity';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  check_in_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  check_out_time: Date;

  @ManyToOne(() => User, (user) => user.attendanceRecords)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Classes, (classEntity) => classEntity.attendanceRecords)
  @JoinColumn({ name: 'class_id' })
  class: Classes;
}
