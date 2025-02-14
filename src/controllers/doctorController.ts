import { Request, Response } from "express";
import doctorService from "../services/doctorService";
import ApiResponse, {   SuccessResponse, BadRequestResponse, NotAuthorizedResponse } from "../services/errorResponse";
import { Role } from "@prisma/client";

class DoctorController {
    // Fetch all doctors (For admin or other roles)
    async getAllDoctors(req: Request, res: Response) {
        try {
            const doctors = await doctorService.getAllDoctors();
            return new SuccessResponse("Doctors retrieved successfully", doctors).send(res);
        } catch (error) {
            return new BadRequestResponse("Error retrieving doctors").send(res);
        }
    }

    // Get a doctor's assigned patients
    async getDoctorPatients(req: Request, res: Response) {
        try {
            const { id: userId, role } = req.user;

            if (role !== Role.DOCTOR) {
                return new NotAuthorizedResponse("Only doctors can access patient lists").send(res);
            }

            const patients = await doctorService.getPatients(userId);
            return new SuccessResponse("Patients retrieved successfully", patients).send(res);
        } catch (error) {
            if (error instanceof ApiResponse) {
                return error.send(res);
            }
            return new BadRequestResponse("Error retrieving patients").send(res);
        }
    }

    async createDoctorProfile(req: Request, res: Response) {
        try {
            const { id: userId, role } = req.user;

            if (role !== Role.DOCTOR) {
                return new NotAuthorizedResponse("Only doctors can create doctor profiles").send(res);
            }

            const doctorProfile = await doctorService.createDoctorProfile(userId);
            return new SuccessResponse("Doctor profile created successfully", doctorProfile).send(res);
        } catch (error) {
            if (error instanceof ApiResponse) {
                return error.send(res);
            }
            return new BadRequestResponse("Error creating doctor profile").send(res);
        }
    }
}

export default new DoctorController();