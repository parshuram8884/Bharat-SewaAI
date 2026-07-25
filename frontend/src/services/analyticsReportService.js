import { analyticsDemoDataService } from './analyticsDemoDataService';
import { analyticsAggregationService } from './analyticsAggregationService';

export const analyticsReportService = {
  getReports() {
    return analyticsDemoDataService.getStore().reports;
  },

  getReport(id) {
    return this.getReports().find(r => r.id === id);
  },

  createReportDraft(definition) {
    const store = analyticsDemoDataService.getStore();
    const newReport = {
      ...definition,
      id: `BSAI-RPT-${Date.now()}`,
      status: 'draft',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.reports.push(newReport);
    analyticsDemoDataService.saveStore(store);
    return newReport;
  },

  runReport(reportId, user) {
    const report = this.getReport(reportId);
    if (!report) throw new Error("Report not found");

    const store = analyticsDemoDataService.getStore();
    
    // Calculate each metric
    const results = report.metricIds.map(mId => analyticsAggregationService.calculateMetric(mId, report.filters));
    
    const suppressedCount = results.filter(r => r.suppressed).length;

    const newRun = {
      id: `BSAI-RRUN-${Date.now()}`,
      reportId: report.id,
      reportVersion: report.version,
      runBy: user.id,
      runAt: new Date().toISOString(),
      filtersSnapshot: report.filters,
      resultSummary: results,
      privacySuppressionCount: suppressedCount,
      status: 'completed',
      eventKey: `analyst:${user.id}:report:BSAI-RRUN-${Date.now()}:completed`
    };

    store.reportRuns.push(newRun);
    analyticsDemoDataService.saveStore(store);
    return newRun;
  },

  getReportRunHistory(reportId) {
    return analyticsDemoDataService.getStore().reportRuns.filter(r => r.reportId === reportId);
  }
};
