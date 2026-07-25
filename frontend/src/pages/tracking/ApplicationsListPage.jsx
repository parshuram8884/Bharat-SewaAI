import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Clock, ChevronRight } from 'lucide-react';
import { useTrackingApplications } from '../../hooks/useApplicationTrackingQuery';
import { FilterGroups } from '../../data/applicationStatusModel';
import { StatusBadge, TrackingSkeletons } from '../../components/tracking/TrackingSkeletons';

export function ApplicationsListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentFilter = searchParams.get('status') || 'All';
  const currentSort = searchParams.get('sort') || 'updated-desc';
  const currentQuery = searchParams.get('query') || '';

  const [localQuery, setLocalQuery] = useState(currentQuery);

  const { data, isLoading } = useTrackingApplications({
    status: currentFilter,
    sort: currentSort,
    query: currentQuery
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ status: currentFilter, sort: currentSort, query: localQuery });
  };

  const handleFilter = (group) => {
    setSearchParams({ status: group, sort: currentSort, query: currentQuery });
  };

  const applications = data?.data || [];

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-6 text-left">
      <main className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">My Applications</h1>
          <p className="text-xs text-on-surface-variant">Track and manage all your government scheme applications.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search by ID or Scheme Name..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-surface-container-lowest border border-outline rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </form>
          
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 hide-scrollbar">
            {FilterGroups.map(group => (
              <button
                key={group}
                onClick={() => handleFilter(group)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  currentFilter === group 
                    ? 'bg-primary text-on-primary border-primary' 
                    : 'bg-surface-container-lowest text-on-surface-variant border-outline hover:bg-surface-container-low'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              <TrackingSkeletons.Card />
              <TrackingSkeletons.Card />
            </>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center bg-surface-container-lowest border border-outline-variant rounded-2xl">
              <p className="text-sm text-on-surface-variant">No applications found matching your criteria.</p>
            </div>
          ) : (
            applications.map(app => (
              <div 
                key={app.id} 
                onClick={() => navigate(`/applications/${app.id}`)}
                className="group p-5 bg-surface-container-lowest border border-outline-variant rounded-2xl hover:border-primary/50 hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">{app.id}</span>
                      <StatusBadge statusKey={app.status} />
                    </div>
                    <h3 className="text-base font-bold text-on-surface">{app.schemeName}</h3>
                    <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Updated {new Date(app.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-low group-hover:bg-primary/10 text-on-surface-variant group-hover:text-primary transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
