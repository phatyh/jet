import { Length } from "class-validator";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Choices } from "./Choices";

@Entity()
export class Questions {
    @PrimaryColumn()
    hash: string;

    @Column()
    @Length(4, 255)
    question: string;

    // @Column({ default: '' })
    // // @Length(11, 11)
    // correctHash: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    createdUser: number;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Choices, choice => choice.question)
    choices: Choices[];
}
