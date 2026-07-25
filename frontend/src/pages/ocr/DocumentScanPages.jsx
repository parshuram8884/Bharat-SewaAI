import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Camera, Upload, Shield } from 'lucide-react';
import { DocumentTypeSelector, DocumentHistoryCard, CameraPermissionState } from '../../components/ocr/DocumentScanComponents';
import { DocumentPrivacyNotice } from '../../components/ocr/DocumentPreviewComponents';
import { useDocumentHistory, useCreateDocumentSession } from '../../hooks/useOcrQuery';

export function DocumentScanHomePage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('income-certificate');
  const { data: historyData } = useDocumentHistory();
  const createSessionMutation = useCreateDocumentSession();

  const history = historyData?.data || [];

  const handleStartScan = () => {
    navigate(`/documents/scan/${selectedType}`);
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 font-sans px-4 pt-6 text-left">
      <main className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Document Scan Centre</span>
        </div>

        <DocumentPrivacyNotice />

        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-sm mb-6">
          <h1 className="text-xl font-bold text-primary mb-1">Select Document Type to Scan</h1>
          <p className="text-xs text-on-surface-variant mb-6">
            Choose the type of government document you want to extract and map to your application.
          </p>

          <DocumentTypeSelector selectedType={selectedType} onSelectType={setSelectedType} />

          <button
            onClick={handleStartScan}
            type="button"
            className="w-full min-h-[48px] bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container inline-flex items-center justify-center gap-2 shadow-md"
          >
            <span>Proceed to Capture</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {history.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Recently Scanned Documents</h2>
            {history.slice(0, 3).map((sess) => (
              <DocumentHistoryCard
                key={sess.id}
                session={sess}
                onView={(id) => navigate(`/documents/${id}/extraction-review`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export function DocumentCapturePage() {
  const { documentType } = useParams();
  const navigate = useNavigate();
  const createSessionMutation = useCreateDocumentSession();
  const [showPermissionNotice, setShowPermissionNotice] = useState(false);

  const handleSimulateCapture = () => {
    createSessionMutation.mutate(
      { documentType, metadata: { source: 'Camera Capture' } },
      {
        onSuccess: (res) => {
          if (res?.data?.id) {
            navigate(`/documents/${res.data.id}/preview`);
          }
        }
      }
    );
  };

  const handleFileSelect = (file) => {
    createSessionMutation.mutate(
      { documentType, metadata: { fileName: file.name, fileSizeMb: Number((file.size / (1024 * 1024)).toFixed(2)) } },
      {
        onSuccess: (res) => {
          if (res?.data?.id) {
            navigate(`/documents/${res.data.id}/preview`);
          }
        }
      }
    );
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 font-sans px-4 pt-6 text-left">
      <main className="max-w-xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={() => navigate('/documents/scan')}
            type="button"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Document Capture</span>
        </div>

        {showPermissionNotice && (
          <CameraPermissionState onDismiss={() => setShowPermissionNotice(false)} />
        )}

        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-sm mb-6 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Camera className="w-6 h-6" />
          </div>

          <h1 className="text-xl font-bold text-primary mb-1">Capture or Upload Document</h1>
          <p className="text-xs text-on-surface-variant mb-6">
            Accepted formats: JPG, PNG, PDF (Max 8MB). Ensure all details are clearly legible.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleSimulateCapture}
              type="button"
              className="w-full min-h-[48px] bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container inline-flex items-center justify-center gap-2 shadow-md"
            >
              <Camera className="w-4 h-4" />
              <span>Use Camera</span>
            </button>

            <label className="w-full min-h-[48px] border border-outline text-primary font-bold text-xs rounded-xl hover:bg-surface-container-low flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Upload File from Device</span>
              <input
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                className="sr-only"
              />
            </label>
          </div>
        </div>
      </main>
    </div>
  );
}
