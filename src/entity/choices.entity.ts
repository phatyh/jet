import { BaseEntity, BeforeInsert, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { nanoid } from "nanoid";
import { Length } from "class-validator";
import { Questions } from "./questions.entity";

@Entity()
export class Choices extends BaseEntity {
    @PrimaryColumn()
    hash: string;

    @Column()
    @Length(11, 11)
    questionHash: string;

    @Column()
    @Length(1, 255)
    answer: string;

    @Column({ default: false })
    isCorrect: boolean;

    @ManyToOne(() => Questions, question => question.choices)
    question: Questions;

    @BeforeInsert()
    addHash() {
        this.hash = nanoid(16);
    }
}
