import React from 'react';
import { Clock, Download, FileText, Bell } from 'lucide-react';

export const EstimatedProcessingCard = ({ statusConfig }) => {
  if (!statusConfig || statusConfig.isTerminal) return null;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Clock className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-0.5">Estimated Duration</h4>
        <p className="text-sm font-semibold text-primary">{statusConfig.estimatedDuration}</p>
      </div>
    </div>
  );
};

export const ApplicationHistoryCard = ({ historyItem }) => {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-surface-container-high border-2 border-outline-variant mt-1.5" />
        <div className="w-0.5 flex-1 bg-surface-container-low my-1" />
      </div>
      <div className="flex-1 pb-6">
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
          {new Date(historyItem.timestamp).toLocaleString()}
        </span>
        <p className="text-sm text-on-surface leading-relaxed">
          {historyItem.description}
        </p>
      </div>
    </div>
  );
};

export const ApplicationDownloadCard = ({ title, description, onDownload }) => {
  return (
    <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface-variant flex items-center justify-center shrink-0 mt-0.5">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-on-surface">{title}</h4>
          <p className="text-xs text-on-surface-variant">{description}</p>
        </div>
      </div>
      <button
        onClick={onDownload}
        className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center text-primary shrink-0 transition-colors"
        aria-label={`Download ${title}`}
      >
        <Download className="w-5 h-5" />
      </button>
    </div>
  );
};

export const NotificationSummaryCard = ({ count, onClick }) => {
  if (count === 0) return null;
  
  return (
    <button 
      onClick={onClick}
      className="w-full p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between hover:bg-primary/10 transition-colors text-left"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Bell className="w-5 h-5 text-primary" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-primary">You have {count} new {count === 1 ? 'notification' : 'notifications'}</h4>
          <p className="text-xs text-primary/80">Tap to view updates regarding your application.</p>
        </div>
      </div>
    </button>
  );
};
