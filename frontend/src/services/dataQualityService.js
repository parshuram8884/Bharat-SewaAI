import { analyticsDemoDataService } from './analyticsDemoDataService';

export const dataQualityService = {
  runDataQualityChecks() {
    // In a real system, this would evaluate data models against rules.
    // For demo, we just return existing seeded issues.
    return analyticsDemoDataService.getStore().dataQualityIssues;
  },

  getDataQualityIssues() {
    return analyticsDemoDataService.getStore().dataQualityIssues;
  }
};
