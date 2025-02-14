import { Router } from "express";
import authController from "../controllers/authController";
import { setRole } from "../middlewares/setRole";
import { Role } from "@prisma/client";
import { authMiddleware } from "../middlewares/authentication";
import userController from "../controllers/userController";


const authRouter = Router();

authRouter.post("/login", authController.login);

authRouter.post("/signUp", setRole(Role.PATIENT), authController.signUp);

authRouter.post("/doc-signUp", setRole(Role.DOCTOR), authController.signUp);

authRouter.post("/admin/signUp",  authController.signUp);

export default authRouter;
