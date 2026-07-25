import React from 'react';
import { useDataQualityIssues } from '../../hooks/useDataQualityQuery';

export default function DataQualityDashboardPage() {
  const { data: issues, isLoading } = useDataQualityIssues();

  if (isLoading) return <div className="p-8">Loading Data Quality...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Data Quality Dashboard</h1>
      <div className="space-y-4">
        {issues?.map(i => (
          <div key={i.id} className="p-4 bg-red-50 border border-red-200 rounded">
            <h3 className="font-bold text-red-800">{i.id} - {i.ruleId}</h3>
            <p className="text-sm text-red-600">{i.details} (Record: {i.recordId})</p>
          </div>
        ))}
      </div>
    </div>
  );
}
