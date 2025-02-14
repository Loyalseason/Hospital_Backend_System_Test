import { Queue } from 'bullmq';
import { redisConfig } from '../config/redisConfig';

export const stepQueue = new Queue('step-creation-queue', {
  connection: redisConfig,
  defaultJobOptions: {
    attempts: 3, // Retry failed jobs up to 3 times
    backoff: {
      type: 'exponential',
      delay: 1000, // Retry after 1 second
    },
  },
});
