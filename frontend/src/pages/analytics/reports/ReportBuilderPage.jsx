import React, { useState } from 'react';
import { useRunReport } from '../../../hooks/useAnalyticsReportQuery';
import { analyticsReportService } from '../../../services/analyticsReportService';
import { useNavigate } from 'react-router-dom';

export default function ReportBuilderPage() {
  const navigate = useNavigate();
  const runMutation = useRunReport();
  
  const handleRun = () => {
    // Demo report creation and run
    const draft = analyticsReportService.createReportDraft({
      title: 'Demo Report',
      description: 'Test',
      metricIds: ['BSAI-MET-2026-100001', 'BSAI-MET-2026-100002']
    });
    runMutation.mutate({ reportId: draft.id, user: { id: 'DEMO-USER' } }, {
      onSuccess: (data) => navigate(`/analytics/reports/${draft.id}/runs`)
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Report Builder</h1>
      <button onClick={handleRun} disabled={runMutation.isLoading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {runMutation.isLoading ? 'Running...' : 'Run Demo Report'}
      </button>
    </div>
  );
}

