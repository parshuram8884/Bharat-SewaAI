import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApplicationQueue, useAssignApplication } from '../../hooks/useOfficerReviewQuery';
import { QueueTable } from '../../components/officer/QueueComponents';
import { officerAuthService } from '../../services/officerAuthService';

const OfficerQueue = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  // Determine queue type from path
  const path = location.pathname;
  let defaultAssignment = 'all';
  let defaultNeedsAttention = false;
  let title = 'Global Queue';

  if (path.includes('unassigned')) {
    defaultAssignment = 'unassigned';
    title = 'Unassigned Queue';
  } else if (path.includes('assigned')) {
    defaultAssignment = 'assigned-me';
    title = 'My Assigned Applications';
  } else if (path.includes('needs-attention')) {
    defaultNeedsAttention = true;
    title = 'Needs Attention';
  }

  const [filters, setFilters] = useState({
    assignment: defaultAssignment,
    needsAttention: defaultNeedsAttention,
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    query: searchParams.get('query') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  const { data: queueResponse, isLoading, error } = useApplicationQueue(filters);
  const assignMutation = useAssignApplication();

  const handleAssign = (applicationId, officerId) => {
    assignMutation.mutate({ applicationId, officerId });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newParams = new URLSearchParams(location.search);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search Application ID or Citizen Name..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <select 
          value={filters.status} 
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="text-sm px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="queued">Queued (New)</option>
          <option value="assigned">Assigned</option>
          <option value="review-started">Review Started</option>
          <option value="document-review">Document Review</option>
          <option value="eligibility-review">Eligibility Review</option>
          <option value="clarification-pending">Waiting on Citizen</option>
          <option value="recommendation-submitted">Decisions Pending</option>
        </select>

        <select 
          value={filters.priority} 
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="text-sm px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>

        <select 
          value={filters.sort} 
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="text-sm px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="updated">Recently Updated</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-16 bg-slate-200 rounded w-full"></div>
          ))}
        </div>
      ) : error || !queueResponse?.success ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          Failed to load queue. Please try again.
        </div>
      ) : (
        <QueueTable applications={queueResponse.data} onAssign={handleAssign} />
      )}
    </div>
  );
};

export default OfficerQueue;
