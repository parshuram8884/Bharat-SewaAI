import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { officerAuthService } from '../../services/officerAuthService';
import { permissionService } from '../../services/permissionService';
import { Permissions } from '../../data/officerPermissionModel';
import { useApproveApplication, useSaveReviewChecklist } from '../../hooks/useOfficerReviewQuery';
import { InternalStatus } from '../../data/officerWorkflowTransitions';

export const DecisionSummaryCard = ({ application, onRecommend, onApprove }) => {
  const user = officerAuthService.getCurrentUser();
  const canRecommend = permissionService.hasPermission(user, Permissions.APPLICATION_RECOMMEND);
  const canApprove = permissionService.hasPermission(user, Permissions.APPLICATION_APPROVE);
  const isTerminal = permissionService.isTerminalState(application.internalStatus);

  if (isTerminal) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Final Decision Reached</h3>
        <p className="text-slate-600 mb-4">This application is {application.internalStatus}. No further decisions can be made.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Review Decision</h3>
      
      <div className="space-y-4">
        {canRecommend && !canApprove && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Submit Recommendation</h4>
            <p className="text-sm text-blue-800 mb-4">As a reviewer, you can recommend this application for approval or rejection. A senior reviewer must finalize it.</p>
            <button 
              onClick={onRecommend}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Submit Recommendation
            </button>
          </div>
        )}

        {canApprove && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">Final Decision</h4>
            <p className="text-sm text-slate-600 mb-4">You have the authority to finalize this application.</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={onApprove}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Approve
              </button>
              <button 
                onClick={() => alert("Rejection flow mocked.")}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-200">
          <button 
             onClick={() => alert("Escalation mocked.")}
             className="w-full text-center text-sm text-slate-600 hover:text-slate-900 font-medium"
          >
            Escalate Case
          </button>
        </div>
      </div>
    </div>
  );
};

export const ApprovalFormDialog = ({ application, onClose }) => {
  const [benefitSummary, setBenefitSummary] = useState('');
  const [citizenMessage, setCitizenMessage] = useState('Your application has been approved.');
  const [internalNote, setInternalNote] = useState('');
  const [confirmName, setConfirmName] = useState('');
  
  const approveMutation = useApproveApplication();
  const user = officerAuthService.getCurrentUser();

  const handleApprove = (e) => {
    e.preventDefault();
    if (confirmName !== user.name) return alert("Typed name must match exactly.");
    
    approveMutation.mutate(
      { id: application.id, benefitSummary, citizenMessage, internalNote },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-green-700">Approve Application</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="approve-form" onSubmit={handleApprove} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Benefit Summary / Reference</label>
              <input type="text" value={benefitSummary} onChange={e=>setBenefitSummary(e.target.value)} className="w-full text-sm border-slate-300 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Citizen-Visible Message</label>
              <textarea rows={3} value={citizenMessage} onChange={e=>setCitizenMessage(e.target.value)} className="w-full text-sm border-slate-300 rounded-md" required></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Internal Note (Private)</label>
              <textarea rows={2} value={internalNote} onChange={e=>setInternalNote(e.target.value)} className="w-full text-sm border-slate-300 rounded-md"></textarea>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <label className="block text-sm font-bold text-slate-900 mb-2">Final Confirmation</label>
              <p className="text-sm text-slate-700 mb-3">By approving this application, you confirm that all mandatory checks are satisfied and the citizen meets all eligibility criteria. This action cannot be reversed.</p>
              <input 
                type="text" 
                placeholder={`Type "${user.name}" to confirm`} 
                value={confirmName} 
                onChange={e=>setConfirmName(e.target.value)}
                className="w-full text-sm border-slate-300 rounded-md"
                required
              />
            </div>
          </form>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 font-medium text-slate-700 hover:bg-slate-100 rounded-md">Cancel</button>
          <button 
            type="submit" 
            form="approve-form"
            disabled={approveMutation.isPending || confirmName !== user.name}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md disabled:opacity-50"
          >
            {approveMutation.isPending ? 'Processing...' : 'Confirm Approval'}
          </button>
        </div>
      </div>
    </div>
  );
};
