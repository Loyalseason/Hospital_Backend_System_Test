import cron from 'node-cron';
import { getActionableStepsWithReminders } from '../services/reminderService';


cron.schedule('*/5 * * * *', async () => {
  console.log('📅 Running daily actionable steps check...');

  try {
    // Run for all notes (or customize logic to loop through patients or doctors)
    const result = await getActionableStepsWithReminders();
    console.log('Actionable steps retrieved:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Failed to retrieve actionable steps:', error);
  }
});

console.log('⏰ Reminder cron job scheduled');
