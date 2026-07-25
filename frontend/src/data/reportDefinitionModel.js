export const ReportDefinitionModel = {
  id: '',
  title: '',
  description: '',
  ownerId: '',
  departmentId: '',
  visibility: '', // private, department, restricted, global-internal, public-demo
  metricIds: [],
  dimensions: [],
  filters: {},
  comparisonMode: '',
  dateRange: {},
  sort: {},
  limit: 0,
  privacyRules: {},
  status: '', // draft, validating, ready, running, completed, failed, published, archived
  version: 1,
  createdAt: '',
  updatedAt: ''
};

export const ReportRunModel = {
  id: '',
  reportId: '',
  reportVersion: 1,
  runBy: '',
  runAt: '',
  filtersSnapshot: {},
  metricDefinitionVersions: {},
  resultSummary: {},
  privacySuppressionCount: 0,
  dataQualityWarningIds: [],
  exportIds: [],
  status: '', // running, completed, failed
  eventKey: ''
};

export const ReportScheduleModel = {
  id: '',
  reportId: '',
  frequency: '', // daily, weekly, monthly, quarterly, manual
  dayOfWeek: '',
  dayOfMonth: '',
  nextRunAt: '',
  lastRunAt: '',
  status: '', // active, paused, completed-demo, failed-demo, archived
  recipientsMock: [],
  createdBy: '',
  createdAt: ''
};
