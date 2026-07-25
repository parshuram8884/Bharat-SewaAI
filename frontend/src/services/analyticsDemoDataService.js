import { AnalyticsPermissions, AnalyticsRoles } from '../data/analyticsPermissionModel';

const STORE_KEY = 'bsai_analytics_store';
const SCHEMA_VERSION_KEY = 'bsai_analytics_schema_version';
const CURRENT_VERSION = 1;

export const analyticsDemoDataService = {
  initialize() {
    const storedVersion = localStorage.getItem(SCHEMA_VERSION_KEY);
    if (!storedVersion || parseInt(storedVersion, 10) < CURRENT_VERSION) {
      this.seedData();
      localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_VERSION.toString());
    }
  },

  seedData() {
    const store = this.getStore();
    
    // Seed Metric Definitions
    if (store.metrics.length === 0) {
      store.metrics.push(
        { id: 'BSAI-MET-2026-100001', code: 'APP_TOTAL', name: 'Applications Submitted', description: 'Total count of applications submitted across all schemes.', domain: 'applications', calculationType: 'count', unit: 'count', aggregation: 'sum', active: true, version: 1 },
        { id: 'BSAI-MET-2026-100002', code: 'APP_APR_RATE', name: 'Approval Rate', description: 'Percentage of applications approved.', domain: 'applications', calculationType: 'percentage', unit: 'percentage', aggregation: 'average', active: true, version: 1 },
        { id: 'BSAI-MET-2026-100003', code: 'GRV_SLA_BREACH', name: 'Grievance SLA Breach Rate', description: 'Percentage of grievances exceeding SLA.', domain: 'grievances', calculationType: 'percentage', unit: 'percentage', aggregation: 'average', active: true, version: 1 }
      );
    }

    // Seed Data Quality Rules
    if (store.dataQualityRules.length === 0) {
      store.dataQualityRules.push(
        { id: 'BSAI-DQR-1', code: 'MISSING_ID', description: 'Missing required identifier', severity: 'critical', domain: 'applications', active: true }
      );
    }
    
    // Seed Data Quality Issues
    if (store.dataQualityIssues.length === 0) {
      store.dataQualityIssues.push(
        { id: 'BSAI-DQI-2026-100001', ruleId: 'BSAI-DQR-1', recordId: 'MOCK-APP-1', recordType: 'application', details: 'Application is missing citizen ID linking', status: 'open', history: [{ status: 'open', timestamp: new Date().toISOString() }] }
      );
    }

    this.saveStore(store);
  },

  getStore() {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
    return {
      metrics: [],
      reports: [],
      reportRuns: [],
      schedules: [],
      dataQualityRules: [],
      dataQualityIssues: [],
      openDataDatasets: [],
      openDataPrivacyReviews: []
    };
  },

  saveStore(store) {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  },

  resetAnalyticsDemoData() {
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem(SCHEMA_VERSION_KEY);
    this.initialize();
  }
};
