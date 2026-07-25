import { analyticsDemoDataService } from './analyticsDemoDataService';
import { applicationService } from './applicationService';
import { grievanceService } from './grievanceService';

const PRIVACY_MIN_GROUP_SIZE = 5;

// Mock Source Adapters mapping real data models to normalized analytics records
const sourceAdapters = {
  applications: () => {
    // Normalise and strip PII
    const apps = applicationService.getApplications() || [];
    return apps.map(app => ({
      id: app.id,
      departmentId: app.departmentId,
      schemeId: app.schemeId,
      status: app.status,
      createdAt: app.createdAt
    }));
  },
  grievances: () => {
    const grvs = grievanceService.getGrievances() || [];
    return grvs.map(g => ({
      id: g.id,
      departmentId: g.departmentId,
      status: g.status,
      slaBreached: g.slaStatus === 'breached',
      createdAt: g.createdAt
    }));
  }
};

export const analyticsAggregationService = {
  getMetricDefinition(metricId) {
    const store = analyticsDemoDataService.getStore();
    return store.metrics.find(m => m.id === metricId);
  },

  getMetricDefinitions() {
    return analyticsDemoDataService.getStore().metrics;
  },

  calculateMetric(metricId, filters = {}) {
    const metric = this.getMetricDefinition(metricId);
    if (!metric) throw new Error("Metric not found");

    let rawData = [];
    if (sourceAdapters[metric.domain]) {
      rawData = sourceAdapters[metric.domain]();
    } else {
      // Mock data for unimplemented adapters
      rawData = Array.from({ length: 20 }, (_, i) => ({ id: `MOCK-${i}`, departmentId: 'DEPT-1', status: 'approved' }));
    }

    // Apply Filters deterministically
    if (filters.departmentId) {
      rawData = rawData.filter(r => r.departmentId === filters.departmentId);
    }
    
    // Privacy suppression
    const groupSize = metric.minimumGroupSize || PRIVACY_MIN_GROUP_SIZE;
    if (rawData.length > 0 && rawData.length < groupSize) {
      return {
        value: null,
        suppressed: true,
        reason: 'Insufficient aggregated data (Minimum group size restriction)',
        count: rawData.length,
        unit: metric.unit
      };
    }

    // Calculate (Mock logic based on metric type)
    let value = 0;
    if (metric.calculationType === 'count') {
      value = rawData.length;
    } else if (metric.calculationType === 'percentage') {
      // Fake percentage logic for demo
      value = rawData.length > 0 ? 75.5 : 0; 
    }

    return {
      metricId,
      value,
      unit: metric.unit,
      suppressed: false,
      count: rawData.length,
      calculatedAt: new Date().toISOString()
    };
  }
};
