import express from "express";
import { authMiddleware } from "../middlewares/authentication";
import patientController from "../controllers/patientController";

const patientRouter = express.Router();

patientRouter.use(authMiddleware({ tokenType: "access" }));

patientRouter.post('/patients/profile',  patientController.createPatientProfile);
patientRouter.post('/patients/assign-doctor',  patientController.assignDoctor);
patientRouter.get('/patients/doctor',  patientController.getAssignedDoctor);




export default patientRouter;

