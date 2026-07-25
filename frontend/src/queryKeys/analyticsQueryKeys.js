export const analyticsQueryKeys = {
  all: ['analytics'],
  dashboards: () => [...analyticsQueryKeys.all, 'dashboards'],
  reports: () => [...analyticsQueryKeys.all, 'reports'],
  reportRuns: (reportId) => [...analyticsQueryKeys.reports(), reportId, 'runs'],
  dataQuality: () => [...analyticsQueryKeys.all, 'dataQuality'],
  openData: () => [...analyticsQueryKeys.all, 'openData']
};
