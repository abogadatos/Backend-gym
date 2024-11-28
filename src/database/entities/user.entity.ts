import { MembershipStatus } from 'src/enum/membership_status.enum';
import { Role } from 'src/enum/roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookedClasses } from './booked_classes.entity';
import { Attendance } from './attendance.entity';
import { Reviews } from './reviews.entity';
import { Payment } from './payment.entity';
import { Trainers } from './trainer.entity';

@Entity({
  name: 'users',
})
export class User {
  /**
   * Unique identifier for each user, generated as a UUID.
   *
   * @example "c4d7a29b-32be-4d41-b0e1-9db8f6f4ec45"
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * User's first name.
   *
   * @remarks
   * Name must be unique and should not exceed 50 characters.
   *
   * @example "Linus Benedict"
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  /**
   * User's unique email address used for login and communication.
   *
   * @remarks
   * Must be a unique and non-empty string, up to 50 characters in length.
   *
   * @example "linus.torvals@genius.com"
   */
  @Column({
    type: 'varchar',
    length: 80,
    nullable: false,
  })
  email: string;

  /**
   * Hashed password for user authentication.
   *
   * @remarks
   * Stored as a varchar to accommodate hashed strings up to 80 characters.
   */
  @Column({
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  password: string;

  /**
   * User's phone number for contact purposes.
   *
   * @remarks
   * Stored as a varchar due to potential international formats and length requirements.
   *
   * @example "+1-202-555-0173"
   */
  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  phone: string;

  /**
   * Authentication method used by the user.
   *
   * @remarks
   * Acceptable values are "google" or "form".
   * The default value is "form".
   *
   * @example "google"
   */
  @Column({
    type: 'varchar', // Store it as a simple string in the database
    length: 16, // Limit length for validation purposes
    nullable: false, // Ensure it's always set
    default: 'form', // Set the default value
  })
  auth: 'google' | 'googleIncomplete' | 'form'; // Define acceptable values as a TypeScript union type

  /**
   * Roles assigned to the user, which dictate their permissions within the platform.
   *
   * @remarks
   * Default role is 'User'. Possible roles are defined in the `Role` enum.
   *
   * @example ["User", "Associate", "Trainer", "Admin", "Super"]
   */
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  roles: Role;

  /**
   * Membership status assigned to the user, indicating the current state of their membership.
   *
   * @remarks
   * The default status is 'Inactive'. Possible statuses are defined in the `MembershipStatus` enum.
   * This field reflects whether a user's membership is active, expired, on trial, etc.
   *
   * @example ["inactive", "active", "expired", "canceled", "trial", "pending", "suspended"]
   */
  @Column({
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus.Inactive,
  })
  membership_status: MembershipStatus;

  /**
   * Country of residence for the user.
   *
   * @remarks
   * Optional field, up to 50 characters in length.
   *
   * @example "Colombia"
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  country: string;

  /**
   * Full address of the user.
   *
   * @remarks
   * Optional field, stored as text to accommodate various address formats.
   *
   * @example "P. Sherman 42 Wallaby Way, Sidney"
   */
  @Column({
    type: 'text',
    nullable: true,
  })
  address: string;

  /**
   * URL of the product's image.
   *
   * - Optional.
   *
   * @remarks
   * Providing a URL allows the product to have an associated image for display purposes.
   *
   * @example "https://example.com/image.jpg"
   */
  @Column({
    type: 'text',
    default: `https://res.cloudinary.com/dwhejzrua/image/upload/v1727710566/um0h7zmnozrblufpcikd.jpg`,
  })
  image: string;

  /**
   * Timestamp indicating when the user account was created.
   *
   * @remarks
   * Automatically generated when a new user record is created.
   *
   * @example "2024-10-13T14:20:30.000Z"
   */
  @CreateDateColumn()
  created_At: Date;

  @UpdateDateColumn()
  updated_At: Date;

  @OneToOne(() => Trainers, (trainers) => trainers.userID)
  @OneToMany(() => BookedClasses, (bookedClasses) => bookedClasses.user)
  bookedClasses: BookedClasses[];

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendanceRecords: Attendance[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Reviews, (reviews) => reviews.user)
  reviews: Reviews[];
}
