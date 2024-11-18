import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Classes } from './classes.entity';
import { User } from './user.entity';

@Entity('trainers')
export class Trainers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  bio: string;

  @Column({ type: 'varchar' })
  name: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  userID: User;

  @Column('varchar', { length: 255 })
  specialties: string;

  @Column('int')
  experience_years: number;

  @OneToMany(() => Classes, (classEntity) => classEntity.trainer)
  classes: Classes[];
}
