import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDigilockerConnection, useDigilockerConnect, useDigilockerImport } from '../../hooks/useDocumentVaultQuery';
import { mockDigilockerService } from '../../services/mockDigilockerService';
import { useAuth } from '../../hooks/useAuth';

export default function DigilockerImportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: connection } = useDigilockerConnection();
  const connect = useDigilockerConnect();
  const importDoc = useDigilockerImport();

  const [selectedDocId, setSelectedDocId] = useState('');

  const availableDocs = mockDigilockerService.getMockAvailableDocuments(user);

  const handleConnect = () => {
    connect.mutate(undefined, {
      onSuccess: () => alert("Mock DigiLocker Connected")
    });
  };

  const handleImport = () => {
    if (!selectedDocId) return alert("Select a document");
    importDoc.mutate(selectedDocId, {
      onSuccess: () => {
        alert("Document successfully imported and verified.");
        navigate('/documents');
      },
      onError: (err) => {
        alert(err.message);
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Import from Mock DigiLocker</h1>
      
      <div className="bg-white shadow p-6 rounded-lg space-y-6">
        <div className="p-4 bg-blue-50 text-blue-800 rounded-md">
          <strong>Note:</strong> This is a completely mocked simulation. No real DigiLocker connections are made.
        </div>

        {connection?.state !== 'connected' ? (
           <div>
             <p className="mb-4 text-gray-700">Connect your account to browse mock trusted documents.</p>
             <button onClick={handleConnect} disabled={connect.isPending} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
               {connect.isPending ? 'Connecting...' : 'Connect to Mock DigiLocker'}
             </button>
           </div>
        ) : (
           <div className="space-y-4">
             <div className="flex items-center space-x-2 text-green-700 font-medium">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
               <span>Connected to Mock DigiLocker</span>
             </div>
             
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Available Documents to Import</label>
               <select 
                 value={selectedDocId} 
                 onChange={e => setSelectedDocId(e.target.value)}
                 className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
               >
                 <option value="">-- Select Document --</option>
                 {availableDocs.map(d => (
                   <option key={d.id} value={d.id}>{d.name} (Issued: {d.issueDate})</option>
                 ))}
               </select>
             </div>
             
             <button onClick={handleImport} disabled={!selectedDocId || importDoc.isPending} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50">
               {importDoc.isPending ? 'Importing...' : 'Import Selected Document'}
             </button>
           </div>
        )}
      </div>
    </div>
  );
}
