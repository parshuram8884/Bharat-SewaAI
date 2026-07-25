import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGrievance, useSubmitGrievance } from '../../hooks/useGrievanceQuery';
import { GrievancePublicStatus, GrievancePublicStatusConfig } from '../../data/grievancePublicStatusModel';

const GrievanceTrackingHubPage = () => {
  const { grievanceId } = useParams();
  const navigate = useNavigate();
  const { data: grievance, isLoading, error } = useGrievance(grievanceId);
  const submitGrievance = useSubmitGrievance();

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading grievance details...</div>;
  if (error || !grievance) return <div className="p-8 text-center text-red-600">Failed to load grievance. It may not exist or you do not have permission to view it.</div>;

  const isDraft = grievance.publicStatus === GrievancePublicStatus.DRAFT;

  const handleSubmit = async () => {
    try {
      await submitGrievance.mutateAsync(grievance.id);
      // It will auto refetch and show submitted state
    } catch (e) {
      console.error(e);
      alert('Failed to submit grievance');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/grievances')} className="text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Grievances
          </button>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900">{grievance.title}</h1>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
              bg-${GrievancePublicStatusConfig[grievance.publicStatus]?.color}-50 
              text-${GrievancePublicStatusConfig[grievance.publicStatus]?.color}-700 
              border-${GrievancePublicStatusConfig[grievance.publicStatus]?.color}-200`}
            >
              {GrievancePublicStatusConfig[grievance.publicStatus]?.label || grievance.publicStatus}
            </span>
          </div>
          <p className="text-slate-500 text-sm">Acknowledgement No: {grievance.acknowledgementNumber}</p>
        </div>

        {isDraft && (
          <button
            onClick={handleSubmit}
            disabled={submitGrievance.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {submitGrievance.isPending ? 'Submitting...' : 'Submit Grievance Now'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Description</h2>
            <p className="text-slate-700 whitespace-pre-wrap">{grievance.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Department</p>
                <p className="font-medium text-slate-900 capitalize">{grievance.departmentName || grievance.departmentId}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Category</p>
                <p className="font-medium text-slate-900 capitalize">{grievance.category.replace('-', ' ')}</p>
              </div>
              {grievance.linkedApplicationId && (
                <div>
                  <p className="text-slate-500 mb-1">Linked Application</p>
                  <p className="font-medium text-blue-600 hover:underline cursor-pointer" onClick={() => navigate(`/applications/${grievance.linkedApplicationId}`)}>{grievance.linkedApplicationId}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Actions & Summary */}
        <div className="space-y-6">
          {!isDraft && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Quick Actions</h2>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate(`/grievances/${grievance.id}/timeline`)}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center justify-between"
                >
                  View Full Timeline
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
                
                {grievance.publicStatus === GrievancePublicStatus.CLARIFICATION_REQUIRED && (
                  <button
                    onClick={() => navigate(`/grievances/${grievance.id}/respond`)}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors flex items-center justify-between"
                  >
                    Respond to Request
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                  </button>
                )}

                {grievance.publicStatus === GrievancePublicStatus.RESOLUTION_PROPOSED && (
                  <button
                    onClick={() => navigate(`/grievances/${grievance.id}/resolution`)}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors flex items-center justify-between"
                  >
                    Review Resolution
                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                  </button>
                )}

                {(grievance.publicStatus === GrievancePublicStatus.UNDER_REVIEW || grievance.publicStatus === GrievancePublicStatus.ESCALATED) && (
                  <button
                    onClick={() => navigate(`/grievances/${grievance.id}/escalate`)}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center justify-between"
                  >
                    Escalate Issue
                  </button>
                )}

                {grievance.publicStatus === GrievancePublicStatus.CLOSED && (
                  <>
                    <button
                      onClick={() => navigate(`/grievances/${grievance.id}/reopen`)}
                      className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center justify-between"
                    >
                      Reopen Grievance
                    </button>
                    <button
                      onClick={() => navigate(`/grievances/${grievance.id}/feedback`)}
                      className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center justify-between"
                    >
                      Provide Feedback
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Status Overview</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Submitted On</span>
                <span className="font-medium text-slate-900">{grievance.submittedAt ? new Date(grievance.submittedAt).toLocaleDateString() : 'Draft'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Last Updated</span>
                <span className="font-medium text-slate-900">{new Date(grievance.lastUpdatedAt).toLocaleDateString()}</span>
              </div>
              {!isDraft && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Estimated SLA</span>
                    <span className={`font-medium ${new Date(grievance.slaDueAt) < new Date() ? 'text-red-600' : 'text-slate-900'}`}>
                      {new Date(grievance.slaDueAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-400 italic">Demonstration service estimate — not a statutory guarantee.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrievanceTrackingHubPage;
