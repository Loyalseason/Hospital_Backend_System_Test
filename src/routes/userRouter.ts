import express from "express";
import { authMiddleware } from "../middlewares/authentication";
import userController from "../controllers/userController";

const userRouter = express.Router();

userRouter.use(authMiddleware({ tokenType: "access" }));
userRouter.get("/user", userController.getUserById);

export default userRouter;

