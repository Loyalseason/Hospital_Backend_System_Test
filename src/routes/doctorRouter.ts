import express from "express";
import { authMiddleware } from "../middlewares/authentication";
import doctorController from "../controllers/doctorController";

const doctorRouter = express.Router();

doctorRouter.use(authMiddleware({ tokenType: "access" }));

doctorRouter.get('/doctors', doctorController.getAllDoctors);

doctorRouter.get('/doctors/patients',  doctorController.getDoctorPatients);

doctorRouter.post('/doctors/profile',  doctorController.createDoctorProfile);


export default doctorRouter;

