import { Router } from "express";
import auth from "./auth";
import user from "./user";
import question from "./question";
import { QuestionController } from "../controllers";

const routes = Router();

routes
.use("/auth", auth)
.use("/user", user)
.use("/questions", question)
.use("/q/:id([0-9a-zA-Z_]+)", QuestionController.getOne);

export default routes;

// module.exports = routes;
