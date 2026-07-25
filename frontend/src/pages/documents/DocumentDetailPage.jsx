import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDocumentDetail, useSubmitDocument, useRequestVerification, useApplyEsign } from '../../hooks/useDocumentVaultQuery';
import { DocumentTypeLabels } from '../../data/documentTypeModel';
import { DocumentLifecycleStatus } from '../../data/documentLifecycleStatusModel';
import { DocumentVerificationStatus } from '../../data/documentVerificationStatusModel';
import { DocumentTrustLevel } from '../../data/documentTrustLevelModel';
import { isVerificationStatusFinal } from '../../data/documentWorkflowTransitions';

export default function DocumentDetailPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { data: doc, isLoading } = useDocumentDetail(documentId);
  const submitDoc = useSubmitDocument();
  const verifyDoc = useRequestVerification();
  const esignDoc = useApplyEsign();

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!doc) return <div className="p-8 text-red-600">Document not found or access denied.</div>;

  const handleRunOcr = () => {
    submitDoc.mutate(documentId, {
      onSuccess: () => {
        alert("Mock OCR Completed. Status updated.");
      }
    });
  };

  const handleRequestVerification = () => {
    verifyDoc.mutate(documentId, {
      onSuccess: () => {
        alert("Verification requested successfully.");
      }
    });
  };
  
  const handleApplyEsign = () => {
    esignDoc.mutate(documentId, {
      onSuccess: () => {
        alert("Digitally Signed — Demonstration Only");
      },
      onError: (err) => {
        alert(err.message);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {DocumentTypeLabels[doc.documentType]} Details
        </h1>
        <div className="space-x-3">
          <Link to="/documents" className="text-gray-600 hover:text-gray-900">Back to Vault</Link>
          <Link to={`/documents/${doc.id}/share`} className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200">
            Share
          </Link>
          {doc.trustLevel === DocumentTrustLevel.OFFICER_VERIFIED || doc.trustLevel === DocumentTrustLevel.TRUSTED_MOCK_IMPORT ? (
             <button onClick={handleApplyEsign} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Apply mock eSign
             </button>
          ) : null}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium mb-4">Metadata</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Document ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{doc.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{DocumentTypeLabels[doc.documentType]}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Lifecycle Status</dt>
              <dd className="mt-1 text-sm text-gray-900">{doc.lifecycleStatus}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Verification Status</dt>
              <dd className="mt-1 text-sm text-gray-900">{doc.verificationStatus}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Source</dt>
              <dd className="mt-1 text-sm text-gray-900">{doc.source}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Trust Level</dt>
              <dd className="mt-1 text-sm text-gray-900">{doc.trustLevel}</dd>
            </div>
          </dl>
        </div>

        <div className="border-l pl-6 flex flex-col space-y-4">
          <h2 className="text-lg font-medium mb-2">Actions</h2>
          
          {doc.lifecycleStatus === DocumentLifecycleStatus.DRAFT && (
            <button onClick={handleRunOcr} disabled={submitDoc.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-left">
              {submitDoc.isPending ? 'Processing...' : 'Run Mock OCR'}
            </button>
          )}

          {doc.lifecycleStatus === DocumentLifecycleStatus.UPLOADED && (
             <div className="p-4 bg-yellow-50 rounded-md">
               OCR Processing... (Simulate completion by re-fetching or state change if this was real)
               <button onClick={() => {
                  // In real app, this would be webhooks. For demo, we mutate locally in hook.
               }} className="ml-4 text-indigo-600 underline">Refresh</button>
             </div>
          )}

          {doc.lifecycleStatus === DocumentLifecycleStatus.OCR_COMPLETE && doc.verificationStatus === DocumentVerificationStatus.NOT_REQUESTED && (
             <button onClick={handleRequestVerification} disabled={verifyDoc.isPending} className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 text-left">
              {verifyDoc.isPending ? 'Requesting...' : 'Request Verification'}
            </button>
          )}

          <Link to={`/documents/${doc.id}/history`} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-left block w-max">
            View History & Versions
          </Link>
          
          {isVerificationStatusFinal(doc.verificationStatus) && (
            <div className="p-4 bg-green-50 text-green-800 rounded-md mt-auto">
              Verification final status: {doc.verificationStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


