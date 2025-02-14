import { Note, PrismaClient } from "@prisma/client";
import { AuthorizedBaseService } from "./baseService";
import { NoteData } from "../interface/userInterface";
import { NotAuthorizedResponse, NotFoundResponse } from "./errorResponse";
import { encrypt } from "../utils/encryption";
import { stepQueue } from "../config/bullConfig";


export class NoteService extends AuthorizedBaseService<Note> {
    protected checkAuthorization(id: string, userId: string, userRole: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }    
    constructor() {
        super('note');
    }

    async create(data: Partial<NoteData>, userRole?: string): Promise<Note> {
        if (!userRole) throw new NotAuthorizedResponse("User credentials required");
        if (userRole !== "DOCTOR") throw new NotAuthorizedResponse("Only doctors can create notes");
    
        const { content, doctorId, patientId } = data;
        if (!doctorId || !patientId) throw new NotAuthorizedResponse("Doctor and patient IDs are required");
    
        const doctor = await this.prisma.doctor.findUnique({ where: { userId: doctorId } });
        const patient = await this.prisma.patient.findUnique({ where: { userId: patientId } });
    
        if (!doctor) throw new NotFoundResponse("Doctor profile not found");
        if (!patient) throw new NotFoundResponse("Patient profile not found");
    
        const encryptedContent = content ? encrypt(content) : "";
    
        // Create the note immediately
        const note = await this.prisma.note.create({
          data: {
            content: encryptedContent,
            doctorId: doctor.id,
            patientId: patient.id,
          },
        });
    
        try {
            const job = await stepQueue.add('create-steps', {
              noteId: note.id,
              content: content!,
            });
            console.log(`📨 Job added: ${job.id}`);
          } catch (error) {
            console.error('❌ Failed to add job to stepQueue:', error);
          }
          
    
        return note;
      }

    async update(id: string, data: Partial<NoteData>, userId?: string, userRole?: string): Promise<Note | null> {
        if (!userId || !userRole) {
            throw new NotAuthorizedResponse("User credentials required");
        }
        return this.authorizedUpdate(id, data, userId, userRole);
    }
    

    async findNotesByPatient(patientId: string): Promise<Note[]> {
        return await this.prisma.note.findMany({
            where: { patientId }
        });
    }

    async findNotesByDoctor(doctorId: string): Promise<Note[]> {
        return await this.prisma.note.findMany({
            where: { doctorId }
        });
    }
}

export default new NoteService();