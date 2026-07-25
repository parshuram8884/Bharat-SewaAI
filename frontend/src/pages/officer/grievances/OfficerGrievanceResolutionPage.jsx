import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOfficerGrievance, useProposeResolution, useApproveResolution } from '../../../hooks/useGrievanceOfficerQuery';
import { useGrievanceResolution } from '../../../hooks/useGrievanceQuery';
import { useAuth } from '../../../hooks/useAuth';
import { permissionService } from '../../../services/permissionService';

const OfficerGrievanceResolutionPage = () => {
  const { grievanceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: grievance, isLoading: gLoading } = useOfficerGrievance(grievanceId);
  const { data: resolution, isLoading: rLoading } = useGrievanceResolution(grievanceId);
  
  const proposeRes = useProposeResolution();
  const approveRes = useApproveResolution();

  const [formData, setFormData] = useState({
    resolutionType: 'information-provided',
    summary: '',
    detailedAction: '',
    citizenMessage: '',
    internalNote: ''
  });

  if (gLoading || rLoading) return <div className="p-8 text-center animate-pulse">Loading...</div>;
  if (!grievance) return <div className="p-8 text-center text-red-600">Grievance not found.</div>;

  const isAssignedToMe = grievance.assignedOfficerId === user?.id;
  const canResolve = permissionService.canResolveGrievance(user, grievance);
  const canPropose = isAssignedToMe && grievance.internalStatus !== 'resolution-approval-pending' && grievance.internalStatus !== 'resolution-approved' && grievance.internalStatus !== 'closure-pending';
  
  // A manager/admin can approve, or someone else with permissions, but not the proposer.
  const canApprove = canResolve && resolution?.status === 'resolution-approval-pending' && resolution?.proposedBy !== user?.id;

  const handlePropose = async (e) => {
    e.preventDefault();
    if (!canPropose) return;
    try {
      await proposeRes.mutateAsync({ grievanceId, resolutionData: formData });
      // Reset
    } catch (error) {
      console.error(error);
      alert('Failed to propose resolution');
    }
  };

  const handleApprove = async () => {
    if (!canApprove) return;
    try {
      await approveRes.mutateAsync({ grievanceId, resolutionId: resolution.id });
    } catch (error) {
      console.error(error);
      alert('Failed to approve resolution');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/officer/grievances/${grievance.id}`)} className="text-slate-400 hover:text-slate-900">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Resolution Hub</h1>
            <p className="text-sm text-slate-500">For {grievance.acknowledgementNumber}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-100 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {resolution && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                 <h2 className="font-bold text-slate-800">Current Resolution Status</h2>
                 <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                    resolution.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    resolution.status === 'disputed' ? 'bg-amber-100 text-amber-700' :
                    resolution.status === 'pending-citizen-response' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                 }`}>
                   {resolution.status.replace(/-/g, ' ')}
                 </span>
               </div>
               <div className="p-6 space-y-4 text-sm">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-slate-500 mb-1">Proposed By</p>
                     <p className="font-medium text-slate-900">{resolution.proposedBy}</p>
                   </div>
                   <div>
                     <p className="text-slate-500 mb-1">Proposed At</p>
                     <p className="font-medium text-slate-900">{new Date(resolution.proposedAt).toLocaleString()}</p>
                   </div>
                   {resolution.approvedBy && (
                     <>
                       <div>
                         <p className="text-slate-500 mb-1">Approved By</p>
                         <p className="font-medium text-slate-900">{resolution.approvedBy}</p>
                       </div>
                       <div>
                         <p className="text-slate-500 mb-1">Approved At</p>
                         <p className="font-medium text-slate-900">{new Date(resolution.approvedAt).toLocaleString()}</p>
                       </div>
                     </>
                   )}
                 </div>
                 
                 <div className="mt-4 pt-4 border-t border-slate-100">
                   <p className="text-slate-500 mb-1 font-semibold">Summary</p>
                   <p className="text-slate-800 bg-slate-50 p-3 rounded">{resolution.summary}</p>
                 </div>

                 {resolution.citizenResponse && (
                   <div className="mt-4 pt-4 border-t border-slate-100">
                     <p className="text-amber-700 mb-1 font-semibold">Citizen Response (Disputed)</p>
                     <p className="text-amber-900 bg-amber-50 border border-amber-100 p-3 rounded">{resolution.citizenResponse}</p>
                   </div>
                 )}

                 {canApprove && (
                   <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                     <button
                       onClick={handleApprove}
                       disabled={approveRes.isPending}
                       className="px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 disabled:opacity-50"
                     >
                       {approveRes.isPending ? 'Approving...' : 'Approve Resolution for Citizen'}
                     </button>
                   </div>
                 )}
               </div>
             </div>
          )}

          {canPropose && (
            <form onSubmit={handlePropose} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                 <h2 className="font-bold text-slate-800">Propose New Resolution</h2>
                 <p className="text-xs text-slate-500 mt-1">Submit a resolution for approval by a manager or senior officer.</p>
               </div>
               
               <div className="p-6 space-y-5">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Resolution Type</label>
                    <select
                      value={formData.resolutionType}
                      onChange={(e) => setFormData({...formData, resolutionType: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    >
                      <option value="information-provided">Information Provided</option>
                      <option value="correction-completed">Correction Completed</option>
                      <option value="application-approved">Application Approved</option>
                      <option value="rejected">Rejected / Invalid Grievance</option>
                    </select>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Public Summary</label>
                    <input
                      type="text"
                      value={formData.summary}
                      onChange={(e) => setFormData({...formData, summary: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Brief summary for the citizen"
                      required
                    />
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Action (Internal)</label>
                    <textarea
                      value={formData.detailedAction}
                      onChange={(e) => setFormData({...formData, detailedAction: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="What was exactly done to resolve this?"
                      rows={3}
                      required
                    />
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message to Citizen</label>
                    <textarea
                      value={formData.citizenMessage}
                      onChange={(e) => setFormData({...formData, citizenMessage: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Will be visible to the citizen"
                      rows={3}
                      required
                    />
                 </div>

                 <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                       type="submit"
                       disabled={proposeRes.isPending}
                       className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                     >
                       {proposeRes.isPending ? 'Submitting...' : 'Propose Resolution'}
                     </button>
                 </div>
               </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default OfficerGrievanceResolutionPage;
