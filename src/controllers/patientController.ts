import { Request, Response } from "express";
import patientService from "../services/patientService";
import ApiResponse, {  NotFoundResponse, SuccessResponse, BadRequestResponse, NotAuthorizedResponse } from "../services/errorResponse";
import { Role } from "@prisma/client";

class PatientController {
    // Create a patient profile
    async createPatientProfile(req: Request, res: Response) {
        try {
            const { id: userId, role } = req.user;

            if (role !== Role.PATIENT) {
                return new NotAuthorizedResponse("Only patients can create patient profiles").send(res);
            }

            const patientProfile = await patientService.createPatientProfile(userId);
            return new SuccessResponse("Patient profile created successfully", patientProfile).send(res);
        } catch (error) {
            if (error instanceof ApiResponse) {
                return error.send(res);
            }
            return new BadRequestResponse("Error creating patient profile").send(res);
        }
    }

    // Assign a doctor to a patient
    async assignDoctor(req: Request, res: Response) {
        try {
            const { doctorId } = req.body;
            const { id: userId, role } = req.user;

            if (role !== Role.PATIENT) {
                return new NotAuthorizedResponse("Only patients can assign doctors").send(res);
            }

            if (!doctorId) {
                return new BadRequestResponse("Doctor ID is required").send(res);
            }

            const updatedPatient = await patientService.assignDoctor(userId, doctorId);
            return new SuccessResponse("Doctor assigned successfully", updatedPatient).send(res);
        } catch (error) {
            if (error instanceof ApiResponse) {
                return error.send(res);
            }
            return new BadRequestResponse("Error assigning doctor").send(res);
        }
    }

    // Get the assigned doctor for a patient
    async getAssignedDoctor(req: Request, res: Response) {
        try {
            const { id: userId, role } = req.user;

            if (role !== Role.PATIENT) {
                return new NotAuthorizedResponse("Only patients can view their assigned doctor").send(res);
            }

            const doctor = await patientService.getAssignedDoctor(userId);
            
            if (!doctor) {
                return new NotFoundResponse("No doctor assigned").send(res);
            }

            return new SuccessResponse("Doctor information retrieved successfully", doctor).send(res);
        } catch (error) {
            if (error instanceof ApiResponse) {
                return error.send(res);
            }
            return new BadRequestResponse("Error retrieving assigned doctor").send(res);
        }
    }
}

export default new PatientController();