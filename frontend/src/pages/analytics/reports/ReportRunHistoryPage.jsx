import React from 'react';
import { useParams } from 'react-router-dom';
import { useReportRuns } from '../../../hooks/useAnalyticsReportQuery';

export default function ReportRunHistoryPage() {
  const { reportId } = useParams();
  const { data: runs, isLoading } = useReportRuns(reportId);

  if (isLoading) return <div className="p-8">Loading history...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Report Run History</h1>
      <div className="space-y-4">
        {runs?.map(r => (
          <div key={r.id} className="p-4 border rounded bg-white shadow">
            <h3 className="font-semibold">Run ID: {r.id}</h3>
            <p className="text-sm text-gray-600">Time: {r.runAt}</p>
            <p className="text-sm text-gray-600">Suppressed Items: {r.privacySuppressionCount}</p>
            <p className="text-sm font-medium">Status: {r.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

