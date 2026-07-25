import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOfficerGrievance, useAssignGrievance } from '../../../hooks/useGrievanceOfficerQuery';
import { useAuth } from '../../../hooks/useAuth';
import { GrievancePublicStatusConfig } from '../../../data/grievancePublicStatusModel';

const OfficerGrievanceReviewPage = () => {
  const { grievanceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: grievance, isLoading, error } = useOfficerGrievance(grievanceId);
  const assignMutation = useAssignGrievance();

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading grievance details...</div>;
  if (error || !grievance) return <div className="p-8 text-center text-red-600">Failed to load grievance. It may not exist or you do not have permission to view it.</div>;

  const isAssignedToMe = grievance.assignedOfficerId === user?.id;
  const isUnassigned = !grievance.assignedOfficerId;

  const handleAssignToMe = async () => {
    try {
      await assignMutation.mutateAsync(grievance.id);
    } catch (e) {
      console.error(e);
      alert('Failed to assign grievance');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/officer/grievances/queue')} className="text-slate-400 hover:text-slate-900">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">{grievance.acknowledgementNumber}</h1>
              {grievance.priority === 'urgent' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">Urgent</span>}
            </div>
            <p className="text-sm text-slate-500 truncate max-w-xl">{grievance.title}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="text-right hidden md:block mr-4 border-r border-slate-200 pr-4">
             <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Internal Status</p>
             <p className="text-sm font-medium text-slate-900 capitalize">{grievance.internalStatus.replace(/-/g, ' ')}</p>
           </div>
           
           {isUnassigned ? (
             <button 
               onClick={handleAssignToMe}
               disabled={assignMutation.isPending}
               className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
             >
               {assignMutation.isPending ? 'Assigning...' : 'Assign to Me'}
             </button>
           ) : isAssignedToMe ? (
             <div className="flex gap-2">
                <button onClick={() => navigate(`/officer/grievances/${grievance.id}/requests`)} className="px-4 py-2 border border-slate-300 bg-white text-slate-700 text-sm font-medium rounded hover:bg-slate-50 transition-colors">
                  Request Clarification
                </button>
                <button onClick={() => navigate(`/officer/grievances/${grievance.id}/resolution`)} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors">
                  Propose Resolution
                </button>
             </div>
           ) : (
             <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded">
               Assigned to {grievance.assignedOfficerName}
             </span>
           )}
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side Navigation / Menu */}
        <div className="w-64 bg-slate-50 border-r border-slate-200 shrink-0 overflow-y-auto">
           <nav className="p-4 space-y-1">
             <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-4">Review Toolkit</div>
             <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg bg-blue-50 text-blue-700">
               Overview
             </button>
             <button onClick={() => navigate(`/officer/grievances/${grievance.id}/notes`)} className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100">
               Internal Notes
             </button>
             <button onClick={() => navigate(`/officer/grievances/${grievance.id}/requests`)} className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100">
               Clarifications
             </button>
             <button onClick={() => navigate(`/officer/grievances/${grievance.id}/resolution`)} className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100">
               Resolution Hub
             </button>
             <button onClick={() => navigate(`/officer/grievances/${grievance.id}/audit`)} className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100">
               Audit Log
             </button>
           </nav>
        </div>

        {/* Right Side Main Content */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
             
             {grievance.needsAttention && isAssignedToMe && (
               <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex gap-3">
                 <svg className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 <div>
                   <p className="font-bold">Attention Required</p>
                   <p className="text-sm mt-1">This grievance requires your immediate review. The SLA might be nearing breach or the citizen has responded.</p>
                 </div>
               </div>
             )}

             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                 <h2 className="font-bold text-slate-800">Grievance Details</h2>
                 <span className={`text-xs font-medium px-2 py-1 rounded bg-${GrievancePublicStatusConfig[grievance.publicStatus]?.color}-100 text-${GrievancePublicStatusConfig[grievance.publicStatus]?.color}-800`}>
                    Public: {GrievancePublicStatusConfig[grievance.publicStatus]?.label}
                 </span>
               </div>
               <div className="p-6">
                 <h3 className="text-lg font-semibold text-slate-900 mb-2">{grievance.title}</h3>
                 <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6 text-sm text-slate-700 whitespace-pre-wrap">
                   {grievance.description}
                 </div>

                 <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                   <div>
                     <p className="text-slate-500 mb-1">Citizen Masked ID</p>
                     <p className="font-medium text-slate-900">{grievance.citizenNameMasked}</p>
                   </div>
                   <div>
                     <p className="text-slate-500 mb-1">Category</p>
                     <p className="font-medium text-slate-900 capitalize">{grievance.category.replace('-', ' ')}</p>
                   </div>
                   <div>
                     <p className="text-slate-500 mb-1">Department</p>
                     <p className="font-medium text-slate-900 capitalize">{grievance.departmentName}</p>
                   </div>
                   {grievance.linkedApplicationId && (
                     <div>
                       <p className="text-slate-500 mb-1">Linked Application</p>
                       <button onClick={() => navigate(`/officer/applications/${grievance.linkedApplicationId}`)} className="font-medium text-blue-600 hover:underline">{grievance.linkedApplicationId}</button>
                     </div>
                   )}
                 </div>
               </div>
             </div>

             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                 <h2 className="font-bold text-slate-800">SLA & Escalation</h2>
               </div>
               <div className="p-6 text-sm">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                   <div>
                     <p className="text-slate-500 mb-1">Submitted On</p>
                     <p className="font-medium text-slate-900">{new Date(grievance.submittedAt).toLocaleString()}</p>
                   </div>
                   <div>
                     <p className="text-slate-500 mb-1">SLA Due Date</p>
                     <p className={`font-medium ${new Date(grievance.slaDueAt) < new Date() ? 'text-red-600' : 'text-slate-900'}`}>{new Date(grievance.slaDueAt).toLocaleString()}</p>
                   </div>
                   <div>
                     <p className="text-slate-500 mb-1">Current Escalation Level</p>
                     <p className="font-medium text-slate-900 capitalize">{grievance.escalationLevel.replace('-', ' ')}</p>
                   </div>
                 </div>
               </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerGrievanceReviewPage;
