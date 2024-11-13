import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Classes } from "./classes.entity";

@Entity('attendance')
export class Attendance{
    @PrimaryGeneratedColumn('uuid')
    id:string

    // @ManyToOne(()=>Users,user=>user.attendanceRecords)
    // @JoinColumn({name:'user_id'})
    // user:Users

    @ManyToOne(()=>Classes, classEntity=>classEntity.attendanceRecords)
    @JoinColumn({name:'class_id'})
    class:Classes

    @Column({type:'timestamp'})
    check_in_time:Date

    @Column({type:'timestamp',nullable:true})
    check_out_time:Date


}