import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUploadDocument } from '../../hooks/useDocumentVaultQuery';
import { DocumentType, DocumentTypeLabels } from '../../data/documentTypeModel';

export default function DocumentUploadPage() {
  const navigate = useNavigate();
  const uploadDoc = useUploadDocument();
  
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState(DocumentType.INCOME_CERTIFICATE);
  const [isDraft, setIsDraft] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");
    
    // Simulate upload and metadata extraction
    uploadDoc.mutate(
      {
        documentType: docType,
        name: file.name,
        departmentId: 'dept-general'
      },
      {
        onSuccess: (data) => {
          if (isDraft) {
             navigate(`/documents/${data.id}`);
          } else {
             navigate(`/documents/${data.id}/preview`);
          }
        }
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Upload Document</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-lg space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Document Type</label>
          <select 
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {Object.values(DocumentType).map(t => (
               <option key={t} value={t}>{DocumentTypeLabels[t]}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">File</label>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setIsDraft(true);
              handleSubmit({ preventDefault: () => {} });
            }}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            onClick={() => setIsDraft(false)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            disabled={uploadDoc.isPending}
          >
            {uploadDoc.isPending ? 'Uploading...' : 'Submit & Run OCR'}
          </button>
        </div>
      </form>
    </div>
  );
}


