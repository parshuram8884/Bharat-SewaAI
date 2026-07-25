import React from 'react';
import { Link } from 'react-router-dom';
import { usePaymentDashboard } from '../../../hooks/usePaymentOfficerQuery';

const PaymentOfficerDashboard = () => {
  const { data: dashboardData, isLoading } = usePaymentDashboard();

  if (isLoading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Payment Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Batches</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">{dashboardData?.pendingBatches || 0}</p>
          <Link to="/officer/payments/batches" className="text-blue-600 text-sm mt-4 inline-block hover:underline">View Batches &rarr;</Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Failed Payments</h2>
          <p className="text-3xl font-bold text-red-600 mt-2">{dashboardData?.failedPayments || 0}</p>
          <Link to="/officer/payments/queue/failed" className="text-blue-600 text-sm mt-4 inline-block hover:underline">View Failures &rarr;</Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Manual Review</h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{dashboardData?.manualReviews || 0}</p>
          <Link to="/officer/payments/queue/manual-review" className="text-blue-600 text-sm mt-4 inline-block hover:underline">View Reviews &rarr;</Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/officer/payments/queue" className="flex items-center p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Payment Processing Queue</h3>
              <p className="text-sm text-gray-500">View and manage pending sanctions and payments.</p>
            </div>
          </Link>

          <Link to="/officer/payments/batches/new" className="flex items-center p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
            <div className="bg-green-100 text-green-600 p-3 rounded-full mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Create Payment Batch</h3>
              <p className="text-sm text-gray-500">Group ready payments into a batch for approval.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentOfficerDashboard;
