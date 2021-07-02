import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import { QuestionController } from "../controllers/QuestionController";

const router = Router();

//Get all users
router.get("/", [checkJwt], QuestionController.getAll)

// Get one user
.get("/:id([0-9a-zA-Z]+)", [checkJwt, checkRole(["ADMIN"])], QuestionController.getOne)

//Create a new user
.post("/", [checkJwt], QuestionController.create)

// check question answer
.post('/check', [checkJwt], QuestionController.check)

//Edit one user
.patch( "/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], QuestionController.update)

//Delete one user
.delete( "/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], QuestionController.delete);

export default router;
