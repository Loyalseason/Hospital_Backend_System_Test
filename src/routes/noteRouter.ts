import express from "express";
import { authMiddleware } from "../middlewares/authentication";
import noteController from "../controllers/noteController";

const noteRouter = express.Router();

noteRouter.use(authMiddleware({ tokenType: "access" }));

noteRouter.get("/note/:id?", noteController.getNote);

noteRouter.post("/note", noteController.createNote);

noteRouter.put("/note", noteController.updateNote);





export default noteRouter;

