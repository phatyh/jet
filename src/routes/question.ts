import { Router } from "express";
import { QuestionController } from "../controllers";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

//Get all questions
router.get("/", QuestionController.getAll)

.get('/random', QuestionController.random)

// Get one question
.get("/:id([0-9a-zA-Z_]+)", [checkJwt, checkRole(["ADMIN"])], QuestionController.getOne)

//Create a new question
.post("/", [checkJwt], QuestionController.create)

// check question answer
.post('/check', [checkJwt], QuestionController.check)

//Edit one question
.put( "/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], QuestionController.update)

//Delete one question
.delete( "/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], QuestionController.delete);

export default router;
