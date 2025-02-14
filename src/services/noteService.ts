import { Note } from "@prisma/client";
import { AuthorizedBaseService } from "./baseService";
import { NoteData } from "../interface/userInterface";
import { NotAuthorizedResponse, NotFoundResponse } from "./errorResponse";
import { encrypt } from "../utils/encryption";
import { getActionableSteps } from "./llmService";
import actionableStepService from "./actionableStepService";


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
    
    async create(data: Partial<NoteData>, userRole?: string): Promise<Note> {
        if (!userRole) {
            throw new NotAuthorizedResponse("User credentials required");
        }
    
        if (userRole !== "DOCTOR") {
            throw new NotAuthorizedResponse("Only doctors can create notes");
        }
    
        const { content, doctorId, patientId } = data;
    
        if (!doctorId || !patientId) {
            throw new NotAuthorizedResponse("Doctor and patient IDs are required");
        }
    
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId : doctorId },
        });

        const patient = await this.prisma.patient.findUnique({
            where: { userId : patientId },
        });

        if (!doctor) throw new NotFoundResponse("Doctor profile not found");
        if (!patient) throw new NotFoundResponse("Patient profile not found");

        const encryptedContent = content ? encrypt(content) : "";

        const llmResponse = await getActionableSteps(content!) ;
        console.log(llmResponse.plan)
        const result = await this.prisma.$transaction(async (prisma) => {

            const note = await prisma.note.create({
                data: {
                    content: encryptedContent,
                    doctorId: doctor.id,
                    patientId: patient.id,
                },
            });


            // // 2. Create Actionable Steps Linked to Note
            // for (const step of [...llmResponse.checklist, ...llmResponse.plan]) {
            //     await prisma.actionableStep.create({
            //         data: {
            //             description: step.description,
            //             noteId: note.id, // Use note.id from transaction
            //             scheduledAt: step.schedule?.startDate ? new Date(step.schedule.startDate) : new Date(),
            //             recurrenceId: step.schedule?.recurrenceId || null
            //         }
            //     });
            // }

            for (const step of [...llmResponse.checklist, ...llmResponse.plan]) {
                const hasSchedule = step.schedule && typeof step.schedule.startDate === 'string';
                const scheduledDate = hasSchedule ? new Date(step.schedule!.startDate) : new Date();
              
                if (isNaN(scheduledDate.getTime())) {
                  console.error('Invalid schedule:', step.schedule);
                  throw new Error(`Invalid date for step: ${step.description}`);
                }
              
                await actionableStepService.createStep({
                    description: step.description,
                    noteId: note.id,
                    scheduledAt: scheduledDate,
                    recurrence: step.schedule && step.schedule.occurrences !== undefined
                    ? {
                        startDate: scheduledDate,
                        repeatDays: step.schedule.repeatDays ?? 0,
                        occurrences: step.schedule.occurrences,
                        }
                    : undefined,
                  });
                  
              }
              
            
            
            // for (const step of [...llmResponse.checklist, ...llmResponse.plan]) {
            //     if (step.schedule && typeof step.schedule === 'object') {
            //         // For scheduled steps with recurrence
                    
            //         await actionableStepService.createStep({
            //             description: step.description,
            //             noteId: note.id,
            //             scheduledAt: new Date(step.schedule.startDate),
            //             recurrence: {
            //                 startDate: new Date(step.schedule.startDate),
            //                 repeatDays: step.schedule.repeatDays,
            //                 occurrences: step.schedule.occurrences
            //             }
            //         });
            //     } else {
            //         // For one-time or checklist steps
            //         await actionableStepService.createStep({
            //             description: step.description,
            //             noteId: note.id,
            //             scheduledAt: new Date() 
            //         });
            //     }
            // }
            
            return note;
        });

        return result;
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
