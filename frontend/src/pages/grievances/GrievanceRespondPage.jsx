import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGrievance, useGrievanceRequests, useSubmitGrievanceClarification } from '../../hooks/useGrievanceQuery';

const GrievanceRespondPage = () => {
  const { grievanceId } = useParams();
  const navigate = useNavigate();
  const { data: grievance, isLoading: grievanceLoading } = useGrievance(grievanceId);
  const { data: requests, isLoading: requestsLoading } = useGrievanceRequests(grievanceId);
  const submitResponse = useSubmitGrievanceClarification();

  const [responseText, setResponseText] = useState('');

  if (grievanceLoading || requestsLoading) return <div className="p-8 text-center animate-pulse">Loading...</div>;
  if (!grievance || !requests) return <div className="p-8 text-center text-red-600">Error loading data.</div>;

  const openRequest = requests.find(r => r.status === 'open');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!openRequest) return;

    try {
      await submitResponse.mutateAsync({ requestId: openRequest.id, responseText });
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
        <h1 className="text-2xl font-bold text-slate-900">Respond to Request</h1>
        <p className="text-slate-500 mt-1">Provide the requested information to proceed.</p>
      </div>

      {!openRequest ? (
        <div className="bg-white p-8 text-center rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 mb-4">There are no open requests for this grievance.</p>
          <button onClick={() => navigate(`/grievances/${grievanceId}`)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">Return</button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-amber-900 mb-2">Request Details</h2>
            <p className="text-amber-800 font-medium mb-1">{openRequest.question}</p>
            <p className="text-amber-700 text-sm mt-2"><span className="font-medium">Reason:</span> {openRequest.reason}</p>
            <p className="text-amber-700 text-sm mt-2"><span className="font-medium">Please reply by:</span> {new Date(openRequest.deadline).toLocaleDateString()}</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Response</label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response here..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={6}
                required
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
                disabled={submitResponse.isPending || !responseText.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {submitResponse.isPending ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GrievanceRespondPage;
