import React from 'react';
import { useExecutiveDashboard } from '../../hooks/useAnalyticsDashboardQuery';
import { useAnalyticsDashboardUiStore } from '../../stores/analyticsDashboardUiStore';

export default function ExecutiveDashboardPage() {
  const { filters } = useAnalyticsDashboardUiStore();
  const { data: metrics, isLoading } = useExecutiveDashboard(filters);

  if (isLoading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Executive Dashboard (Phase 14)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics?.map(m => (
          <div key={m.metricId} className="bg-white p-4 rounded shadow border">
            <h3 className="text-gray-600 text-sm">{m.metricId}</h3>
            {m.suppressed ? (
              <p className="text-sm text-red-600 mt-2">{m.reason}</p>
            ) : (
              <p className="text-3xl font-bold mt-2">{m.value} <span className="text-lg text-gray-500">{m.unit === 'percentage' ? '%' : ''}</span></p>
            )}
            <p className="text-xs text-gray-400 mt-2">Based on {m.count} records</p>
          </div>
        ))}
      </div>
    </div>
  );
}
