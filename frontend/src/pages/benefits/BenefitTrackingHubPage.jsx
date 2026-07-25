import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBenefitDetail, useBenefitTimeline } from '../../hooks/useBenefitQuery';
import { BenefitPublicStatusLabels, BenefitPublicStatus } from '../../data/benefitPublicStatusModel';
import { benefitService } from '../../services/benefitService';

const BenefitTrackingHubPage = () => {
  const { benefitId } = useParams();
  const { data: benefit, isLoading: isBenefitLoading } = useBenefitDetail(benefitId);
  const { data: timeline, isLoading: isTimelineLoading } = useBenefitTimeline(benefitId);

  if (isBenefitLoading || isTimelineLoading) return <div className="p-6">Loading benefit details...</div>;
  if (!benefit) return <div className="p-6">Benefit not found.</div>;

  const canReportIssue = benefitService.canReportPaymentIssue(benefitId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/benefits" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Benefits</Link>
        <h1 className="text-2xl font-bold text-gray-800">Benefit Tracking Hub</h1>
        <p className="text-sm text-gray-500 mt-1">ID: {benefit.id}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold">{benefit.benefitName}</h2>
            <p className="text-gray-600 text-sm mt-1">Application: {benefit.applicationId}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            benefit.publicStatus === BenefitPublicStatus.PAYMENT_SUCCESSFUL || benefit.publicStatus === BenefitPublicStatus.BENEFIT_DELIVERED
              ? 'bg-green-100 text-green-800'
              : benefit.publicStatus === BenefitPublicStatus.PAYMENT_FAILED || benefit.publicStatus === BenefitPublicStatus.MANUAL_REVIEW
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {BenefitPublicStatusLabels[benefit.publicStatus]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Amount</p>
            <p className="font-medium">{benefit.currency} {benefit.benefitAmount}</p>
          </div>
          <div>
            <p className="text-gray-500">Payment Mode</p>
            <p className="font-medium">{benefit.paymentMode}</p>
          </div>
          <div>
            <p className="text-gray-500">Bank Account</p>
            <p className="font-medium">{benefit.bankMasked} - {benefit.accountMasked}</p>
          </div>
          <div>
            <p className="text-gray-500">Sanction Number</p>
            <p className="font-medium">{benefit.sanctionNumber || 'Pending'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Timeline</h3>
            <div className="space-y-4">
              {timeline && timeline.map((event, index) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      event.status === 'completed' ? 'bg-green-500' :
                      event.status === 'error' ? 'bg-red-500' :
                      'bg-gray-300'
                    }`} />
                    {index < timeline.length - 1 && <div className="w-0.5 h-full bg-gray-200 my-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-gray-800">{event.title}</p>
                    <p className="text-xs text-gray-500">{new Date(event.date).toLocaleString()}</p>
                    {event.details && <p className="text-sm mt-1 text-gray-600">{event.details}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-4 text-right">
              <Link to={`/benefits/${benefit.id}/timeline`} className="text-blue-600 text-sm font-medium hover:underline">View Full Timeline</Link>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Documents</h3>
            <div className="space-y-2">
              <Link to={`/benefits/${benefit.id}/sanction`} className="block w-full text-center px-4 py-2 bg-gray-50 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100 text-gray-700">
                View Sanction Order
              </Link>
              {(benefit.publicStatus === BenefitPublicStatus.PAYMENT_SUCCESSFUL || benefit.publicStatus === BenefitPublicStatus.BENEFIT_DELIVERED) && (
                <Link to={`/benefits/${benefit.id}/payment-advice`} className="block w-full text-center px-4 py-2 bg-gray-50 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100 text-gray-700">
                  Payment Advice
                </Link>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            {canReportIssue ? (
              <div>
                <p className="text-sm text-gray-600 mb-3">Facing issues with this payment?</p>
                <Link to={`/benefits/${benefit.id}/report-issue`} className="block w-full text-center px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded text-sm font-medium hover:bg-red-100">
                  Report Payment Issue
                </Link>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Support options will appear here if payment issues occur.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitTrackingHubPage;
