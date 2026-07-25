import React from 'react';
import { useCentreQueue, useCallToken } from '../../../hooks/useOperatorQuery';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function OperatorQueue() {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Assume operator's assigned centre is 'BSAI-CSC-2026-100001' for demo
  const centreId = user?.centreId || 'BSAI-CSC-2026-100001'; 
  const { data: queue, isLoading } = useCentreQueue(centreId);
  const callMutation = useCallToken();

  if (isLoading) return <div className="p-8">Loading queue...</div>;

  const handleCall = (tokenId) => {
    callMutation.mutate(tokenId, {
      onSuccess: () => navigate(`/officer/csc/workspace/${tokenId}`)
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Service Queue - {centreId}</h1>
      <div className="space-y-4">
        {queue?.length === 0 ? <p>Queue is empty.</p> : queue?.map(t => (
          <div key={t.id} className="p-4 border rounded shadow bg-white flex justify-between items-center">
            <div>
              <div className="font-semibold text-lg text-blue-600">{t.tokenNumber}</div>
              <div className="text-sm text-gray-600">Status: {t.status}</div>
            </div>
            {t.status === 'waiting' && (
              <button 
                onClick={() => handleCall(t.id)}
                disabled={callMutation.isLoading}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Call Token
              </button>
            )}
            {t.status === 'called' && (
              <button 
                onClick={() => navigate(`/officer/csc/workspace/${t.id}`)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Open Workspace
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
