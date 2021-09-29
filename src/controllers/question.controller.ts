
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { shuffle } from "../helpers";
import { Choices, Questions } from "../entity";
import { ChoiceController } from "./choice.controller";

export class QuestionController {

  static getAll = async (req: Request, res: Response) => {
    //Get users from database
    const baseRepo = getRepository(Questions);
    const data = await baseRepo.find({
      // select: [] //We dont want to send the passwords on response
    });

    //Send the data object
    res.json(data);
  };

  static getOne = async (req: Request, res: Response) => {
    //Get the ID from the url
    const Id: string = req.params.id;

    //Get the user from database
    const baseRepo = getRepository(Questions);
    try {
      let data = await baseRepo.createQueryBuilder('q')
        .where('q.hash = :hash', { hash: Id })
        .select(['q.hash', 'q.createdAt', 'q.createdUser', 'q.content', 'q.updatedAt', 'c.answer', 'c.hash', 'c.isCorrect'])
        .leftJoin('q.choices', 'c')
        .getOneOrFail();

      data = this.setQuestion(data);

      res.status(200).json({
        message: '',
        status: true,
        data: data,
        errorCode: 200,
      });
    } catch (error) {
      res.status(404).json(error);
    }
  };

  static create = async (req: Request, res: Response) => {
    // Get parameters from the body
    let { question, correct, choices } = req.body;
    let data = new Questions();
    data.content = question;
    data.createdUser = res.locals.jwtPayload.userId;

    // Validade if the parameters are ok
    const errors = await validate(data);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    // Try to save. If fails, the username is already in use
    const baseRepo = getRepository(Questions);
    try {
      await baseRepo.save(data).then(question => {
        choices.map((choice: Choices) => {
          ChoiceController.saveWrong(question.hash, choice)
        });

        return question;
      }).then(question => {
        ChoiceController.saveRight(question.hash, correct);
      });
    } catch (e) {
      res.status(409).json("username already in use");
      return;
    }

    // If all ok, send 201 response
    res.status(201).json(await baseRepo.findOneOrFail(data.hash));
  };

  static update = async (req: Request, res: Response) => {
    //Get the ID from the url
    const Id = req.params.hash;

    //Get values from the body
    const { question } = req.body;

    //Try to find user on database
    const baseRepo = getRepository(Questions);
    let data: Questions;
    try {
      data = await baseRepo.findOneOrFail(Id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).json("User not found");
      return;
    }

    //Validate the new values on model
    data.content = question;

    const errors = await validate(data);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    //Try to safe, if fails, that means username already in use
    try {
      await baseRepo.save(data);
    } catch (e) {
      res.status(409).json("username already in use");
      return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).json();
  };

  static delete = async (req: Request, res: Response) => {
    //Get the ID from the url
    const Id: string = req.params.hash;

    const baseRepo = getRepository(Questions);
    let data: Questions;
    try {
      data = await baseRepo.findOneOrFail(Id);
    } catch (error) {
      res.status(404).json("Questions not found");
      return;
    }
    baseRepo.delete(Id);

    //After all send a 204 (no content, but accepted) response
    res.status(204).json();
  };

  static check = async (req: Request, res: Response) => {
    const { question, answer } = req.body;

    const choiceRepo = getRepository(Choices);

    const data = await choiceRepo.findOne({
      where: {
        hash: answer,
        questionHash: question,
        isCorrect: true,
      }
    });

    console.log('data', data);

    if (data) {
      res.status(200).json({
        message: 'Doğru cevap',
        status: true,
        data: '',
        errorCode: 200,
      });
    } else {
      res.status(200).json({
        message: 'Yanlış cevap',
        status: false,
        data: '',
        errorCode: 200,
      });
    }


  }

  static random = async (req: Request, res: Response) => {
    //Get the user from database
    const baseRepo = getRepository(Questions);
    try {
      let data = await baseRepo.createQueryBuilder('q')
        .select(['q.hash', 'q.createdAt', 'q.createdUser', 'q.content', 'q.updatedAt', 'c.answer', 'c.hash', 'c.isCorrect'])
        .leftJoin('q.choices', 'c')
        .orderBy('RANDOM()')
        .getOneOrFail();

      data = this.setQuestion(data);

      res.status(200).json({
        message: '',
        status: true,
        data: data,
        errorCode: 200,
      });
    } catch (error) {
      res.status(404).json(error);
    }
  }

  static setQuestion(data: Questions): Questions {
    let getCorrect: Choices;

    // get right
    getCorrect = data.choices.find(i => i.isCorrect === true);

    // get wrongs
    data.choices = data.choices
      .filter(i => i.isCorrect === false)
      .slice(0, 3);

    data.choices.push(getCorrect);

    shuffle(data.choices);

    data.choices = data.choices.map(i => {
      delete i.isCorrect;
      return i;
    });

    return data;
  }
};
