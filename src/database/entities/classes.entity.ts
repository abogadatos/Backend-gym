import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Reviews } from './reviews.entity';
import { BookedClasses } from './booked_classes.entity';
import { Trainers } from './trainer.entity';
import { Attendance } from './attendance.entity';

@Entity({
  name: 'classes',
})
export class Classes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  location: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  capacity: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  current_participants: number;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  schedule: Date;
  @Column({
    type: 'text',
  })
  imgUrl: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
  
  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  update_at: Date;
  

  @ManyToOne(() => Trainers, (trainer) => trainer.classes)
  @JoinColumn({ name: 'trainer_id' })
  trainer: Trainers;

  @OneToMany(() => Reviews, (review) => review.class)
  reviews: Reviews[];

  @OneToMany(() => BookedClasses, (bookedClass) => bookedClass.class)
  bookedClasses: BookedClasses[];

  @OneToMany(() => Attendance, (attendance) => attendance.class)
  attendanceRecords: Attendance[];
}
