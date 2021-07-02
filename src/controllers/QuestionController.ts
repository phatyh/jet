
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { nanoid } from 'nanoid'
import { Questions } from "../entity/Questions";
import { currentUserId } from "../helper/jwt";
import { Choices } from "../entity/Choices";
import { shuffle } from "../helper/shuffle";

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
    const choiceRepo = getRepository(Choices);
    try {
      const data = await baseRepo.createQueryBuilder('q')
        .where('q.hash = :hash', {hash: Id})
        .andWhere('c.isCorrect = :isCorrect', {isCorrect: 1})
        .select(['q.createdAt', 'q.createdUser', 'q.question', 'q.updatedAt', 'c.answer', 'c.hash'])
        .leftJoin('q.choices', 'c')
        .getOneOrFail();

      const getWrongs = await choiceRepo.createQueryBuilder('c')
        .select(['c.answer', 'c.hash'])
        .where('c.questionHash = :questionHash', {questionHash: Id})
        .andWhere('c.isCorrect = :isCorrect', {isCorrect: 0})
        .orderBy('RANDOM()')
        .limit(3)
        .getMany();

      data.choices.push(...getWrongs);

      shuffle(data.choices);

      // res.json(data);
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
    data.question = question;
    data.hash = nanoid(11);
    data.createdUser = currentUserId(req);

    // Validade if the parameters are ok
    const errors = await validate(data);
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    // Try to save. If fails, the username is already in use
    const baseRepo = getRepository(Questions);
    const choiceRepo = getRepository(Choices);
    try {
      await baseRepo.save(data).then(question => {
        const getWrong: Choices[] = choices.map(choice => {
          choice.hash = nanoid(16);
          choice.questionHash = question.hash;
          choice.isCorrect = false;

          choiceRepo.save(choice);
        });

        

        return question;
      }).then(question => {
        const getRight = new Choices();

        getRight.hash = nanoid(16);
        getRight.answer = correct;
        getRight.questionHash = question.hash;
        getRight.isCorrect = true;

        choiceRepo.save(getRight);
      });
    } catch (e) {
      res.status(409).json("username already in use");
      return;
    }

    // If all ok, send 201 response
    res.status(201).json(await baseRepo.findOneOrFail(data.hash, {
      relations: ['']
    }));
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
    data.question = question;

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
    const {question, answer} = req.body;

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
};
