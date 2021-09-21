import { Length } from "class-validator";
import { nanoid } from "nanoid";
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Choices } from "./choices.entity";

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

    @BeforeInsert()
    initSave() {
        this.hash = nanoid(11);
    }
}
