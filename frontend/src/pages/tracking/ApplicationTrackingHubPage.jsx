import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Download, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react';
import { 
  useApplicationTrackingSummary, 
  useDocumentRequests, 
  useClarificationRequests 
} from '../../hooks/useApplicationTrackingQuery';
import { StatusBadge, TrackingSkeletons } from '../../components/tracking/TrackingSkeletons';
import { StatusProgress } from '../../components/tracking/TrackingComponents';
import { DocumentRequestCard, ClarificationCard } from '../../components/tracking/TrackingCards';
import { EstimatedProcessingCard } from '../../components/tracking/TrackingMisc';

export function ApplicationTrackingHubPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  
  const { data: summaryData, isLoading } = useApplicationTrackingSummary(applicationId);
  const { data: docRequestsData } = useDocumentRequests(applicationId);
  const { data: clarifRequestsData } = useClarificationRequests(applicationId);

  if (isLoading || !summaryData?.data) {
    return (
      <div className="p-6 max-w-xl mx-auto mt-6">
        <TrackingSkeletons.Timeline />
      </div>
    );
  }

  const app = summaryData.data;
  const docRequests = docRequestsData?.data || [];
  const clarifRequests = clarifRequestsData?.data || [];

  const activeDocRequests = docRequests.filter(r => r.status !== 'submitted' && r.status !== 'accepted');
  const activeClarifRequests = clarifRequests.filter(r => r.status !== 'submitted' && r.status !== 'reviewed');

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-6 text-left">
      <main className="max-w-xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/applications')}
              type="button"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[11px] font-mono font-bold text-on-surface-variant uppercase">{app.id}</span>
              <h1 className="text-lg font-bold text-primary">{app.schemeName}</h1>
            </div>
          </div>
          <button
            onClick={() => navigate(`/applications/${applicationId}/download`)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-low text-primary"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>

        {/* Status Card */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant block mb-1">Current Status</span>
              <StatusBadge statusKey={app.status} />
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant block mb-1">Updated</span>
              <span className="text-xs font-semibold text-on-surface flex items-center gap-1 justify-end">
                <Clock className="w-3.5 h-3.5" />
                {new Date(app.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <StatusProgress currentStatus={app.status} />
        </div>

        {/* Action Required Section */}
        {(activeDocRequests.length > 0 || activeClarifRequests.length > 0) && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" /> Action Required
            </h3>
            {activeDocRequests.map(req => (
              <DocumentRequestCard key={req.id} request={req} applicationId={applicationId} />
            ))}
            {activeClarifRequests.map(req => (
              <ClarificationCard key={req.id} clarification={req} applicationId={applicationId} />
            ))}
          </div>
        )}

        {/* Navigation Menu */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <button onClick={() => navigate(`/applications/${applicationId}/timeline`)} className="w-full p-4 flex items-center justify-between hover:bg-surface-container-low border-b border-outline-variant transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center"><Clock className="w-4 h-4" /></div>
              <span className="text-sm font-bold text-on-surface">Application Timeline</span>
            </div>
            <ChevronRight className="w-5 h-5 text-on-surface-variant" />
          </button>
          
          <button onClick={() => navigate(`/applications/${applicationId}/status`)} className="w-full p-4 flex items-center justify-between hover:bg-surface-container-low border-b border-outline-variant transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center"><AlertCircle className="w-4 h-4" /></div>
              <span className="text-sm font-bold text-on-surface">Status Details & Next Steps</span>
            </div>
            <ChevronRight className="w-5 h-5 text-on-surface-variant" />
          </button>
          
          <button onClick={() => navigate(`/applications/${applicationId}/remarks`)} className="w-full p-4 flex items-center justify-between hover:bg-surface-container-low border-b border-outline-variant transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center"><MessageSquare className="w-4 h-4" /></div>
              <span className="text-sm font-bold text-on-surface">Officer Remarks & Notes</span>
            </div>
            <ChevronRight className="w-5 h-5 text-on-surface-variant" />
          </button>
          
          <button onClick={() => navigate(`/applications/${applicationId}/history`)} className="w-full p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-500/10 text-neutral-600 flex items-center justify-center"><Clock className="w-4 h-4" /></div>
              <span className="text-sm font-bold text-on-surface">System History Log</span>
            </div>
            <ChevronRight className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Withdrawal Section */}
        <div className="pt-4 pb-8 flex justify-center">
          <button 
            onClick={() => navigate(`/applications/${applicationId}/withdraw`)}
            className="text-xs font-semibold text-red-600 hover:underline"
          >
            Withdraw Application
          </button>
        </div>

      </main>
    </div>
  );
}
