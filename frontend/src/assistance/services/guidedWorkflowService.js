/**
 * Tracks workflow progress deterministically based on frontend state.
 */

class GuidedWorkflowService {
  calculateProgress(workflowId, state) {
    // Determine progress based on the specific workflow.
    // Example implementation for an application form:
    if (workflowId === 'application_form') {
      const totalSteps = 4;
      let completedSteps = 0;
      
      if (state.personalDetailsComplete) completedSteps++;
      if (state.documentsComplete) completedSteps++;
      if (state.declarationsComplete) completedSteps++;
      if (state.reviewComplete) completedSteps++;
      
      return {
        totalSteps,
        completedSteps,
        percentage: Math.round((completedSteps / totalSteps) * 100)
      };
    }
    
    return { totalSteps: 0, completedSteps: 0, percentage: 0 };
  }
}

export const guidedWorkflowService = new GuidedWorkflowService();
