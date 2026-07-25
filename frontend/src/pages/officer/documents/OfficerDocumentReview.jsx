import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useVerificationQueue, useSubmitRecommendation, useApproveVerification } from '../../../hooks/useDocumentVerificationQuery';
import { useAuth } from '../../../hooks/useAuth';
import { permissionService } from '../../../services/permissionService';
import { Permissions } from '../../../data/officerPermissionModel';
import { DocumentVerificationStatusLabels } from '../../../data/documentVerificationStatusModel';

export default function OfficerDocumentReview() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: queue, isLoading } = useVerificationQueue();
  const doc = queue?.find(d => d.id === documentId);
  
  const recommend = useSubmitRecommendation();
  const approve = useApproveVerification();

  const [remark, setRemark] = useState('');

  if (isLoading) return <div className="p-8">Loading document...</div>;
  if (!doc) return <div className="p-8 text-red-600">Document not found or access denied.</div>;

  const handleRecommend = (type) => {
    if (!remark) return alert("Please enter a remark.");
    recommend.mutate({ documentId, recommendation: type, remark }, {
      onSuccess: () => {
        alert(`Successfully recommended ${type}`);
        navigate('/officer/documents/queue');
      },
      onError: (err) => alert(err.message)
    });
  };

  const handleApprove = () => {
    approve.mutate(documentId, {
      onSuccess: () => {
        alert("Final approval successful.");
        navigate('/officer/documents/queue');
      },
      onError: (err) => alert(err.message)
    });
  };

  const isFinalApprovalAllowed = permissionService.hasPermission(user, Permissions.DOCUMENT_VERIFICATION_DECISION);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Review Document: {doc.id}</h1>
        <Link to="/officer/documents/queue" className="text-gray-600 hover:text-gray-900">Back to Queue</Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
         <div className="grid grid-cols-2 gap-4 border-b pb-6">
            <div>
              <h3 className="font-semibold text-gray-700">Document Type</h3>
              <p>{doc.documentType}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Status</h3>
              <p>{DocumentVerificationStatusLabels[doc.verificationStatus]}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Source</h3>
              <p>{doc.source}</p>
            </div>
            <div>
               <h3 className="font-semibold text-gray-700">Citizen ID</h3>
               <p>{doc.citizenId}</p>
            </div>
         </div>

         <div>
           <label className="block font-medium text-gray-700">Internal Remark / Justification</label>
           <textarea
             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
             rows="3"
             value={remark}
             onChange={(e) => setRemark(e.target.value)}
           ></textarea>
         </div>

         <div className="flex space-x-4 pt-4">
           {/* Reviewers recommend */}
           <button onClick={() => handleRecommend('approve')} disabled={recommend.isPending} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
             Recommend Approval
           </button>
           <button onClick={() => handleRecommend('reject')} disabled={recommend.isPending} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
             Recommend Rejection
           </button>

           {/* Managers approve */}
           {isFinalApprovalAllowed && (
              <button onClick={handleApprove} disabled={approve.isPending} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 ml-auto">
                Final Approval (Maker-Checker Enforced)
              </button>
           )}
         </div>
      </div>
    </div>
  );
}


