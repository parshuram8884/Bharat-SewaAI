import React from 'react';
import { useCscAnalytics } from '../../../hooks/useCscAdminQuery';

export default function CscAdminOverview() {
  const { data: analytics, isLoading } = useCscAnalytics();

  if (isLoading) return <div className="p-8">Loading analytics...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">CSC Admin Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow border border-l-4 border-l-blue-500">
          <h3 className="text-gray-500 text-sm">Total Centres</h3>
          <p className="text-2xl font-bold">{analytics?.totalCentres || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border border-l-4 border-l-green-500">
          <h3 className="text-gray-500 text-sm">Active Centres</h3>
          <p className="text-2xl font-bold">{analytics?.activeCentres || 0}</p>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Centre Performance</h2>
      <div className="overflow-x-auto bg-white rounded shadow border">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b">Centre Name</th>
              <th className="p-3 border-b">Type</th>
              <th className="p-3 border-b text-right">Appointments</th>
              <th className="p-3 border-b text-right">Completed Visits</th>
              <th className="p-3 border-b text-right">Avg Wait (Mins)</th>
            </tr>
          </thead>
          <tbody>
            {analytics?.centreBreakdown?.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{c.name}</td>
                <td className="p-3 border-b">{c.type}</td>
                <td className="p-3 border-b text-right">{c.analytics?.totalAppointments || 0}</td>
                <td className="p-3 border-b text-right">{c.analytics?.completedVisits || 0}</td>
                <td className="p-3 border-b text-right">{c.analytics?.averageWaitTimeMins || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
