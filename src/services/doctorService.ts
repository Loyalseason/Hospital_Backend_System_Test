import { Doctor, Patient } from "@prisma/client";
import { AuthorizedBaseService } from "./baseService";
import { NotFoundResponse, NotAuthorizedResponse } from "./errorResponse";

export class DoctorService extends AuthorizedBaseService<Doctor> {
    protected checkAuthorization(id: string, userId: string, userRole: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    constructor() {
        super('doctor');
    }

    async createDoctorProfile(userId: string): Promise<Doctor> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) throw new NotFoundResponse("User not found");
        if (user.role !== "DOCTOR") throw new NotAuthorizedResponse("User is not a doctor");

        return await this.prisma.doctor.create({
            data: { userId }
        });
    }

    async getPatients(doctorId: string): Promise<Patient[]> {
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId: doctorId },
            include: { patients: true }
        });

        if (!doctor) throw new NotFoundResponse("Doctor not found");
        return doctor.patients;
    }

    async getAllDoctors(): Promise<Doctor[]> {
        return await this.prisma.doctor.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
    }
}

export default new DoctorService();