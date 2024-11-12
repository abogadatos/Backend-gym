import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Reviews } from "./reviews.entity";


@Entity({
    name:"classes"
})
export class Classes{
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({
        type:"varchar",
        length:50,
        nullable:false,
    })
    name:string
    
    @Column({
        type:"text",
        nullable:false,
    })
    description:string;
    
    @Column({
        type:"text",
        nullable:false,
    })
    location:string

    @Column({
        type:"int",
        nullable:false,
    })
    capacity:number;
    
    @Column({
        type:"int",
        nullable:false,
    })
    current_participants:number

    @Column({
        type: "timestamp",
        nullable: false,
    })
    schedule: Date;
    @Column({
        type:"text",
    })
    imgUrl:string

    @Column({
        type: "timestamp",
        nullable: false,
    })
    created_at:number;
    @Column({
        type:"text",
        nullable:false,
    })
    update_at:number;

    // @ManyToOne(() => Trainer, (trainer) => trainer.classes)
    // @JoinColumn({ name: 'trainer_id' })
    // trainer: Trainer;

    @OneToMany(() => Reviews, (review) => review.class)
    reviews: Reviews[];
}