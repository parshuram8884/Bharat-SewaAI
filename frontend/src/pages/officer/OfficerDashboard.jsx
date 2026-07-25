import React from 'react';
import { Link } from 'react-router-dom';
import { useOfficerDashboard } from '../../hooks/useOfficerReviewQuery';
import { useTranslation } from 'react-i18next'; // Used if translating, but we'll stick to English base for the mockup 

const OfficerDashboard = () => {
  const { data: dashboard, isLoading, error } = useOfficerDashboard();

  if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading dashboard...</div>;
  if (error || !dashboard?.success) return <div className="p-8 text-red-600">Failed to load dashboard</div>;

  const stats = dashboard.data;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Officer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Link to="/officer/queue/assigned" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
          <h3 className="text-sm font-medium text-slate-500 mb-2 group-hover:text-blue-600 transition-colors">Assigned to Me</h3>
          <p className="text-3xl font-bold text-slate-900">{stats.assignedToMe}</p>
        </Link>
        <Link to="/officer/queue/unassigned" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
          <h3 className="text-sm font-medium text-slate-500 mb-2 group-hover:text-blue-600 transition-colors">Unassigned Queue</h3>
          <p className="text-3xl font-bold text-slate-900">{stats.unassignedQueue}</p>
        </Link>
        <Link to="/officer/queue/needs-attention" className="bg-red-50 p-6 rounded-xl border border-red-100 shadow-sm hover:shadow-md transition-shadow group">
          <h3 className="text-sm font-medium text-red-600 mb-2 group-hover:text-red-700 transition-colors">Needs Attention</h3>
          <p className="text-3xl font-bold text-red-700">{stats.needsAttention}</p>
        </Link>
        <Link to="/officer/queue?status=recommendation-submitted" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
          <h3 className="text-sm font-medium text-slate-500 mb-2 group-hover:text-blue-600 transition-colors">Decisions Pending</h3>
          <p className="text-3xl font-bold text-slate-900">{stats.decisionsPending}</p>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
           <Link to="/officer/queue/unassigned" className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-center">
             <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
             </div>
             <span className="font-medium text-slate-900">Assign New Applications</span>
           </Link>
           
           <Link to="/officer/queue/needs-attention" className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-center">
             <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <span className="font-medium text-slate-900">Resolve SLAs</span>
           </Link>

           <Link to="/officer/queue?sort=newest" className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-center">
             <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
             </div>
             <span className="font-medium text-slate-900">View All Open Cases</span>
           </Link>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
