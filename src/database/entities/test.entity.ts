import { MembershipStatus } from 'src/enum/membership_status.enum';
import { Role } from 'src/enum/roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookedClasses } from './booked_classes.entity';
import { Attendance } from './attendance.entity';
import { Reviews } from './reviews.entity';