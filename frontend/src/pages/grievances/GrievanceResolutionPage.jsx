import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGrievance, useGrievanceResolution, useRespondToResolution } from '../../hooks/useGrievanceQuery';
import { GrievancePublicStatus } from '../../data/grievancePublicStatusModel';

const GrievanceResolutionPage = () => {
  const { grievanceId } = useParams();
  const navigate = useNavigate();
  const { data: grievance, isLoading: grievanceLoading } = useGrievance(grievanceId);
  const { data: resolution, isLoading: resolutionLoading } = useGrievanceResolution(grievanceId);
  const respondToResolution = useRespondToResolution();

  const [responseText, setResponseText] = useState('');
  const [isAccepted, setIsAccepted] = useState(true);

  if (grievanceLoading || resolutionLoading) return <div className="p-8 text-center animate-pulse">Loading...</div>;
  if (!grievance || !resolution) return <div className="p-8 text-center text-red-600">No resolution found for this grievance.</div>;

  const isPending = resolution.status === 'pending-citizen-response';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await respondToResolution.mutateAsync({ 
        id: grievanceId, 
        accepted: isAccepted, 
        responseText 
      });
      navigate(`/grievances/${grievanceId}`);
    } catch (error) {
      console.error(error);
      alert('Failed to submit response');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <button onClick={() => navigate(`/grievances/${grievanceId}`)} className="text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Hub
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Review Resolution</h1>
        <p className="text-slate-500 mt-1">Review the proposed resolution for your grievance.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-teal-50 border border-teal-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-teal-800">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h2 className="text-lg font-semibold">Resolution Proposed</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-teal-700 font-semibold mb-1">Summary of Action Taken</p>
              <p className="text-teal-900 bg-white bg-opacity-60 p-3 rounded-lg border border-teal-100">{resolution.summary}</p>
            </div>
            
            {resolution.citizenMessage && (
              <div>
                <p className="text-teal-700 font-semibold mb-1">Message to You</p>
                <p className="text-teal-900 bg-white bg-opacity-60 p-3 rounded-lg border border-teal-100 whitespace-pre-wrap">{resolution.citizenMessage}</p>
              </div>
            )}
            
            <p className="text-teal-700 text-sm mt-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Proposed on {new Date(resolution.approvedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {isPending ? (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Your Decision</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <label className={`cursor-pointer flex flex-col p-4 border rounded-lg transition-colors ${isAccepted ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-slate-200 hover:border-green-300'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-semibold ${isAccepted ? 'text-green-800' : 'text-slate-700'}`}>Accept Resolution</span>
                  <input
                    type="radio"
                    name="decision"
                    checked={isAccepted}
                    onChange={() => setIsAccepted(true)}
                    className="text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                </div>
                <p className="text-sm text-slate-500">I am satisfied with this resolution and wish to close the grievance.</p>
              </label>

              <label className={`cursor-pointer flex flex-col p-4 border rounded-lg transition-colors ${!isAccepted ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500' : 'border-slate-200 hover:border-amber-300'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-semibold ${!isAccepted ? 'text-amber-800' : 'text-slate-700'}`}>Dispute Resolution</span>
                  <input
                    type="radio"
                    name="decision"
                    checked={!isAccepted}
                    onChange={() => setIsAccepted(false)}
                    className="text-amber-600 focus:ring-amber-500 h-4 w-4"
                  />
                </div>
                <p className="text-sm text-slate-500">I am not satisfied and wish for the officer to review it again.</p>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {isAccepted ? 'Feedback / Comments (Optional)' : 'Reason for Dispute (Required)'}
              </label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder={isAccepted ? "Thank you..." : "Please explain why the resolution is not satisfactory..."}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                required={!isAccepted}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate(`/grievances/${grievanceId}`)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={respondToResolution.isPending || (!isAccepted && !responseText.trim())}
                className={`px-6 py-2 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 ${isAccepted ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'}`}
              >
                {respondToResolution.isPending ? 'Submitting...' : isAccepted ? 'Accept & Close' : 'Submit Dispute'}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">Your Response</h3>
            <p className="text-sm font-medium text-slate-700 mb-1">
              Status: <span className={resolution.status === 'accepted' ? 'text-green-600' : 'text-amber-600'}>{resolution.status === 'accepted' ? 'Accepted' : 'Disputed'}</span>
            </p>
            {resolution.citizenResponse && (
              <p className="text-slate-600 mt-2 bg-white p-3 rounded border border-slate-100">{resolution.citizenResponse}</p>
            )}
            <p className="text-slate-500 text-xs mt-3">Responded on {new Date(resolution.citizenRespondedAt).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrievanceResolutionPage;
