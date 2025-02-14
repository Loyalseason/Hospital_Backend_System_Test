// import cron from 'node-cron';
// import { PrismaClient } from '@prisma/client';
// import { cancelExistingReminders } from './reminderService';

// const activeCrons = new Map<string, cron.ScheduledTask>();

// const prisma = new PrismaClient()

// export function scheduleActionableSteps(patientId: string, steps: any[]): void {
//   cancelExistingReminders(patientId);

//   steps.forEach((step, index) => {
//     const task = cron.schedule(step.schedule, async () => {
//       console.log(`Reminder for patient ${patientId}: ${step.description}`);
      
//       await prisma.reminder.create({
//         data: {
//           patientId,
//           description: step.description,
//           schedule: step.schedule,
//           createdAt: new Date()
//         }
//       });
//     });

//     activeCrons.set(`${patientId}-${index}`, task);
//   });
// }

// export function cancelExistingReminders(patientId: string): void {
//   for (const [key, task] of activeCrons.entries()) {
//     if (key.startsWith(patientId)) {
//       task.stop();
//       activeCrons.delete(key);
//     }
//   }
//   console.log(`All reminders for patient ${patientId} have been cancelled.`);
// }
