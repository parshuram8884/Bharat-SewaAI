import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOfficerApplication } from '../../hooks/useOfficerReviewQuery';
import { useOfficerReviewUiStore } from '../../stores/officerReviewUiStore';
import { 
  ReviewSectionNavigation, 
  ReviewChecklist, 
  InternalNoteList, 
  AddNoteForm 
} from '../../components/officer/ReviewComponents';
import { DecisionSummaryCard, ApprovalFormDialog } from '../../components/officer/DecisionComponents';

const ApplicationReviewWorkspace = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { data: appRes, isLoading, error } = useOfficerApplication(applicationId);
  const { activeReviewSection, setActiveReviewSection } = useOfficerReviewUiStore();
  
  const [isApproveOpen, setIsApproveOpen] = useState(false);

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading workspace...</div>;
  if (error || !appRes?.success) return <div className="p-8 text-red-600">Failed to load application</div>;

  const app = appRes.data;

  const renderActiveSection = () => {
    switch (activeReviewSection) {
      case 'summary':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Application Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">ID:</span> <span className="font-medium">{app.id}</span></div>
                <div><span className="text-slate-500">Scheme:</span> <span className="font-medium">{app.schemeName}</span></div>
                <div><span className="text-slate-500">Citizen:</span> <span className="font-medium">{app.citizenNameMasked}</span></div>
                <div><span className="text-slate-500">Submitted:</span> <span className="font-medium">{new Date(app.submittedAt).toLocaleDateString()}</span></div>
                <div><span className="text-slate-500">Internal Status:</span> <span className="font-medium capitalize">{app.internalStatus}</span></div>
                <div><span className="text-slate-500">Public Status:</span> <span className="font-medium capitalize">{app.publicStatus}</span></div>
              </div>
            </div>
          </div>
        );
      case 'form':
        return (
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm min-h-[400px] flex items-center justify-center">
            <p className="text-slate-500 italic">Read-only form viewer would render citizen form data here.</p>
          </div>
        );
      case 'documents':
        return (
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center space-y-4">
             <p className="text-slate-500 italic">Document viewers and OCR mapping results render here.</p>
             <button className="px-4 py-2 bg-slate-100 border border-slate-300 rounded text-sm text-slate-700 hover:bg-slate-200">Request Document Replacement</button>
          </div>
        );
      case 'eligibility':
        return (
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
             <h3 className="text-lg font-semibold mb-4 border-b pb-2">Automated Eligibility Outcome</h3>
             <div className="p-4 bg-green-50 border border-green-200 rounded text-green-800 font-medium">
               Outcome: {app.eligibilityOutcome}
             </div>
             <p className="text-xs text-slate-500 mt-4">Note: This is an AI-assisted outcome and requires officer verification.</p>
          </div>
        );
      case 'notes':
        return (
          <div className="space-y-6">
            <InternalNoteList applicationId={app.id} />
            <AddNoteForm applicationId={app.id} />
          </div>
        );
      case 'decision':
        return (
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
             <ReviewChecklist applicationId={app.id} schemeId={app.schemeId} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      
      {/* Left Navigation */}
      <div className="w-full lg:w-64 shrink-0 bg-white border border-slate-200 rounded-xl shadow-sm p-4 h-max">
        <div className="mb-4 pb-4 border-b border-slate-100">
          <button onClick={() => navigate(-1)} className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-2">
            &larr; Back to Queue
          </button>
          <h2 className="font-bold text-slate-900 truncate" title={app.id}>{app.id}</h2>
        </div>
        <ReviewSectionNavigation 
          activeSection={activeReviewSection} 
          onSectionChange={setActiveReviewSection} 
        />
      </div>

      {/* Main Review Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="mb-6 flex justify-between items-end">
           <div>
             <h1 className="text-2xl font-bold text-slate-900 mb-1">Review Workspace</h1>
             <p className="text-slate-500 text-sm">{app.schemeName}</p>
           </div>
           <div className="text-sm text-slate-500">
             SLA: <span className="font-medium text-slate-900">Due {new Date(app.slaDueAt).toLocaleDateString()}</span>
           </div>
        </div>
        
        <div className="pb-8">
          {renderActiveSection()}
        </div>
      </div>

      {/* Right Action / Decision Sidebar */}
      <div className="w-full lg:w-80 shrink-0 space-y-4 h-max sticky top-0">
        <DecisionSummaryCard 
          application={app} 
          onRecommend={() => alert("Recommendation saved. Senior reviewer must finalize.")}
          onApprove={() => setIsApproveOpen(true)}
        />
      </div>

      {isApproveOpen && (
        <ApprovalFormDialog 
          application={app} 
          onClose={() => setIsApproveOpen(false)} 
        />
      )}
    </div>
  );
};

export default ApplicationReviewWorkspace;
