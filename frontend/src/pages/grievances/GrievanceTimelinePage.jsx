import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGrievance, useGrievanceTimeline } from '../../hooks/useGrievanceQuery';

const GrievanceTimelinePage = () => {
  const { grievanceId } = useParams();
  const navigate = useNavigate();
  const { data: grievance, isLoading: grievanceLoading } = useGrievance(grievanceId);
  const { data: timelineEvents, isLoading: timelineLoading } = useGrievanceTimeline(grievanceId);

  if (grievanceLoading || timelineLoading) return <div className="p-8 text-center animate-pulse">Loading timeline...</div>;
  if (!grievance) return <div className="p-8 text-center text-red-600">Grievance not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <button onClick={() => navigate(`/grievances/${grievanceId}`)} className="text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Hub
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Grievance Timeline</h1>
        <p className="text-slate-500 mt-1">Audit trail and history of {grievance.acknowledgementNumber}</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
        {!timelineEvents || timelineEvents.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No timeline events found for this grievance.</p>
        ) : (
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {timelineEvents.map((event, index) => (
              <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-slate-900 capitalize">{event.action.replace(/-/g, ' ')}</h3>
                    <time className="text-xs font-medium text-slate-500">{new Date(event.timestamp).toLocaleString()}</time>
                  </div>
                  <p className="text-sm text-slate-600">Performed by: {event.actorId}</p>
                  
                  {event.details && (
                    <div className="mt-3 text-sm text-slate-700 bg-white p-3 rounded border border-slate-100">
                      {event.details}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrievanceTimelinePage;
