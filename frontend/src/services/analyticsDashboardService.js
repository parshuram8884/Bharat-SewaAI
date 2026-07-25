import { analyticsAggregationService } from './analyticsAggregationService';

export const analyticsDashboardService = {
  getExecutiveDashboard(filters = {}) {
    const metrics = analyticsAggregationService.getMetricDefinitions();
    return metrics.map(m => analyticsAggregationService.calculateMetric(m.id, filters));
  },
  
  getDepartmentDashboard(departmentId, filters = {}) {
    const f = { ...filters, departmentId };
    return this.getExecutiveDashboard(f);
  }
};
