import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { ApplicationStepper } from '../../components/applications/ApplicationHeaderComponents';
import {
  ApplicationDeclarationCard,
  SubmissionConfirmDialog,
  SubmissionProgress,
  AcknowledgementCard,
  ApplicationReviewSkeleton,
  ApplicationTimeline
} from '../../components/applications/ApplicationReviewComponents';
import {
  useApplication,
  useSaveApplicationDeclaration,
  useSubmitApplication,
  useWithdrawApplication
} from '../../hooks/useApplicationQuery';
import { useApplicationUiStore } from '../../stores/applicationUiStore';

export function ApplicationDeclarationPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useApplication(applicationId);
  const saveDeclMutation = useSaveApplicationDeclaration();
  const { isSubmitDialogOpen, setIsSubmitDialogOpen } = useApplicationUiStore();

  const application = data?.data;
  const [declaration, setDeclaration] = useState({
    confirmed: false,
    applicantName: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (application?.declaration) {
      setDeclaration(application.declaration);
    }
  }, [application?.declaration]);

  const handleDeclarationChange = (updated) => {
    setDeclaration(updated);
    saveDeclMutation.mutate({ applicationId, declaration: updated });
  };

  const handleConfirmSubmit = () => {
    setIsSubmitDialogOpen(false);
    navigate(`/applications/${applicationId}/submitting`);
  };

  if (isLoading || !application) {
    return (
      <div className="p-6">
        <ApplicationReviewSkeleton />
      </div>
    );
  }

  const canSubmit = declaration.confirmed && declaration.applicantName.trim().length > 0;

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-4">
      <header className="max-w-4xl mx-auto flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/applications/${applicationId}/review`)}
            type="button"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-primary">Declaration & Consent</h1>
            <span className="text-[11px] text-on-surface-variant font-mono">App ID: {application.id}</span>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto">
        <ApplicationStepper currentStep={4} />
        <ApplicationDeclarationCard declaration={declaration} onChange={handleDeclarationChange} />
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-surface-container-lowest border-t border-outline-variant z-40 shadow-lg">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(`/applications/${applicationId}/review`)}
            type="button"
            className="min-h-[44px] px-4 py-2 border border-outline text-primary font-semibold text-xs rounded-xl hover:bg-surface-container-low"
          >
            Previous
          </button>
          <button
            onClick={() => setIsSubmitDialogOpen(true)}
            disabled={!canSubmit}
            type="button"
            className="min-h-[48px] px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl disabled:opacity-40 hover:bg-emerald-700 inline-flex items-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <span>Submit Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      <SubmissionConfirmDialog
        isOpen={isSubmitDialogOpen}
        onClose={() => setIsSubmitDialogOpen(false)}
        onConfirm={handleConfirmSubmit}
        schemeName={application.schemeName}
        appId={application.id}
      />
    </div>
  );
}

export function ApplicationSubmittingPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const submitMutation = useSubmitApplication();
  const [subStep, setSubStep] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setSubStep(2), 500);
    const timer2 = setTimeout(() => setSubStep(3), 1000);
    const timer3 = setTimeout(() => {
      setSubStep(4);
      submitMutation.mutate(applicationId, {
        onSuccess: () => navigate(`/applications/${applicationId}/success`)
      });
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [applicationId, navigate, submitMutation]);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <RefreshCw className="w-10 h-10 animate-spin text-primary" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-primary mb-2">Submitting Your Application...</h1>
      <p className="text-xs text-on-surface-variant max-w-xs mb-8">
        Please do not close this browser window while your demonstration submission is processing.
      </p>

      <SubmissionProgress step={subStep} />
    </div>
  );
}

export function ApplicationSuccessPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useApplication(applicationId);

  if (isLoading || !data?.data) {
    return (
      <div className="p-6">
        <ApplicationReviewSkeleton />
      </div>
    );
  }

  const application = data.data;
  const ack = application.acknowledgement || {
    ackNumber: `BSAI-APP-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    submissionTimestamp: new Date().toISOString(),
    disclaimer: 'This is a demonstration acknowledgement generated by Bharat Sewa AI.'
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 font-sans px-4 pt-6 text-center">
      <main className="max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 shadow-md">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">Submission Successful</span>
        <h1 className="text-2xl font-bold text-primary mb-2">Application Submitted!</h1>
        <p className="text-xs text-on-surface-variant mb-6">
          Your application for <strong>{application.schemeName}</strong> has been recorded.
        </p>

        <AcknowledgementCard ack={ack} application={application} />

        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.print()}
            type="button"
            className="w-full min-h-[48px] bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container shadow-md"
          >
            Print Acknowledgement Receipt
          </button>
          <button
            onClick={() => navigate(`/applications/${applicationId}`)}
            type="button"
            className="w-full min-h-[44px] border border-outline text-primary font-bold text-xs rounded-xl hover:bg-surface-container-low"
          >
            Track Application Status
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            type="button"
            className="w-full min-h-[44px] text-on-surface-variant font-semibold text-xs hover:underline"
          >
            Return to Citizen Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}

export function ApplicationDetailsPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useApplication(applicationId);
  const withdrawMutation = useWithdrawApplication();

  if (isLoading || !data?.data) {
    return (
      <div className="p-6">
        <ApplicationReviewSkeleton />
      </div>
    );
  }

  const app = data.data;
  const isSubmitted = app.status === 'submitted';

  const handleWithdraw = () => {
    if (window.confirm('Withdraw and delete this saved draft?')) {
      withdrawMutation.mutate(app.id, {
        onSuccess: () => navigate('/dashboard')
      });
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 font-sans px-4 pt-6 text-left">
      <main className="max-w-xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            type="button"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Application Tracking</span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-sm mb-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-mono font-bold text-on-surface-variant">{app.id}</span>
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${isSubmitted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
              {app.status}
            </span>
          </div>

          <h1 className="text-xl font-bold text-primary mb-1">{app.schemeName}</h1>
          <p className="text-xs text-on-surface-variant mb-4">
            {isSubmitted ? `Submitted on ${new Date(app.submittedAt).toLocaleDateString()}` : `Draft updated ${new Date(app.updatedAt).toLocaleDateString()}`}
          </p>

          {!isSubmitted && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/applications/${app.id}/form`)}
                type="button"
                className="flex-1 min-h-[44px] bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container"
              >
                Resume Draft
              </button>
              <button
                onClick={handleWithdraw}
                type="button"
                className="px-4 border border-red-300 text-red-700 font-bold text-xs rounded-xl hover:bg-red-50"
              >
                Withdraw Draft
              </button>
            </div>
          )}

          {isSubmitted && (
            <button
              onClick={() => navigate(`/applications/${app.id}/success`)}
              type="button"
              className="w-full min-h-[44px] border border-outline text-primary font-bold text-xs rounded-xl hover:bg-surface-container-low flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>View Acknowledgement Receipt</span>
            </button>
          )}
        </div>

        <ApplicationTimeline submittedAt={app.submittedAt} />
      </main>
    </div>
  );
}

export function ApplicationEditGuardPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { data } = useApplication(applicationId);

  const app = data?.data;

  useEffect(() => {
    if (app) {
      if (app.status === 'submitted') {
        alert('Submitted applications cannot be edited in this demonstration flow.');
        navigate(`/applications/${applicationId}`);
      } else {
        navigate(`/applications/${applicationId}/form`);
      }
    }
  }, [app, applicationId, navigate]);

  return (
    <div className="p-8 text-center max-w-md mx-auto my-12">
      <p className="text-xs text-on-surface-variant">Checking application edit permissions...</p>
    </div>
  );
}
