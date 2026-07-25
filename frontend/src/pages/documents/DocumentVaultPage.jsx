import React from 'react';
import { Link } from 'react-router-dom';
import { useCitizenDocuments } from '../../hooks/useDocumentVaultQuery';
import { DocumentTypeLabels } from '../../data/documentTypeModel';
import { DocumentLifecycleStatusLabels } from '../../data/documentLifecycleStatusModel';
import { DocumentVerificationStatusLabels } from '../../data/documentVerificationStatusModel';
import { useTranslation } from 'react-i18next';

export default function DocumentVaultPage() {
  const { t } = useTranslation();
  const { data: documents, isLoading } = useCitizenDocuments();

  if (isLoading) return <div className="p-8 text-center" aria-live="polite">Loading vault...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Digital Document Vault</h1>
        <div className="space-x-3">
          <Link to="/documents/upload" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            Upload Document
          </Link>
          <Link to="/documents/import" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
            DigiLocker Import
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lifecycle Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents?.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No documents found in your vault.
                </td>
              </tr>
            ) : (
              documents?.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{DocumentTypeLabels[doc.documentType] || doc.documentType}</div>
                    <div className="text-xs text-gray-500">ID: {doc.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {DocumentLifecycleStatusLabels[doc.lifecycleStatus]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {DocumentVerificationStatusLabels[doc.verificationStatus]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/documents/${doc.id}`} className="text-indigo-600 hover:text-indigo-900">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


