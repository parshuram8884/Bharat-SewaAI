import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDocumentDetail, useCreateShareLink } from '../../hooks/useDocumentVaultQuery';

export default function DocumentSharePage() {
  const { documentId } = useParams();
  const { data: doc, isLoading } = useDocumentDetail(documentId);
  const createShareLink = useCreateShareLink();

  const [hours, setHours] = useState(24);
  const [scope, setScope] = useState('verification-summary');
  const [generatedLink, setGeneratedLink] = useState(null);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!doc) return <div className="p-8 text-red-600">Document not found.</div>;

  const handleShare = () => {
    createShareLink.mutate({
      documentId,
      options: { hours: Number(hours), scope }
    }, {
      onSuccess: (shareData) => {
        const link = `${window.location.origin}/shared/docs/${shareData.token}`;
        setGeneratedLink(link);
      },
      onError: (err) => {
        alert(err.message);
      }
    });
  };

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Share Document</h1>
        <Link to={`/documents/${doc.id}`} className="text-gray-600 hover:text-gray-900">Back</Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div className="p-4 bg-yellow-50 rounded-md text-yellow-800 text-sm">
          <strong>Demonstration Note:</strong> Generated links work only in this browser's local environment.
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Expiry Time</label>
          <select value={hours} onChange={e => setHours(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="24">24 Hours</option>
            <option value="168">7 Days</option>
            <option value="720">30 Days</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Access Scope</label>
          <select value={scope} onChange={e => setScope(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="metadata-only">Metadata Only</option>
            <option value="verification-summary">Verification Summary</option>
            <option value="masked-preview">Masked Preview</option>
            <option value="download-demo-copy">Download Demo Copy</option>
          </select>
        </div>

        {!generatedLink ? (
          <button onClick={handleShare} disabled={createShareLink.isPending} className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            {createShareLink.isPending ? 'Generating...' : 'Generate Share Link'}
          </button>
        ) : (
          <div className="mt-4 p-4 border rounded-md border-green-200 bg-green-50">
            <p className="text-sm font-medium text-green-800 mb-2">Link Generated Successfully:</p>
            <div className="flex space-x-2">
              <input type="text" readOnly value={generatedLink} className="flex-1 block w-full rounded-md border-gray-300 sm:text-sm bg-white" />
              <button onClick={handleCopy} className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900">Copy</button>
            </div>
            <div className="mt-4 flex space-x-2">
              <a href={generatedLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Open in new tab</a>
              <button onClick={() => setGeneratedLink(null)} className="text-gray-500 hover:underline ml-4">Create another</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


