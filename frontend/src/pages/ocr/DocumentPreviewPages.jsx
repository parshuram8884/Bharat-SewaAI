import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, FileText, RefreshCw, CheckCircle2 } from 'lucide-react';
import { DocumentPreviewToolbar, DocumentQualitySummary } from '../../components/ocr/DocumentPreviewComponents';
import { useDocumentSession, useRunQualityCheck } from '../../hooks/useOcrQuery';
import { useDocumentOcrUiStore } from '../../stores/documentOcrUiStore';

export function DocumentPreviewPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useDocumentSession(documentId);
  const { previewZoom, previewRotation, setPreviewZoom, setPreviewRotation } = useDocumentOcrUiStore();

  if (isLoading || !data?.data) {
    return <div className="p-8 text-center text-xs text-on-surface-variant">Loading preview...</div>;
  }

  const session = data.data;

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 font-sans px-4 pt-6 text-left">
      <main className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={() => navigate('/documents/scan')}
            type="button"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Document Preview</span>
        </div>

        <DocumentPreviewToolbar
          zoom={previewZoom}
          rotation={previewRotation}
          onRotate={() => setPreviewRotation(previewRotation + 90)}
          onZoomIn={() => setPreviewZoom(Math.min(previewZoom + 25, 200))}
          onZoomOut={() => setPreviewZoom(Math.max(previewZoom - 25, 50))}
          onReplace={() => navigate(`/documents/scan/${session.documentType}`)}
        />

        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-sm mb-6 text-center overflow-hidden">
          <div
            className="w-full h-64 bg-surface-container-low rounded-2xl flex flex-col items-center justify-center transition-transform duration-300 mx-auto"
            style={{ transform: `rotate(${previewRotation}deg) scale(${previewZoom / 100})` }}
          >
            <FileText className="w-16 h-16 text-primary mb-2" />
            <span className="text-xs font-bold text-primary">{session.documentTypeName}</span>
            <span className="text-[10px] text-on-surface-variant font-mono">{session.fileName}</span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/documents/${documentId}/quality-check`)}
          type="button"
          className="w-full min-h-[48px] bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container inline-flex items-center justify-center gap-2 shadow-md"
        >
          <span>Continue to Quality Check</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </main>
    </div>
  );
}

export function DocumentQualityCheckPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useDocumentSession(documentId);
  const runQualityMutation = useRunQualityCheck();

  const session = data?.data;

  const handleRunCheck = () => {
    runQualityMutation.mutate(documentId);
  };

  if (isLoading || !session) {
    return <div className="p-8 text-center text-xs text-on-surface-variant">Loading quality check...</div>;
  }

  const quality = session.qualityResult;
  const isChecked = Boolean(quality);

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 font-sans px-4 pt-6 text-left">
      <main className="max-w-xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={() => navigate(`/documents/${documentId}/preview`)}
            type="button"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Quality Assessment</span>
        </div>

        {!isChecked ? (
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-sm text-center mb-6">
            <h1 className="text-xl font-bold text-primary mb-2">Check Document Quality</h1>
            <p className="text-xs text-on-surface-variant mb-6">
              Analyzes image clarity, lighting exposure, crop boundaries, and resolution.
            </p>
            <button
              onClick={handleRunCheck}
              disabled={runQualityMutation.isPending}
              type="button"
              className="w-full min-h-[48px] bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container inline-flex items-center justify-center gap-2 shadow-md"
            >
              <RefreshCw className={`w-4 h-4 ${runQualityMutation.isPending ? 'animate-spin' : ''}`} />
              <span>{runQualityMutation.isPending ? 'Checking Quality...' : 'Run Quality Assessment'}</span>
            </button>
          </div>
        ) : (
          <div>
            <DocumentQualitySummary quality={quality} />

            {quality.canContinue ? (
              <button
                onClick={() => navigate(`/documents/${documentId}/extracting`)}
                type="button"
                className="w-full min-h-[48px] bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container inline-flex items-center justify-center gap-2 shadow-md"
              >
                <span>Start OCR Extraction</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/documents/scan/${session.documentType}`)}
                  type="button"
                  className="w-full min-h-[48px] bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container"
                >
                  Retake / Replace Document
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
