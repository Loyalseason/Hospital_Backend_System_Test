import { Worker, Job } from 'bullmq';
import { redisConfig } from '../config/redisConfig';
import actionableStepService from '../services/actionableStepService';
import { getActionableSteps } from '../services/llmService';

interface StepJobData {
  noteId: string;
  content: string;
}

const stepWorker = new Worker(
  'step-creation-queue',
  async (job: Job<StepJobData>) => {
    try {
      const { noteId, content } = job.data;
      console.log(`Processing steps for note ${noteId}`);

      const llmResponse = await getActionableSteps(content);

       for (const step of [...llmResponse.checklist, ...llmResponse.plan]) {
            const scheduledDate = step.schedule?.startDate ? new Date(step.schedule.startDate) : new Date();
            
            if (isNaN(scheduledDate.getTime())) {
                console.error('Invalid schedule:', step.schedule);
                continue; // Skip invalid dates instead of throwing error
            }
            
            await actionableStepService.createStep({
                description: step.description,
                noteId,
                scheduledAt: scheduledDate,
            });
        }

      console.log(`Steps created for note ${noteId}`);
    } catch (error) {
      console.error(`Failed to process steps for note: ${job.data.noteId}`, error);
      throw error;
    }
  },
  {
    connection: redisConfig,
    concurrency: 5, 
  }
);

stepWorker.on('completed', (job) => {
  console.log(`🎉 Job ${job.id} completed successfully`);
});

stepWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});

console.log('Step worker is running...');
