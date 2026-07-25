import React from 'react';
import { useAdminAnalytics } from '../../hooks/useOfficerReviewQuery';

const AdminAnalytics = () => {
  const { data: res, isLoading, error } = useAdminAnalytics();

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading analytics...</div>;
  if (error || !res?.success) return <div className="p-8 text-red-600">Failed to load analytics</div>;

  const stats = res.data;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Department Analytics</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-sm mb-6 flex gap-3">
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p>Demonstration Data: These metrics are computed dynamically from your local mock dataset. Complex charting libraries have been deliberately avoided per project constraints. Accessible CSS visualizations are used instead.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Total Applications</h3>
          <p className="text-4xl font-bold text-slate-900">{stats.totalApplications}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Approval Rate</h3>
          <p className="text-4xl font-bold text-slate-900">{stats.approvalRate}%</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Needs Attention</h3>
          <p className="text-4xl font-bold text-red-600">{stats.needsAttention}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900">Application Status Distribution</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
             {/* Accessible CSS Bar Chart */}
             <div>
               <div className="flex justify-between text-sm mb-1">
                 <span className="font-medium text-slate-700">Approved</span>
                 <span className="text-slate-500">{stats.approved} / {stats.totalApplications}</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden" role="progressbar" aria-valuenow={stats.approved} aria-valuemin="0" aria-valuemax={stats.totalApplications}>
                 <div className="bg-green-500 h-4 rounded-full transition-all" style={{ width: `${stats.totalApplications > 0 ? (stats.approved / stats.totalApplications) * 100 : 0}%` }}></div>
               </div>
             </div>
             
             <div>
               <div className="flex justify-between text-sm mb-1">
                 <span className="font-medium text-slate-700">Under Review</span>
                 <span className="text-slate-500">{stats.underReview} / {stats.totalApplications}</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden" role="progressbar" aria-valuenow={stats.underReview} aria-valuemin="0" aria-valuemax={stats.totalApplications}>
                 <div className="bg-blue-500 h-4 rounded-full transition-all" style={{ width: `${stats.totalApplications > 0 ? (stats.underReview / stats.totalApplications) * 100 : 0}%` }}></div>
               </div>
             </div>

             <div>
               <div className="flex justify-between text-sm mb-1">
                 <span className="font-medium text-slate-700">Rejected</span>
                 <span className="text-slate-500">{stats.rejected} / {stats.totalApplications}</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden" role="progressbar" aria-valuenow={stats.rejected} aria-valuemin="0" aria-valuemax={stats.totalApplications}>
                 <div className="bg-red-500 h-4 rounded-full transition-all" style={{ width: `${stats.totalApplications > 0 ? (stats.rejected / stats.totalApplications) * 100 : 0}%` }}></div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
