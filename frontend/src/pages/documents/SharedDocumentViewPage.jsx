import React from 'react';
import { useParams } from 'react-router-dom';
import { useSharedDocument } from '../../hooks/useDocumentVaultQuery';
import { DocumentTypeLabels } from '../../data/documentTypeModel';

export default function SharedDocumentViewPage() {
  const { token } = useParams();
  const { data: doc, isLoading, error } = useSharedDocument(token);

  if (isLoading) return <div className="p-8 text-center">Loading shared document...</div>;
  
  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 text-red-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h1 className="text-xl font-bold text-white">Bharat Sewa - Shared Document Verification</h1>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="p-4 bg-yellow-50 rounded-md text-yellow-800 text-sm">
            <strong>Demonstration Only:</strong> This document is shared from the local mock environment. It is not connected to a real verification system.
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Document Type</p>
              <p className="mt-1 font-semibold text-gray-900">{DocumentTypeLabels[doc.documentType]}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Verification Status</p>
              <p className="mt-1">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${doc.verificationStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {doc.verificationStatus}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Access Scope</p>
              <p className="mt-1 font-semibold text-gray-900">{doc.scope}</p>
            </div>
          </div>
          
          {doc.metadata && (
             <div className="mt-6 border-t pt-6">
               <h3 className="text-lg font-medium mb-4">Extracted Metadata</h3>
               <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {Object.entries(doc.metadata).map(([key, val]) => (
                    <div key={key}>
                      <dt className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{String(val)}</dd>
                    </div>
                 ))}
               </dl>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}


