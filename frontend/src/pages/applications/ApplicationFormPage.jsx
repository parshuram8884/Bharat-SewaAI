import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { ApplicationStepper, AutosaveStatus, SaveAndExitDialog } from '../../components/applications/ApplicationHeaderComponents';
import DynamicApplicationField from '../../components/applications/DynamicApplicationField';
import { ApplicationFormSkeleton } from '../../components/applications/ApplicationReviewComponents';
import { useApplication, useUpdateApplicationForm } from '../../hooks/useApplicationQuery';
import { SCHEME_FORM_SCHEMAS } from '../../data/applicationFormSchemas';
import { useApplicationUiStore } from '../../stores/applicationUiStore';

export default function ApplicationFormPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useApplication(applicationId);
  const updateFormMutation = useUpdateApplicationForm();
  const { isSaveAndExitDialogOpen, setIsSaveAndExitDialogOpen } = useApplicationUiStore();

  const [formData, setFormData] = useState({});
  const [saveStatus, setSaveStatus] = useState('saved');

  const application = data?.data;

  useEffect(() => {
    if (application?.formData) {
      setFormData(application.formData);
    }
  }, [application?.formData]);

  const schema = SCHEME_FORM_SCHEMAS[application?.schemeId] || SCHEME_FORM_SCHEMAS['pm-kisan'];

  const handleFieldChange = (fieldId, val) => {
    const updated = { ...formData, [fieldId]: val };
    setFormData(updated);
    setSaveStatus('saving');

    // Debounced autosave
    const timer = setTimeout(() => {
      updateFormMutation.mutate(
        { applicationId, formData: updated },
        {
          onSuccess: () => setSaveStatus('saved'),
          onError: () => setSaveStatus('error')
        }
      );
    }, 600);

    return () => clearTimeout(timer);
  };

  const handleNext = () => {
    updateFormMutation.mutate(
      { applicationId, formData },
      {
        onSuccess: () => navigate(`/applications/${applicationId}/documents`)
      }
    );
  };

  if (isLoading || !application) {
    return (
      <div className="p-6">
        <ApplicationFormSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans px-4 pt-4">
      {/* Sticky Header */}
      <header className="max-w-4xl mx-auto flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSaveAndExitDialogOpen(true)}
            type="button"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-primary">{application.schemeName}</h1>
            <span className="text-[11px] text-on-surface-variant font-mono">App ID: {application.id}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AutosaveStatus status={saveStatus} lastSavedAt={application.updatedAt} />
          <button
            onClick={() => setIsSaveAndExitDialogOpen(true)}
            type="button"
            className="px-3 py-1.5 border border-outline text-primary font-bold text-xs rounded-xl hover:bg-surface-container-low min-h-[38px] flex items-center gap-1"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Exit</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto">
        <ApplicationStepper currentStep={1} />

        <div className="space-y-6">
          {schema.sections.map((sec) => (
            <div key={sec.id} className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-sm text-left">
              <h2 className="text-base font-bold text-primary mb-1">{sec.title}</h2>
              <p className="text-xs text-on-surface-variant mb-6">{sec.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sec.fields.map((field) => (
                  <DynamicApplicationField
                    key={field.id}
                    field={field}
                    value={formData[field.id]}
                    onChange={(val) => handleFieldChange(field.id, val)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Sticky Bottom Actions */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-surface-container-lowest border-t border-outline-variant z-40 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => setIsSaveAndExitDialogOpen(true)}
            type="button"
            className="min-h-[44px] px-4 py-2 border border-outline text-primary font-semibold text-xs rounded-xl hover:bg-surface-container-low"
          >
            Save as Draft
          </button>
          <button
            onClick={handleNext}
            type="button"
            className="min-h-[48px] px-6 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container inline-flex items-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <span>Continue to Documents</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      <SaveAndExitDialog
        isOpen={isSaveAndExitDialogOpen}
        onClose={() => setIsSaveAndExitDialogOpen(false)}
        onConfirm={() => {
          setIsSaveAndExitDialogOpen(false);
          navigate('/dashboard');
        }}
      />
    </div>
  );
}
