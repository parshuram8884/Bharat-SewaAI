import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { openDataService } from '../../../services/openDataService';

export default function OpenDataDatasetReviewPage() {
  const { datasetId } = useParams();
  const navigate = useNavigate();

  const handleReview = (decision) => {
    openDataService.completePrivacyReview(datasetId, 'GOVERNANCE_MANAGER_DEMO', decision);
    navigate('/admin/open-data/datasets');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Privacy Review - {datasetId}</h1>
      <p className="mb-4">Review dataset for minimum group size compliance, PII removal, and complementary disclosure.</p>
      <div className="space-x-4">
        <button onClick={() => handleReview('approved')} className="bg-green-600 text-white px-4 py-2 rounded">Approve</button>
        <button onClick={() => handleReview('rejected')} className="bg-red-600 text-white px-4 py-2 rounded">Reject</button>
      </div>
    </div>
  );
}

