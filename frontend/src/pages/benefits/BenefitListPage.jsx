import React from 'react';
import { Link } from 'react-router-dom';
import { useCitizenBenefits } from '../../hooks/useBenefitQuery';
import { BenefitPublicStatusLabels, BenefitPublicStatus } from '../../data/benefitPublicStatusModel';

const BenefitListPage = () => {
  const { data: benefits, isLoading } = useCitizenBenefits();

  if (isLoading) return <div className="p-6">Loading benefits...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Benefits & Payments</h1>
      </div>

      {!benefits || benefits.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500 mb-4">You have no approved benefits yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {benefits.map(benefit => (
            <div key={benefit.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{benefit.benefitName}</h3>
                <p className="text-sm text-gray-500 mt-1">Application: {benefit.applicationId}</p>
                <div className="mt-2 text-sm">
                  <span className="font-medium text-gray-700">Amount:</span> {benefit.currency} {benefit.benefitAmount}
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  benefit.publicStatus === BenefitPublicStatus.PAYMENT_SUCCESSFUL || benefit.publicStatus === BenefitPublicStatus.BENEFIT_DELIVERED
                    ? 'bg-green-100 text-green-800'
                    : benefit.publicStatus === BenefitPublicStatus.PAYMENT_FAILED || benefit.publicStatus === BenefitPublicStatus.MANUAL_REVIEW
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {BenefitPublicStatusLabels[benefit.publicStatus]}
                </span>
                <Link to={`/benefits/${benefit.id}`} className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Track Status &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BenefitListPage;
