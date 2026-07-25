import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBenefitDetail, useBenefitSanction } from '../../hooks/useBenefitQuery';
import { benefitService } from '../../services/benefitService';

const BenefitSanctionPage = () => {
  const { benefitId } = useParams();
  const { data: benefit, isLoading: isBenefitLoading } = useBenefitDetail(benefitId);
  const { data: sanction, isLoading: isSanctionLoading } = useBenefitSanction(benefitId);

  if (isBenefitLoading || isSanctionLoading) return <div className="p-6">Loading sanction order...</div>;
  if (!benefit) return <div className="p-6">Benefit not found.</div>;
  if (!benefit.sanctionNumber || !sanction) return <div className="p-6">Sanction order has not been generated for this benefit yet.</div>;

  const downloadData = benefitService.getSanctionDownloadData(benefitId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center print:hidden">
        <Link to={`/benefits/${benefitId}`} className="text-blue-600 hover:underline">&larr; Back to Tracking Hub</Link>
        <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Print / Download PDF
        </button>
      </div>

      <div className="bg-white p-10 rounded shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0">
        <div className="text-center border-b pb-6 mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-wider">Government of Bharat</h1>
          <h2 className="text-xl font-semibold mt-2">Department of {benefit.departmentId.replace('dept-', '').toUpperCase()}</h2>
          <h3 className="text-lg font-medium mt-1">Official Sanction Order</h3>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <p><span className="font-semibold">Sanction No:</span> {benefit.sanctionNumber}</p>
            <p><span className="font-semibold">Application Ref:</span> {benefit.applicationId}</p>
          </div>
          <div className="text-right">
            <p><span className="font-semibold">Date:</span> {new Date(benefit.sanctionDate).toLocaleDateString()}</p>
            <p><span className="font-semibold">Scheme:</span> {benefit.schemeId}</p>
          </div>
        </div>

        <div className="mb-8 leading-relaxed">
          <p className="mb-4">
            Sanction of the competent authority is hereby accorded to the payment of <span className="font-semibold">{benefit.currency} {benefit.benefitAmount}</span> to the beneficiary mentioned below under the scheme <span className="font-semibold">{benefit.benefitName}</span>.
          </p>
          
          <table className="w-full border-collapse border border-gray-300 my-6">
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3 bg-gray-50 font-semibold w-1/3">Beneficiary ID</td>
                <td className="border border-gray-300 p-3">{benefit.citizenId}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 bg-gray-50 font-semibold">Sanctioned Amount</td>
                <td className="border border-gray-300 p-3">{benefit.currency} {benefit.benefitAmount}/-</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 bg-gray-50 font-semibold">Payment Mode</td>
                <td className="border border-gray-300 p-3">{benefit.paymentMode.replace('-', ' ').toUpperCase()}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 bg-gray-50 font-semibold">Bank Account</td>
                <td className="border border-gray-300 p-3">{benefit.bankMasked} - {benefit.accountMasked}</td>
              </tr>
            </tbody>
          </table>
          
          <p>
            The expenditure is debitable to the appropriate head of account of the department for the current financial year.
            The payment will be released through authorized disbursement channels.
          </p>
        </div>

        <div className="mt-16 flex justify-end">
          <div className="text-center">
            <p className="font-semibold">(Digitally Signed)</p>
            <p className="mt-2">Competent Authority / Finance Manager</p>
            <p className="text-sm text-gray-500">{sanction.approvedBy}</p>
          </div>
        </div>

        <div className="mt-16 pt-4 border-t text-sm text-gray-500 italic text-center">
          {downloadData.documentDisclaimer.split('\n').map((line, i) => <p key={i}>{line}</p>)}
        </div>
      </div>
    </div>
  );
};

export default BenefitSanctionPage;
