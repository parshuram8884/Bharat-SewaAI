export const AnalyticsMetricModel = {
  id: '',
  code: '',
  name: '',
  description: '',
  domain: '', // citizens, schemes, applications, documents, grievances, benefits, payments, csc, officers, sla, feedback, notifications, audit
  calculationType: '', // count, distinct-count, sum, average, min, max, percentage, ratio, duration-average, percentile, trend-change
  numeratorDefinition: {},
  denominatorDefinition: {},
  unit: '', // count, percentage, duration-minutes, duration-hours, duration-days, currency-demo, rating, ratio
  aggregation: '',
  allowedDimensions: [],
  privacyLevel: '',
  minimumGroupSize: 5,
  sourceModules: [],
  active: true,
  version: 1,
  createdAt: '',
  updatedAt: ''
};

export const AnalyticsDimensionModel = {
  id: '',
  code: '',
  name: '',
  type: '', // date-range, department, scheme, service, district, centre, officer-role, application-status, grievance-category, payment-status, document-type, language, priority, channel, appointment-type
  description: ''
};
