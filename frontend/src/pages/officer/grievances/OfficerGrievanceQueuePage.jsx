import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGrievanceQueue } from '../../../hooks/useGrievanceOfficerQuery';
import { useAuth } from '../../../hooks/useAuth';
import { GrievancePublicStatusConfig } from '../../../data/grievancePublicStatusModel';

const OfficerGrievanceQueuePage = () => {
  const { filter } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: queue, isLoading } = useGrievanceQueue();
  
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQueue = useMemo(() => {
    if (!queue) return [];
    let list = queue;
    
    // Apply route filters
    if (filter === 'my-assigned') {
      list = list.filter(g => g.assignedOfficerId === user?.id);
    } else if (filter === 'unassigned') {
      list = list.filter(g => !g.assignedOfficerId);
    } else if (filter === 'attention') {
      list = list.filter(g => g.assignedOfficerId === user?.id && g.needsAttention);
    } else if (filter === 'urgent') {
      list = list.filter(g => g.priority === 'urgent');
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(g => 
        g.acknowledgementNumber.toLowerCase().includes(term) ||
        g.title.toLowerCase().includes(term)
      );
    }

    // Sort by SLA nearest first
    return list.sort((a, b) => new Date(a.slaDueAt) - new Date(b.slaDueAt));
  }, [queue, filter, user, searchTerm]);

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading queue...</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 capitalize">
            {filter ? filter.replace('-', ' ') : 'All'} Grievances Queue
          </h1>
          <p className="text-slate-500 mt-1">Manage and assign citizen grievances.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search ID or Title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                <th className="p-4 whitespace-nowrap">ID / Title</th>
                <th className="p-4 whitespace-nowrap">Category</th>
                <th className="p-4 whitespace-nowrap">Public Status</th>
                <th className="p-4 whitespace-nowrap">Internal Status</th>
                <th className="p-4 whitespace-nowrap">SLA Due</th>
                <th className="p-4 whitespace-nowrap">Assignee</th>
                <th className="p-4 whitespace-nowrap w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No grievances match the current filter.
                  </td>
                </tr>
              ) : (
                filteredQueue.map(g => (
                  <tr key={g.id} className="hover:bg-slate-50 group">
                    <td className="p-4">
                      <div className="font-medium text-slate-900 mb-0.5">{g.acknowledgementNumber}</div>
                      <div className="text-slate-500 truncate max-w-xs">{g.title}</div>
                    </td>
                    <td className="p-4 text-slate-700 capitalize">{g.category.replace('-', ' ')}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium bg-${GrievancePublicStatusConfig[g.publicStatus]?.color}-50 text-${GrievancePublicStatusConfig[g.publicStatus]?.color}-700`}>
                        {GrievancePublicStatusConfig[g.publicStatus]?.label || g.publicStatus}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 capitalize">{g.internalStatus.replace(/-/g, ' ')}</td>
                    <td className="p-4">
                      <div className={new Date(g.slaDueAt) < new Date() ? 'text-red-600 font-medium' : 'text-slate-700'}>
                        {new Date(g.slaDueAt).toLocaleDateString()}
                      </div>
                      {g.priority === 'urgent' && <span className="text-[10px] uppercase font-bold text-red-600">Urgent</span>}
                    </td>
                    <td className="p-4 text-slate-700">
                      {g.assignedOfficerId ? (
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                             {g.assignedOfficerName.charAt(0)}
                           </div>
                           <span className={g.assignedOfficerId === user?.id ? 'font-medium text-slate-900' : ''}>
                             {g.assignedOfficerName}
                           </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => navigate(`/officer/grievances/${g.id}`)}
                        className="text-blue-600 font-medium text-sm hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfficerGrievanceQueuePage;
