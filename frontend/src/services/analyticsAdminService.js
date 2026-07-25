import { analyticsDemoDataService } from './analyticsDemoDataService';

export const analyticsAdminService = {
  getMetrics() {
    return analyticsDemoDataService.getStore().metrics;
  }
};
