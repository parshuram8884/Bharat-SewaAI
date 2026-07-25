import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStartVisit, useCompleteVisit } from '../../../hooks/useOperatorQuery';

export default function OperatorWorkspace() {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const startVisitMutation = useStartVisit();
  const completeVisitMutation = useCompleteVisit();
  const [visitId, setVisitId] = useState(null);
  const [summary, setSummary] = useState('');

  const handleStart = () => {
    startVisitMutation.mutate(
      { tokenId, citizenId: 'DEMO-CITIZEN-ID', centreId: 'BSAI-CSC-2026-100001' },
      { onSuccess: (data) => setVisitId(data.id) }
    );
  };

  const handleComplete = () => {
    if (!visitId) return;
    completeVisitMutation.mutate(
      { visitId, summary },
      { onSuccess: () => navigate('/officer/csc/queue') }
    );
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Operator Workspace</h1>
      <div className="bg-white p-6 rounded shadow border">
        <h2 className="text-lg font-semibold mb-4">Token: {tokenId}</h2>
        {!visitId ? (
          <button 
            onClick={handleStart} 
            disabled={startVisitMutation.isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Acknowledge Citizen & Start Visit
          </button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <span className="font-semibold text-green-700">Visit In Progress (ID: {visitId})</span>
            </div>
            
            <div className="border p-4 rounded">
              <h3 className="font-semibold mb-2">Consent & Actions</h3>
              <p className="text-sm text-gray-600 mb-4">Demonstration consent recorded. You may now perform assisted actions.</p>
              <button className="bg-gray-200 px-4 py-2 rounded text-sm mr-2 hover:bg-gray-300">Draft Application</button>
              <button className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300">Upload Document</button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Visit Summary</label>
              <textarea 
                className="w-full border p-2 rounded"
                rows="3"
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Enter a brief summary of the services provided..."
              />
            </div>
            <button 
              onClick={handleComplete} 
              disabled={completeVisitMutation.isLoading || !summary}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              Complete Visit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
