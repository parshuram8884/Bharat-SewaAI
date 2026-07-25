import React from 'react';
import { usePaymentAnalytics } from '../../../hooks/usePaymentAdminQuery';
import { PaymentFailureReasonLabels } from '../../../data/paymentFailureReasonModel';

const PaymentAdminOverview = () => {
  const { data: analytics, isLoading } = usePaymentAnalytics();

  if (isLoading) return <div className="p-6">Loading analytics...</div>;
  if (!analytics) return <div className="p-6">No analytics data available.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Payment Analytics & Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-medium text-gray-500 uppercase">Total Sanctioned</h2>
          <p className="text-2xl font-bold text-gray-800 mt-2">₹ {analytics.totalSanctionedAmount.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-medium text-gray-500 uppercase">Total Paid</h2>
          <p className="text-2xl font-bold text-green-600 mt-2">₹ {analytics.totalPaidAmount.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-medium text-gray-500 uppercase">Pending Payments</h2>
          <p className="text-2xl font-bold text-blue-600 mt-2">{analytics.pendingCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-medium text-gray-500 uppercase">Failed Payments</h2>
          <p className="text-2xl font-bold text-red-600 mt-2">{analytics.failedCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Failure Reasons Breakdown</h3>
          {Object.keys(analytics.failureReasons).length === 0 ? (
            <p className="text-gray-500 text-sm">No payment failures recorded.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(analytics.failureReasons).map(([reason, count]) => (
                <div key={reason} className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">{PaymentFailureReasonLabels[reason] || reason}</span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Operational Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700">Awaiting Manual Review</span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">{analytics.manualReviewCount}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700">Scheduled for Retry</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">{analytics.retryCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAdminOverview;
