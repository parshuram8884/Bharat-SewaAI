import React from 'react';
import { useGlobalAuditLog } from '../../hooks/useOfficerReviewQuery';

const GlobalAuditLog = () => {
  const { data: res, isLoading, error } = useGlobalAuditLog();

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading audit logs...</div>;
  if (error || !res?.success) return <div className="p-8 text-red-600">Failed to load audit logs</div>;

  const logs = res.data;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Global Audit Log</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-sm flex gap-3">
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <p>Audit records are immutable and append-only. They do not contain complete sensitive citizen identifiers. In a production environment, this would be backed by WORM (Write Once Read Many) storage.</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Target Entity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">No audit events found.</td>
              </tr>
            ) : logs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{log.actorName}</div>
                  <div className="text-xs text-slate-500 capitalize">{log.actorRole.replace('-', ' ')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {log.entityType}: {log.entityId}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-sm truncate" title={log.afterSummary || log.reason}>
                  {log.afterSummary || log.reason || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GlobalAuditLog;
