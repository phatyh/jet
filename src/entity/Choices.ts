import { Length } from "class-validator";
import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import { Questions } from "./Questions";

@Entity()
export class Choices {
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
}
