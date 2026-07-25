import React, { useState } from 'react';
import { FileText, Camera, Upload, Shield, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { DOCUMENT_TYPE_CONFIGS } from '../../data/documentTypeConfigs';

export function DocumentTypeSelector({ selectedType, onSelectType }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
      {DOCUMENT_TYPE_CONFIGS.map((cfg) => {
        const isSelected = selectedType === cfg.id;
        return (
          <button
            key={cfg.id}
            onClick={() => onSelectType(cfg.id)}
            type="button"
            className={`p-4 rounded-2xl border text-left transition-all ${
              isSelected
                ? 'bg-primary-container/20 border-primary ring-2 ring-primary/20'
                : 'bg-surface-container-lowest border-outline-variant hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-primary">{cfg.name}</span>
              {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
            </div>
            <span className="text-[10px] text-on-surface-variant block uppercase font-mono">{cfg.category}</span>
          </button>
        );
      })}
    </div>
  );
}

export function DocumentCaptureControl({ onSimulateCapture, onFileSelect }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-sm mb-6 text-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
        <Camera className="w-6 h-6" />
      </div>

      <h3 className="text-base font-bold text-primary mb-1">Capture or Upload Document</h3>
      <p className="text-xs text-on-surface-variant mb-6">
        Position your document flat under clear lighting before capturing.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSimulateCapture}
          type="button"
          className="flex-1 min-h-[48px] bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container inline-flex items-center justify-center gap-2 shadow-md"
        >
          <Camera className="w-4 h-4" />
          <span>Use Camera</span>
        </button>

        <label className="flex-1 min-h-[48px] border border-outline text-primary font-bold text-xs rounded-xl hover:bg-surface-container-low flex items-center justify-center gap-2 cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
          <input
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                onFileSelect(e.target.files[0]);
              }
            }}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}

export function CameraPermissionState({ onDismiss }) {
  return (
    <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl mb-6 text-xs flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
      <div>
        <h4 className="font-bold mb-1">Camera Permission Notice</h4>
        <p className="mb-2">
          Camera access requires user permission. If unavailable, please use the file upload option below.
        </p>
        <button
          onClick={onDismiss}
          type="button"
          className="text-amber-900 font-bold underline text-[11px]"
        >
          Use File Upload Instead
        </button>
      </div>
    </div>
  );
}

export function DocumentHistoryCard({ session, onView }) {
  return (
    <div className="p-3.5 bg-surface-container-lowest border border-outline-variant rounded-2xl flex items-center justify-between gap-3 mb-2">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div className="text-left">
          <span className="text-xs font-bold text-primary block">{session.documentTypeName}</span>
          <span className="text-[10px] text-on-surface-variant font-mono">{session.fileName}</span>
        </div>
      </div>

      <button
        onClick={() => onView(session.id)}
        type="button"
        className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs font-bold text-primary"
      >
        View
      </button>
    </div>
  );
}
