import { ActionableStep, PrismaClient} from "@prisma/client";
import { AuthorizedBaseService } from "./baseService";
import { ActionableStepData } from "../interface/userInterface";
import { NotFoundResponse } from "./errorResponse";

const prisma = new PrismaClient();


interface CreateStepInput {
    description: string;
    noteId: string;
    scheduledAt: Date;
    recurrence?: {
        startDate: Date;
        repeatDays: number;
        occurrences: number;
    };
}

export class ActionableStepService {
   
    async createStep(data: CreateStepInput): Promise<ActionableStep> {
        if (!data.recurrence) {
          return await prisma.actionableStep.create({
            data: {
              description: data.description,
              noteId: data.noteId,
              scheduledAt: data.scheduledAt,
            },
          });
        }
      
        return await prisma.$transaction(async (prisma) => {
          // Create recurrence pattern
          const recurrence = await prisma.recurrence.create({
            data: {
              startDate: data.recurrence!.startDate,
              repeatDays: data.recurrence!.repeatDays,
              occurrences: data.recurrence!.occurrences,
            },
          });
      
          // Bulk create occurrences
          const stepsData = Array.from({ length: data.recurrence!.occurrences }, (_, i) => {
            const scheduledDate = new Date(data.recurrence!.startDate);
            scheduledDate.setDate(scheduledDate.getDate() + i * data.recurrence!.repeatDays);
            return {
              description: data.description,
              noteId: data.noteId,
              scheduledAt: scheduledDate,
              recurrenceId: recurrence.id,
            };
          });
      
          await prisma.actionableStep.createMany({ data: stepsData });
      
          // Return the first created step
          const firstStep = await prisma.actionableStep.findFirst({
            where: { recurrenceId: recurrence.id },
          });
      
          if (!firstStep) {
            throw new Error('No steps created');
          }
      
          return firstStep;
        });
      }
      
      

    async completeStep(stepId: string): Promise<ActionableStep> {
        const step = await prisma.actionableStep.findUnique({
            where: { id: stepId },
            include: { recurrence: true }
        });

        if (!step) {
            throw new NotFoundResponse('Step not found');
        }

        // Mark the current step as completed
        const updatedStep = await prisma.actionableStep.update({
            where: { id: stepId },
            data: { completed: true }
        });

        // If this is a recurring step and it's missed, adjust next occurrence
        if (step.recurrenceId && step.scheduledAt < new Date()) {
            const nextStep = await prisma.actionableStep.findFirst({
                where: {
                    recurrenceId: step.recurrenceId,
                    completed: false,
                    scheduledAt: { gt: new Date() }
                },
                orderBy: { scheduledAt: 'asc' }
            });

            if (nextStep) {
                // Adjust next step's scheduled time if needed
                const today = new Date();
                if (nextStep.scheduledAt < today) {
                    await prisma.actionableStep.update({
                        where: { id: nextStep.id },
                        data: { scheduledAt: today }
                    });
                }
            }
        }

        return updatedStep;
    }

    async getPendingSteps(noteId?: string): Promise<ActionableStep[]> {
        return await prisma.actionableStep.findMany({
            where: {
                ...(noteId && { noteId }),
                completed: false,
                scheduledAt: { lte: new Date() }
            },
            include: { recurrence: true },
            orderBy: { scheduledAt: 'asc' }
        });
    }

    async getUpcomingSteps(noteId?: string): Promise<ActionableStep[]> {
        return await prisma.actionableStep.findMany({
            where: {
                ...(noteId && { noteId }),
                completed: false,
                scheduledAt: { gt: new Date() }
            },
            include: { recurrence: true },
            orderBy: { scheduledAt: 'asc' }
        });
    }

    async processSteps(): Promise<void> {
        const pendingSteps = await this.getPendingSteps();
        
        for (const step of pendingSteps) {
            if (!step.completed && step.scheduledAt < new Date()) {
                if (step.recurrenceId) {
                    // For recurring steps, find next occurrence
                    const nextStep = await prisma.actionableStep.findFirst({
                        where: {
                            recurrenceId: step.recurrenceId,
                            completed: false,
                            scheduledAt: { gt: new Date() }
                        },
                        orderBy: { scheduledAt: 'asc' }
                    });

                    if (nextStep) {
                        // Send notification for missed step and upcoming one
                        await this.sendStepNotification(step, 'MISSED');
                        await this.sendStepNotification(nextStep, 'UPCOMING');
                    }
                } else {
                    // For one-time steps, just send missed notification
                    await this.sendStepNotification(step, 'MISSED');
                }
            }
        }
    }

    private async sendStepNotification(step: ActionableStep, type: 'MISSED' | 'UPCOMING'): Promise<void> {
        // Implement your notification logic here
        // This could integrate with your existing notification system
        console.log(`${type} step notification:`, {
            stepId: step.id,
            noteId: step.noteId,
            description: step.description,
            scheduledAt: step.scheduledAt
        });
    }
}

export default new ActionableStepService();