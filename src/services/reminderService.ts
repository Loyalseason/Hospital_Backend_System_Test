import actionableStepService from '../services/actionableStepService';
import noteService from '../services/noteService';

export async function getActionableStepsWithReminders(noteId?: string) {
  try {
    let noteInfo = null;
    if (noteId) {
      noteInfo = await noteService.find(noteId);
      if (!noteInfo) {
        throw new Error(`Note with ID ${noteId} not found`);
      }
    }

    // Retrieve pending actionable steps
    const steps = await actionableStepService.getPendingSteps(noteId);

    // Format results
    return {
      note: noteInfo,
      actionableSteps: steps.map(step => ({
        id: step.id,
        description: step.description,
        scheduledAt: step.scheduledAt,
        completed: step.completed,
      })),
    };
  } catch (error) {
    console.error('Error retrieving actionable steps:', error);
    throw error;
  }
}