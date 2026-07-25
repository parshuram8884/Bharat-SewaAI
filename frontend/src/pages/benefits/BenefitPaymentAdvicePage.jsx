import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBenefitDetail } from '../../hooks/useBenefitQuery';
import { benefitService } from '../../services/benefitService';
import { BenefitPublicStatus } from '../../data/benefitPublicStatusModel';

const BenefitPaymentAdvicePage = () => {
  const { benefitId } = useParams();
  const { data: benefit, isLoading } = useBenefitDetail(benefitId);

  if (isLoading) return <div className="p-6">Loading payment advice...</div>;
  if (!benefit) return <div className="p-6">Benefit not found.</div>;
  
  if (benefit.publicStatus !== BenefitPublicStatus.PAYMENT_SUCCESSFUL && benefit.publicStatus !== BenefitPublicStatus.BENEFIT_DELIVERED) {
    return <div className="p-6">Payment advice is only available for successful payments.</div>;
  }

  const downloadData = benefitService.getPaymentAdviceDownloadData(benefitId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center print:hidden">
        <Link to={`/benefits/${benefitId}`} className="text-blue-600 hover:underline">&larr; Back to Tracking Hub</Link>
        <button onClick={() => window.print()} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Print / Download Advice
        </button>
      </div>

      <div className="bg-white p-10 rounded shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0">
        <div className="text-center border-b pb-6 mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-wider">Payment Advice</h1>
          <h2 className="text-xl font-semibold mt-2">Beneficiary Payment Confirmation</h2>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">Beneficiary Details</h3>
            <p className="text-sm mb-1"><span className="text-gray-500">Citizen ID:</span> {benefit.citizenId}</p>
            <p className="text-sm mb-1"><span className="text-gray-500">Bank:</span> {benefit.bankMasked}</p>
            <p className="text-sm"><span className="text-gray-500">Account:</span> {benefit.accountMasked}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">Transaction Details</h3>
            <p className="text-sm mb-1"><span className="text-gray-500">Amount:</span> {benefit.currency} {benefit.benefitAmount}/-</p>
            <p className="text-sm mb-1"><span className="text-gray-500">Mode:</span> {benefit.paymentMode}</p>
            <p className="text-sm"><span className="text-gray-500">Reference No:</span> {benefit.paymentReference}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-3">Payment Description</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Scheme</th>
                <th className="border border-gray-300 p-2 text-left">Application ID</th>
                <th className="border border-gray-300 p-2 text-left">Sanction Ref</th>
                <th className="border border-gray-300 p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">{benefit.benefitName}</td>
                <td className="border border-gray-300 p-2">{benefit.applicationId}</td>
                <td className="border border-gray-300 p-2">{benefit.sanctionNumber}</td>
                <td className="border border-gray-300 p-2 text-right">{benefit.currency} {benefit.benefitAmount}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="text-sm text-gray-700 mb-12">
          <p>This is a computer generated payment advice to confirm that the sanctioned amount has been successfully processed for credit to your designated bank account.</p>
        </div>

        <div className="mt-16 pt-4 border-t text-sm text-gray-500 italic text-center">
          {downloadData.documentDisclaimer.split('\n').map((line, i) => <p key={i}>{line}</p>)}
        </div>
      </div>
    </div>
  );
};

export default BenefitPaymentAdvicePage;
