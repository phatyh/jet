import { Router } from "express";
import auth from "./auth";
import user from "./user";
import question from "./question";

const routes = Router();

routes.use("/auth", auth);
routes.use("/users", user);
routes.use("/questions", question);

export default routes;

// module.exports = routes;
