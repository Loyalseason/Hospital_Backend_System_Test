import { Note } from "@prisma/client";
import { AuthorizedBaseService, BaseService } from "./baseService";
import { NoteData } from "../interface/userInterface";
import { NotAuthorizedResponse, NotFoundResponse } from "./errorResponse";

export class NoteService extends AuthorizedBaseService<Note> {
    constructor() {
        super('note');
    }

    protected async checkAuthorization(id: string, userId: string, userRole: string): Promise<boolean> {
        const note = await this.find(id);
        if (!note) throw new NotFoundResponse("Note not found");

        return !(
            (userRole === "DOCTOR" && note.doctorId !== userId) ||
            (userRole === "PATIENT" && note.patientId !== userId)
        );
    }
    

    async update(id: string, data: Partial<NoteData>, userId?: string, userRole?: string): Promise<Note | null> {
        if (!userId || !userRole) {
            throw new NotAuthorizedResponse("User credentials required");
        }
        return this.authorizedUpdate(id, data, userId, userRole);
    }

    async findNotesByPatient(patientId: string): Promise<NoteData[]> {
        return await this.prisma.note.findMany({
            where: { patientId }
        });
    }

    async findNotesByDoctor(doctorId: string): Promise<NoteData[]> {
        return await this.prisma.note.findMany({
            where: { doctorId }
        });
    }
}

export default new NoteService();
