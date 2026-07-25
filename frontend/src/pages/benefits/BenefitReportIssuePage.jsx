import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBenefitDetail } from '../../hooks/useBenefitQuery';
import { benefitService } from '../../services/benefitService';
import { useCreateGrievanceDraft } from '../../hooks/useGrievanceQuery';

const BenefitReportIssuePage = () => {
  const { benefitId } = useParams();
  const navigate = useNavigate();
  const { data: benefit, isLoading } = useBenefitDetail(benefitId);
  const createGrievanceDraft = useCreateGrievanceDraft();

  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!benefit) return <div className="p-6">Benefit not found.</div>;

  if (!benefitService.canReportPaymentIssue(benefitId)) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Report Payment Issue</h1>
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded border border-yellow-200">
          You cannot report an issue for this benefit at its current status. Issues can only be reported if the payment has failed or is stuck in manual review for an extended period.
        </div>
        <Link to={`/benefits/${benefitId}`} className="text-blue-600 hover:underline mt-4 inline-block">&larr; Back</Link>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    createGrievanceDraft.mutate(
      {
        departmentId: benefit.departmentId,
        categoryId: 'payment_failure',
        applicationId: benefit.applicationId,
        description: `Payment Issue for Benefit ${benefitId}: ${description}`,
        evidenceFileIds: []
      },
      {
        onSuccess: (data) => {
          navigate(`/grievances/${data.id}`);
        },
        onSettled: () => setSubmitting(false)
      }
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link to={`/benefits/${benefitId}`} className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Tracking Hub</Link>
        <h1 className="text-2xl font-bold text-gray-800">Report Payment Issue</h1>
        <p className="text-sm text-gray-500 mt-1">For Benefit ID: {benefit.id}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm text-gray-600 mb-4">
          If your payment has failed or you believe there is an error in your account details, you can raise an official grievance here.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 h-32"
              placeholder="Describe the issue you are facing with this payment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={submitting || description.trim() === ''}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Grievance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BenefitReportIssuePage;
