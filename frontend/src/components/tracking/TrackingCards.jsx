import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, FileWarning, HelpCircle, ArrowRight, Paperclip, AlertCircle, Clock } from 'lucide-react';

export const OfficerRemarkCard = ({ remark }) => {
  return (
    <div className="bg-surface-container-low border-l-4 border-l-amber-500 p-4 rounded-r-xl">
      <div className="flex items-start gap-3">
        <MessageSquare className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <div className="flex items-center justify-between gap-4 mb-1">
            <span className="text-xs font-bold text-on-surface">Officer Remark</span>
            <span className="text-[10px] text-on-surface-variant">
              {new Date(remark.timestamp).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            {remark.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export const DocumentRequestCard = ({ request, applicationId }) => {
  const navigate = useNavigate();
  const isOverdue = new Date(request.deadline) < new Date();
  const isClosed = request.status === 'submitted' || request.status === 'accepted';

  return (
    <div className={`p-4 rounded-xl border ${isClosed ? 'bg-surface-container border-outline-variant opacity-75' : 'bg-red-50/50 border-red-200'}`}>
      <div className="flex items-start gap-3">
        <FileWarning className={`w-5 h-5 shrink-0 mt-0.5 ${isClosed ? 'text-on-surface-variant' : 'text-red-500'}`} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h4 className={`text-sm font-bold ${isClosed ? 'text-on-surface' : 'text-red-900'}`}>{request.title}</h4>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              isClosed ? 'bg-emerald-100 text-emerald-800' : 
              isOverdue ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isClosed ? 'Responded' : isOverdue ? 'Overdue' : 'Action Required'}
            </span>
          </div>
          
          <p className={`text-xs leading-relaxed mb-4 ${isClosed ? 'text-on-surface-variant' : 'text-red-800'}`}>
            {request.description}
          </p>

          {!isClosed && (
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-red-700">
                <Clock className="w-4 h-4" />
                <span>Due by {new Date(request.deadline).toLocaleDateString()}</span>
              </div>
              
              <button
                onClick={() => navigate(`/applications/${applicationId}/documents/respond?req=${request.id}`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Upload Document
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ClarificationCard = ({ clarification, applicationId }) => {
  const navigate = useNavigate();
  const isClosed = clarification.status === 'submitted' || clarification.status === 'reviewed';

  return (
    <div className="p-4 rounded-xl border bg-amber-50/50 border-amber-200">
      <div className="flex items-start gap-3">
        <HelpCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isClosed ? 'text-amber-700' : 'text-amber-600'}`} />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-amber-900 mb-1">Clarification Required</h4>
          <p className="text-xs text-amber-800 font-medium mb-3">"{clarification.question}"</p>
          
          {isClosed ? (
            <div className="bg-amber-100/50 p-3 rounded-lg mt-3 border border-amber-200/50">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1 block">Your Response</span>
              <p className="text-xs text-amber-900">{clarification.responseText}</p>
            </div>
          ) : (
            <div className="flex justify-end mt-4">
              <button
                onClick={() => navigate(`/applications/${applicationId}/clarification/respond?req=${clarification.id}`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Provide Clarification
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
