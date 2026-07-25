import React from 'react';
import { Link } from 'react-router-dom';
import { useVerificationQueue, useAssignDocument } from '../../../hooks/useDocumentVerificationQuery';
import { DocumentTypeLabels } from '../../../data/documentTypeModel';
import { DocumentVerificationStatusLabels } from '../../../data/documentVerificationStatusModel';

export default function OfficerDocumentQueue() {
  const { data: queue, isLoading } = useVerificationQueue();
  const assignDoc = useAssignDocument();

  if (isLoading) return <div className="p-8">Loading queue...</div>;

  const handleAssign = (docId) => {
    assignDoc.mutate(docId, {
      onSuccess: () => alert("Assigned to you")
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Document Verification Queue</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {queue?.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">Queue is empty</td></tr>
            ) : (
              queue?.map(doc => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{DocumentTypeLabels[doc.documentType]}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {DocumentVerificationStatusLabels[doc.verificationStatus]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.assignedOfficerId ? 'Assigned' : 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    {!doc.assignedOfficerId ? (
                      <button onClick={() => handleAssign(doc.id)} disabled={assignDoc.isPending} className="text-indigo-600 hover:text-indigo-900">
                        Assign to Me
                      </button>
                    ) : (
                      <Link to={`/officer/documents/${doc.id}/review`} className="text-indigo-600 hover:text-indigo-900">
                        Review
                      </Link>
                    )}
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


