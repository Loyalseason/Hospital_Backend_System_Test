import { Patient } from "@prisma/client";
import { AuthorizedBaseService } from "./baseService";
import { NotFoundResponse, NotAuthorizedResponse } from "./errorResponse";

export class PatientService extends AuthorizedBaseService<Patient> {
    protected checkAuthorization(id: string, userId: string, userRole: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    constructor() {
        super('patient');
    }

    async createPatientProfile(userId: string): Promise<Patient> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) throw new NotFoundResponse("User not found");
        if (user.role !== "PATIENT") throw new NotAuthorizedResponse("User is not a patient");

        return await this.prisma.patient.create({
            data: { userId }
        });
    }

    async assignDoctor(patientId: string, doctorId: string): Promise<Patient> {
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId: doctorId }
        });

        if (!doctor) throw new NotFoundResponse("Doctor not found");

        return await this.prisma.patient.update({
            where: { userId: patientId },
            data: { Doctor: { connect: { id: doctor.id } } }
        });
    }

    async getAssignedDoctor(patientId: string) {
        const patient = await this.prisma.patient.findUnique({
            where: { userId: patientId },
            include: { 
                Doctor: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!patient) throw new NotFoundResponse("Patient not found");
        return patient.Doctor;
    }
}

export default new PatientService();