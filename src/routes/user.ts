import { Router } from "express";
import { UserController } from "../controllers";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

router

// Get all users
// .get("/", [checkJwt, checkRole(["ADMIN"])], UserController.listAll);
.get("/", UserController.listAll)

// Get one user
.get("/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], UserController.getOneById)

//Create a new user
.post("/", [checkJwt, checkRole(["ADMIN"])], UserController.newUser)

//Edit one user
.put( "/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], UserController.editUser)

//Delete one user
.delete( "/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])], UserController.deleteUser);

export default router;  