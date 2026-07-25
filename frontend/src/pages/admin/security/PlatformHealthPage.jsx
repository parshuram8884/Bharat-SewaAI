import React from 'react';
import { platformHealthService } from '../../../services/platformHealthService';
import { useQuery } from '@tanstack/react-query';
import { securityQueryKeys } from '../../../queryKeys/securityQueryKeys';

export default function PlatformHealthPage() {
  const { data: health, refetch } = useQuery({
    queryKey: securityQueryKeys.platformHealth(),
    queryFn: () => platformHealthService.getPlatformHealth()
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Platform Health</h1>
        <button onClick={() => refetch()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Run Diagnostics
        </button>
      </div>
      
      {health && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
            <h2 className="text-lg font-semibold mb-2">Overall Status</h2>
            <p className="text-2xl capitalize font-medium">{health.status}</p>
            <p className="text-sm text-gray-500 mt-2">Last checked: {new Date(health.lastChecked).toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
            <h2 className="text-lg font-semibold mb-2">Network State</h2>
            <p className="text-2xl capitalize font-medium">{health.details.online ? 'Online' : 'Offline'}</p>
          </div>
        </div>
      )}

      {health?.details?.storage && (
        <div className="mt-8 bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Storage Registry Integrity</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-2">Storage Key</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {health.details.storage.map(store => (
                <tr key={store.key} className="border-b">
                  <td className="py-2 text-sm">{store.key}</td>
                  <td className="py-2 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${store.status === 'corrupted' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {store.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
