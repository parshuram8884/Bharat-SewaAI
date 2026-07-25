import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, Info, CheckCircle2, ShieldAlert } from 'lucide-react';
import { 
  useApplicationTimeline, 
  useApplicationStatus, 
  useApplicationRemarks,
  useApplicationHistory,
  useApplicationTrackingSummary,
  useWithdrawApplication
} from '../../hooks/useApplicationTrackingQuery';
import { TimelineItem } from '../../components/tracking/TrackingComponents';
import { OfficerRemarkCard } from '../../components/tracking/TrackingCards';
import { ApplicationHistoryCard, ApplicationDownloadCard } from '../../components/tracking/TrackingMisc';
import { TrackingSkeletons, StatusBadge } from '../../components/tracking/TrackingSkeletons';

export function ApplicationTimelinePage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useApplicationTimeline(applicationId);

  if (isLoading) return <div className="p-6 max-w-xl mx-auto"><TrackingSkeletons.Timeline /></div>;

  const timeline = data?.data || [];

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-6">
      <main className="max-w-xl mx-auto">
        <header className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-xl font-bold text-primary">Application Timeline</h1>
        </header>

        {timeline.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No timeline events recorded yet.</p>
        ) : (
          <div className="pt-2">
            {timeline.map((item, idx) => (
              <TimelineItem key={item.id} item={item} isLast={idx === timeline.length - 1} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export function ApplicationStatusPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useApplicationStatus(applicationId);

  if (isLoading) return <div className="p-6 max-w-xl mx-auto"><TrackingSkeletons.Card /></div>;

  const statusConfig = data?.data;

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-6">
      <main className="max-w-xl mx-auto">
        <header className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-xl font-bold text-primary">Status Details</h1>
        </header>

        {statusConfig ? (
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-sm">
            <StatusBadge statusKey={statusConfig.key} className="mb-4 scale-110 origin-left" />
            <h2 className="text-lg font-bold text-on-surface mb-2">{statusConfig.label}</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">{statusConfig.description}</p>
            
            <div className="p-4 bg-surface-container-low rounded-xl">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Next Expected Step</span>
              <p className="text-sm font-semibold text-primary">{statusConfig.nextExpectedStep}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant">Status information unavailable.</p>
        )}
      </main>
    </div>
  );
}

export function ApplicationRemarksPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useApplicationRemarks(applicationId);

  if (isLoading) return <div className="p-6 max-w-xl mx-auto"><TrackingSkeletons.Timeline /></div>;

  const remarks = data?.data || [];

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-6">
      <main className="max-w-xl mx-auto">
        <header className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-xl font-bold text-primary">Officer Remarks</h1>
        </header>

        {remarks.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-lowest border border-outline-variant rounded-2xl">
            <p className="text-sm text-on-surface-variant">No remarks or notes from officers yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {remarks.map(r => <OfficerRemarkCard key={r.id} remark={r} />)}
          </div>
        )}
      </main>
    </div>
  );
}

export function ApplicationHistoryPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useApplicationHistory(applicationId);

  if (isLoading) return <div className="p-6 max-w-xl mx-auto"><TrackingSkeletons.Timeline /></div>;

  const history = data?.data || [];

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-6">
      <main className="max-w-xl mx-auto">
        <header className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-xl font-bold text-primary">System History Log</h1>
        </header>

        {history.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No history events recorded yet.</p>
        ) : (
          <div className="pt-2">
            {history.map((item) => (
              <ApplicationHistoryCard key={item.id} historyItem={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export function ApplicationDownloadPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-6">
      <main className="max-w-xl mx-auto">
        <header className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-xl font-bold text-primary">Downloads & Receipts</h1>
        </header>

        <div className="p-4 bg-amber-50 text-amber-900 rounded-xl text-xs mb-6 border border-amber-200">
          <strong>Notice:</strong> These are demonstration documents generated by Bharat Sewa AI. They are not official government receipts.
        </div>

        <div className="space-y-4">
          <ApplicationDownloadCard 
            title="Acknowledgement Receipt" 
            description="Proof of submission containing application number and date."
            onDownload={() => window.print()} 
          />
          <ApplicationDownloadCard 
            title="Application Summary" 
            description="Complete PDF summary of submitted form fields and documents."
            onDownload={() => window.print()} 
          />
          <ApplicationDownloadCard 
            title="Timeline Export" 
            description="Chronological record of status changes and events."
            onDownload={() => window.print()} 
          />
        </div>
      </main>
    </div>
  );
}

export function ApplicationWithdrawPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { data } = useApplicationTrackingSummary(applicationId);
  const withdrawMutation = useWithdrawApplication();
  
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const app = data?.data;

  // Withdrawal rules check
  const isTerminal = ['approved', 'rejected', 'closed', 'withdrawn', 'cancelled'].includes(app?.status);
  
  const handleWithdraw = () => {
    if (window.confirm('Are you absolutely sure you want to withdraw this application? This action cannot be undone.')) {
      withdrawMutation.mutate({ applicationId, reason }, {
        onSuccess: () => navigate('/applications')
      });
    }
  };

  if (!app) return null;

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-6">
      <main className="max-w-xl mx-auto">
        <header className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-xl font-bold text-red-600">Withdraw Application</h1>
        </header>

        {isTerminal ? (
          <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-2xl text-center">
            <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-on-surface mb-2">Withdrawal Not Allowed</h2>
            <p className="text-sm text-on-surface-variant">
              Applications with status <strong>{app.status}</strong> cannot be withdrawn.
            </p>
          </div>
        ) : (
          <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-2xl">
            <h2 className="text-base font-bold text-on-surface mb-4">Request Withdrawal</h2>
            <p className="text-xs text-on-surface-variant mb-6">
              Withdrawing an application will permanently halt its processing. You may need to submit a new application if you change your mind.
            </p>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-on-surface mb-2">Reason for Withdrawal <span className="text-red-500">*</span></label>
              <textarea 
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 bg-surface-container-low border border-outline rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                placeholder="Briefly explain why you are withdrawing this application..."
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer mb-8">
              <input 
                type="checkbox" 
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 mt-0.5"
              />
              <span className="text-xs font-medium text-on-surface leading-relaxed">
                I understand that withdrawing this application is permanent and cannot be reversed.
              </span>
            </label>

            <button
              onClick={handleWithdraw}
              disabled={!confirmed || !reason.trim() || withdrawMutation.isPending}
              className="w-full min-h-[48px] bg-red-600 text-white font-bold text-sm rounded-xl disabled:opacity-50 hover:bg-red-700 transition-colors"
            >
              {withdrawMutation.isPending ? 'Processing...' : 'Confirm Withdrawal'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
