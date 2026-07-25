import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGrievanceQueue } from '../../../hooks/useGrievanceOfficerQuery';
import { useGrievanceAnalytics } from '../../../hooks/useGrievanceAdminQuery';
import { useAuth } from '../../../hooks/useAuth';

const OfficerGrievanceOverviewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: queue, isLoading: queueLoading } = useGrievanceQueue();
  const { data: analytics, isLoading: analyticsLoading } = useGrievanceAnalytics();

  if (queueLoading || analyticsLoading) return <div className="p-8 text-center animate-pulse">Loading dashboard...</div>;

  const myAssigned = queue?.filter(g => g.assignedOfficerId === user?.id) || [];
  const unassigned = queue?.filter(g => !g.assignedOfficerId) || [];
  const needsAttention = myAssigned.filter(g => g.needsAttention);
  const urgent = myAssigned.filter(g => g.priority === 'urgent');

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Grievance Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your department's grievance queue and performance.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div 
          onClick={() => navigate('/officer/grievances/queue/my-assigned')}
          className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-600 mb-1">My Assigned Queue</h3>
          <p className="text-3xl font-bold text-slate-900">{myAssigned.length}</p>
        </div>

        <div 
          onClick={() => navigate('/officer/grievances/queue/attention')}
          className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <svg className="w-16 h-16 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-600 mb-1">Needs Attention</h3>
          <p className="text-3xl font-bold text-amber-600">{needsAttention.length}</p>
        </div>

        <div 
          onClick={() => navigate('/officer/grievances/queue/unassigned')}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <h3 className="text-sm font-semibold text-slate-600 mb-1">Unassigned (Dept)</h3>
          <p className="text-3xl font-bold text-slate-900">{unassigned.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <h3 className="text-sm font-semibold text-slate-600 mb-1">SLA Compliance</h3>
          <p className="text-3xl font-bold text-green-600">{analytics?.data?.slaCompliance || 0}%</p>
          <p className="text-xs text-slate-500 mt-1">Department average</p>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-semibold text-slate-900">Urgent Grievances</h2>
            <button onClick={() => navigate('/officer/grievances/queue/urgent')} className="text-sm text-blue-600 hover:underline">View All</button>
          </div>
          <div className="p-0 flex-1 overflow-auto">
            {urgent.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No urgent grievances in your queue.</div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {urgent.slice(0, 5).map(g => (
                  <li key={g.id} className="p-4 hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/officer/grievances/${g.id}`)}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-slate-900 truncate pr-4">{g.title}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700 uppercase shrink-0">Urgent</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{g.acknowledgementNumber}</span>
                      <span>Due: {new Date(g.slaDueAt).toLocaleDateString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-semibold text-slate-900">Needs Your Response</h2>
            <button onClick={() => navigate('/officer/grievances/queue/attention')} className="text-sm text-blue-600 hover:underline">View All</button>
          </div>
          <div className="p-0 flex-1 overflow-auto">
            {needsAttention.length === 0 ? (
              <div className="p-8 text-center text-slate-500">You are all caught up!</div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {needsAttention.slice(0, 5).map(g => (
                  <li key={g.id} className="p-4 hover:bg-amber-50 cursor-pointer" onClick={() => navigate(`/officer/grievances/${g.id}`)}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-slate-900 truncate pr-4">{g.title}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-700 capitalize shrink-0">
                        {g.internalStatus.replace(/-/g, ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{g.acknowledgementNumber}</span>
                    </div>
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

export default OfficerGrievanceOverviewPage;
