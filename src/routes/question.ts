import { Router } from "express";
import { QuestionController } from "../controllers";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

//Get all questions
router.get("/", QuestionController.getAll)

// Get one question
.get("/:id([0-9a-zA-Z_]+)", QuestionController.getOne)

.get('/random', QuestionController.random)

// check question answer
.post('/check', [checkJwt], QuestionController.check)

//Create a new question
.post("/", [checkJwt], QuestionController.create)

//Edit one question
.put( "/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], QuestionController.update)

//Delete one question
.delete( "/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], QuestionController.delete);

export default router;
