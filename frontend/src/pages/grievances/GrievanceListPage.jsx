import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCitizenGrievances } from '../../hooks/useGrievanceQuery';
import { GrievancePublicStatusConfig } from '../../data/grievancePublicStatusModel';

const GrievanceListPage = () => {
  const navigate = useNavigate();
  const { data: grievances, isLoading } = useCitizenGrievances();

  if (isLoading) {
    return <div className="p-8 text-center animate-pulse">Loading your grievances...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Grievances</h1>
          <p className="text-slate-500 mt-1">Track and manage your submitted complaints and requests.</p>
        </div>
        <button
          onClick={() => navigate('/grievances/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          Raise New Grievance
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-6 text-sm">
        <p className="font-medium">Demonstration Mode</p>
        <p className="mt-1">
          This grievance portal is for demonstration only. Grievances submitted here are NOT sent to any real government authority, CPGRAMS, or state systems.
        </p>
      </div>

      {!grievances || grievances.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No Grievances Found</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">You haven't submitted any grievances or complaints yet. If you are facing issues, you can raise a new one.</p>
          <button
            onClick={() => navigate('/grievances/new')}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium shadow-sm"
          >
            Raise Grievance
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {grievances.sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt)).map(g => (
            <div 
              key={g.id} 
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden group"
              onClick={() => navigate(`/grievances/${g.id}`)}
              role="button"
              tabIndex={0}
            >
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">{g.acknowledgementNumber}</span>
                    {g.priority === 'urgent' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase">Urgent</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 truncate mb-1 group-hover:text-blue-600 transition-colors">{g.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      {g.departmentName}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Updated {new Date(g.lastUpdatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                    bg-${GrievancePublicStatusConfig[g.publicStatus]?.color}-50 
                    text-${GrievancePublicStatusConfig[g.publicStatus]?.color}-700 
                    border-${GrievancePublicStatusConfig[g.publicStatus]?.color}-200`}
                  >
                    {GrievancePublicStatusConfig[g.publicStatus]?.label || g.publicStatus}
                  </span>
                  
                  <span className="text-sm font-medium text-blue-600 group-hover:underline flex items-center gap-1">
                    Track Status
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GrievanceListPage;
