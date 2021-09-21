import { Choices } from "../entity";

export class ChoiceController {
    static saveWrong = (questionHash: string, choice: Choices) => {
        choice.questionHash = questionHash;
        choice.isCorrect = false;

        choice.save();
    }

    static saveRight = (questionHash: string, choice: Choices) => {
        choice.questionHash = questionHash;
        choice.isCorrect = true;

        choice.save();
    }
}