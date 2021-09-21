import { Router } from "express";
import { AuthController } from "../controllers";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
//Login route
router.post("/login", AuthController.login)

//Change my password
.post("/change-password", [checkJwt], AuthController.changePassword)

.post('/me', [checkJwt], AuthController.me);

export default router;