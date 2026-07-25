import React from 'react';
import { securityEventService } from '../../../services/securityEventService';
import { useQuery } from '@tanstack/react-query';
import { securityQueryKeys } from '../../../queryKeys/securityQueryKeys';

export default function SecurityOverviewPage() {
  const { data: events } = useQuery({
    queryKey: securityQueryKeys.events(),
    queryFn: () => securityEventService.getEvents()
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Security Dashboard</h1>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Events</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="pb-2">ID</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Risk</th>
              <th className="pb-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {(events || []).slice(0, 10).map(evt => (
              <tr key={evt.id} className="border-b">
                <td className="py-2 text-sm">{evt.id}</td>
                <td className="py-2 text-sm">{evt.type}</td>
                <td className="py-2 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${evt.riskLevel === 'high' || evt.riskLevel === 'critical' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                    {evt.riskLevel}
                  </span>
                </td>
                <td className="py-2 text-sm">{new Date(evt.timestamp).toLocaleString()}</td>
              </tr>
            ))}
            {(!events || events.length === 0) && (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">No security events found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
