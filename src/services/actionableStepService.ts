import { ActionableStep, PrismaClient } from "@prisma/client";
import { NotFoundResponse } from "./errorResponse";

const prisma = new PrismaClient();

interface CreateStepInput {
    description: string;
    noteId: string;
    scheduledAt: Date;
}

export class ActionableStepService {
    async createStep(data: CreateStepInput): Promise<ActionableStep> {
        return await prisma.actionableStep.create({
            data: {
                description: data.description,
                noteId: data.noteId,
                scheduledAt: data.scheduledAt,
            },
        });
    }

    async completeStep(stepId: string): Promise<ActionableStep> {
        const step = await prisma.actionableStep.findUnique({
            where: { id: stepId }
        });

        if (!step) {
            throw new NotFoundResponse('Step not found');
        }

        return await prisma.actionableStep.update({
            where: { id: stepId },
            data: { completed: true }
        });
    }

    async getPendingSteps(noteId?: string): Promise<ActionableStep[]> {
        return await prisma.actionableStep.findMany({
            where: {
                ...(noteId && { noteId }),
                completed: false,
                scheduledAt: { lte: new Date() }
            },
            orderBy: { scheduledAt: 'asc' }
        });
    }


    
    
}

export default new ActionableStepService();
