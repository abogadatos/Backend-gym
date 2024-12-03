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
import { BanStatus } from 'src/enum/banStatus.enum';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({
    description: 'Unique identifier for each user',
    example: 'c4d7a29b-32be-4d41-b0e1-9db8f6f4ec45',
  })
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
  @ApiProperty({
    description: "User's first name",
    example: 'Linus Benedict',
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
  @ApiProperty({
    description: "User's unique email address",
    example: 'linus.torvals@genius.com',
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
  @ApiProperty({
    description: 'Hashed password for user authentication',
    example: '**********',
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
  @ApiProperty({
    description: "User's phone number",
    example: '+1-202-555-0173',
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
    type: 'varchar',
    length: 16,
    nullable: false,
    default: 'form',
  })
  @ApiProperty({
    description: 'Authentication method used by the user',
    enum: ['google', 'googleIncomplete', 'form'],
    default: 'form',
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
  @ApiProperty({
    description: 'Roles assigned to the user',
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
  @ApiProperty({
    description: 'Membership status assigned to the user',
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
  @ApiProperty({
    description: "User's country of residence",
    example: 'Colombia',
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
  @ApiProperty({
    description: "User's full address",
    example: 'P. Sherman 42 Wallaby Way, Sidney',
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
  @ApiProperty({
    description: 'URL of the product image',
    example: 'https://example.com/image.jpg',
  })
  image: string;

  /**
   * Indicates if the user is banned.
   *
   * - Defaults to false.
   *
   * @remarks
   * This field determines whether the user is banned from the platform. If set to true,
   * the user is banned. The default is false, meaning the user is not banned.
   *
   * @example false
   */
  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
  })
  @ApiProperty({
    description: 'Indicates if the user is banned',
    example: false,
  })
  banned: boolean;

  /**
   * Reason for banning the user.
   *
   * - Optional.
   *
   * @remarks
   * This field provides the reason for banning the user. It is optional and may be
   * left null if no reason is specified.
   *
   * @example 'Repeated violations of terms'
   */
  @Column({
    type: 'text',
    nullable: true,
  })
  @ApiProperty({
    description: 'Reason for banning the user',
    example: 'Repeated violations of terms',
    nullable: true,
  })
  banReason: string;

  /**
   * Ban status of the user.
   *
   * - Defaults to 'None'.
   *
   * @remarks
   * This field indicates the current status of the user's ban. The default is 'None',
   * meaning no ban. The status is represented by an enum value.
   *
   * @example BanStatus.None
   */
  @Column({
    type: 'enum',
    enum: BanStatus,
    default: BanStatus.None,
  })
  @ApiProperty({
    description: 'Ban status of the user',
    enum: BanStatus,
    default: BanStatus.None,
  })
  banStatus: BanStatus;

  /**
   * Timestamp of when the user was banned.
   *
   * - Optional.
   *
   * @remarks
   * This field records the timestamp when the user was banned. It is optional and may
   * be null if the user is not banned.
   *
   * @example '2024-10-13T14:20:30.000Z'
   */
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  @ApiProperty({
    description: 'Timestamp of when the user was banned',
    example: '2024-10-13T14:20:30.000Z',
    nullable: true,
  })
  bannedAt: Date;

  /**
   * Timestamp when the user account was created.
   *
   * @remarks
   * Automatically generated when a new user record is created.
   *
   * @example "2024-10-13T14:20:30.000Z"
   */
  @CreateDateColumn()
  @ApiProperty({
    description: 'Timestamp when the user account was created',
    example: '2024-10-13T14:20:30.000Z',
  })
  created_At: Date;

  /**
   * Timestamp when the user account was last updated.
   *
   * @remarks
   * Automatically updated whenever the user record is modified.
   *
   * @example "2024-10-13T14:20:30.000Z"
   */
  @UpdateDateColumn()
  @ApiProperty({
    description: 'Timestamp when the user account was last updated',
    example: '2024-10-13T14:20:30.000Z',
  })
  updated_At: Date;

  /**
   * Booked classes for the user.
   *
   * - Optional.
   *
   * @remarks
   * This field represents the list of classes the user has booked. It is a one-to-many
   * relationship with the `BookedClasses` entity, meaning a user can have multiple
   * booked classes.
   *
   * @example [{ "id": 1, "className": "Yoga 101", "date": "2024-10-13T14:00:00.000Z" }]
   */
  @OneToOne(() => Trainers, (trainers) => trainers.userID)
  @OneToMany(() => BookedClasses, (bookedClasses) => bookedClasses.user)
  @ApiProperty({
    description: 'Booked classes for the user',
    type: [BookedClasses],
  })
  bookedClasses: BookedClasses[];

  /**
   * Attendance records for the user.
   *
   * - Optional.
   *
   * @remarks
   * This field holds the attendance records for the user. It is a one-to-many
   * relationship with the `Attendance` entity, meaning a user can have multiple attendance
   * records.
   *
   * @example [{ "id": 1, "className": "Yoga 101", "status": "Present" }]
   */
  @OneToMany(() => Attendance, (attendance) => attendance.user)
  @ApiProperty({
    description: 'Attendance records for the user',
    type: [Attendance],
  })
  attendanceRecords: Attendance[];

  /**
   * Payments made by the user.
   *
   * - Optional.
   *
   * @remarks
   * This field holds the payment records for the user. It is a one-to-many
   * relationship with the `Payment` entity, meaning a user can have multiple payment records.
   *
   * @example [{ "id": 1, "amount": 100, "date": "2024-10-13T14:00:00.000Z" }]
   */
  @OneToMany(() => Payment, (payment) => payment.user)
  @ApiProperty({
    description: 'Payments made by the user',
    type: [Payment],
  })
  payments: Payment[];

  /**
   * Reviews submitted by the user.
   *
   * - Optional.
   *
   * @remarks
   * This field holds the reviews that the user has submitted. It is a one-to-many
   * relationship with the `Reviews` entity, meaning a user can have multiple reviews.
   *
   * @example [{ "id": 1, "rating": 5, "reviewText": "Great class!" }]
   */
  @OneToMany(() => Reviews, (reviews) => reviews.user)
  @ApiProperty({
    description: 'Reviews submitted by the user',
    type: [Reviews],
  })
  reviews: Reviews[];
}
