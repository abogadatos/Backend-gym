import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn,JoinColumn } from "typeorm";
import { Classes } from "./classes.entity";
import { BookedClasses } from "./booked_classes.entity";

@Entity('ClassSchedule')
export class ClassSchedule{

@PrimaryGeneratedColumn('uuid')
id:string

@Column()
day:string

@Column({ type: 'time' })
startTime: string

@Column({ type: 'time' })
endTime: string

@Column({ default: 0 })
currentParticipants: number

@Column({ type: 'int', nullable: false })
remainingCapacity: number;

@ManyToOne(() => Classes, (classes) => classes.schedules)
@JoinColumn({ name: 'class' })
class: Classes;

@OneToMany(() => BookedClasses, (bookedClass) => bookedClass.schedule)
bookedClasses: BookedClasses[]

}