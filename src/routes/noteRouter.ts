import express from "express";
import { authMiddleware } from "../middlewares/authentication";
import noteController from "../controllers/noteController";

const noteRouter = express.Router();

noteRouter.use(authMiddleware({ tokenType: "access" }));

noteRouter.get("/note/:id?", noteController.getNote);

noteRouter.post("/note", noteController.createNote);

noteRouter.put("/note", noteController.updateNote);

noteRouter.post("/actionable-steps", noteController.createActionableStep);

noteRouter.put("/actionable-steps/:stepId/complete", noteController.completeActionableStep);

noteRouter.get("/actionable-steps/:noteId/pending", noteController.getPendingSteps);

noteRouter.get("/actionable-steps/reminders", noteController.getActionableStepsWithReminders);




export default noteRouter;

