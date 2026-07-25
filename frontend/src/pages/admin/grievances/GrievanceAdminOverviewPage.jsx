import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGrievanceAnalytics, useGlobalGrievanceAudit } from '../../../hooks/useGrievanceAdminQuery';

const GrievanceAdminOverviewPage = () => {
  const navigate = useNavigate();
  const { data: analytics, isLoading } = useGrievanceAnalytics();
  const { data: auditLogs } = useGlobalGrievanceAudit();

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading admin dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Grievance Administration</h1>
          <p className="text-slate-500 mt-1">System-wide settings and performance overview.</p>
        </div>
        <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
          Super Admin Privileges Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 mb-1">Total Grievances</h3>
          <p className="text-3xl font-bold text-slate-900">{analytics?.data?.totalGrievances || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 mb-1">Open Grievances</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics?.data?.openGrievances || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 mb-1">Escalated</h3>
          <p className="text-3xl font-bold text-amber-600">{analytics?.data?.escalatedGrievances || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 mb-1">SLA Compliance</h3>
          <p className="text-3xl font-bold text-green-600">{analytics?.data?.slaCompliance || 0}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-semibold text-slate-800">Configuration Management</h2>
            </div>
            <div className="p-2 grid grid-cols-2 gap-2">
              <button onClick={() => navigate('/admin/grievances/categories')} className="flex items-center gap-3 p-4 hover:bg-slate-50 rounded-lg text-left transition-colors">
                <div className="w-10 h-10 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Categories & Types</p>
                  <p className="text-xs text-slate-500">Manage grievance classifications</p>
                </div>
              </button>
              
              <button onClick={() => navigate('/admin/grievances/sla')} className="flex items-center gap-3 p-4 hover:bg-slate-50 rounded-lg text-left transition-colors">
                <div className="w-10 h-10 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">SLA Timelines</p>
                  <p className="text-xs text-slate-500">Configure department deadlines</p>
                </div>
              </button>

              <button onClick={() => navigate('/admin/grievances/escalation-rules')} className="flex items-center gap-3 p-4 hover:bg-slate-50 rounded-lg text-left transition-colors">
                <div className="w-10 h-10 rounded bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Escalation Rules</p>
                  <p className="text-xs text-slate-500">Auto-assignment triggers</p>
                </div>
              </button>

              <button onClick={() => navigate('/admin/grievances/officers')} className="flex items-center gap-3 p-4 hover:bg-slate-50 rounded-lg text-left transition-colors">
                <div className="w-10 h-10 rounded bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Grievance Officers</p>
                  <p className="text-xs text-slate-500">Roles & assignments</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
             <h2 className="font-semibold text-slate-800">Recent Audit Log</h2>
             <button onClick={() => navigate('/admin/grievances/audit')} className="text-xs text-blue-600 hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto p-0">
             {(!auditLogs || auditLogs.length === 0) ? (
               <div className="p-8 text-center text-slate-500">No recent activity.</div>
             ) : (
               <ul className="divide-y divide-slate-100">
                 {auditLogs.slice(0, 10).map((log, idx) => (
                   <li key={idx} className="p-4 hover:bg-slate-50 text-sm">
                     <p className="font-medium text-slate-900 capitalize">{log.action.replace(/-/g, ' ')}</p>
                     <p className="text-xs text-slate-500 mt-0.5">By {log.actorId} &bull; {new Date(log.timestamp).toLocaleString()}</p>
                   </li>
                 ))}
               </ul>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GrievanceAdminOverviewPage;
