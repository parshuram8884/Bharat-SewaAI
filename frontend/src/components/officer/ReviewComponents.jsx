import React, { useState } from 'react';
import { useReviewChecklist, useSaveReviewChecklist, useAddInternalNote, useInternalNotes } from '../../hooks/useOfficerReviewQuery';
import { permissionService } from '../../services/permissionService';
import { officerAuthService } from '../../services/officerAuthService';

export const ReviewSectionNavigation = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: 'summary', label: 'Summary & Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'form', label: 'Application Form', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'documents', label: 'Documents & OCR', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { id: 'eligibility', label: 'Eligibility', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'notes', label: 'Internal Notes', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'decision', label: 'Decision Summary', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  ];

  return (
    <nav className="space-y-1">
      {sections.map(s => (
        <button
          key={s.id}
          onClick={() => onSectionChange(s.id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeSection === s.id 
            ? 'bg-blue-50 text-blue-700' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <svg className={`w-5 h-5 ${activeSection === s.id ? 'text-blue-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
          </svg>
          {s.label}
        </button>
      ))}
    </nav>
  );
};

export const ReviewChecklist = ({ applicationId, schemeId, readOnly = false }) => {
  const { data: checklistRes, isLoading } = useReviewChecklist(applicationId, schemeId);
  const saveChecklist = useSaveReviewChecklist();
  
  if (isLoading) return <div className="animate-pulse h-32 bg-slate-100 rounded"></div>;
  if (!checklistRes?.data) return null;

  const cl = checklistRes.data;
  const config = cl.config;

  const handleToggle = (checkId, val) => {
    if (readOnly) return;
    const newCompleted = { ...cl.completedChecks, [checkId]: val };
    saveChecklist.mutate({ id: applicationId, completedChecks: newCompleted, notes: cl.notes });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Mandatory Review Checklist</h3>
      {config.sections.map(section => (
        <div key={section.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h4 className="font-medium text-slate-900 mb-3">{section.label}</h4>
          <div className="space-y-3">
            {section.checks.map(check => (
              <div key={check.id} className="flex items-start justify-between gap-4 p-3 bg-white rounded border border-slate-200">
                <div className="text-sm font-medium text-slate-700">{check.label} {check.required && <span className="text-red-500">*</span>}</div>
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    disabled={readOnly}
                    onClick={() => handleToggle(check.id, 'yes')}
                    className={`px-3 py-1 text-xs font-medium rounded border ${cl.completedChecks[check.id] === 'yes' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                  >Yes</button>
                  <button 
                    disabled={readOnly}
                    onClick={() => handleToggle(check.id, 'no')}
                    className={`px-3 py-1 text-xs font-medium rounded border ${cl.completedChecks[check.id] === 'no' ? 'bg-red-100 border-red-200 text-red-700' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                  >No</button>
                  {check.type === 'yes-no-na' && (
                    <button 
                      disabled={readOnly}
                      onClick={() => handleToggle(check.id, 'na')}
                      className={`px-3 py-1 text-xs font-medium rounded border ${cl.completedChecks[check.id] === 'na' ? 'bg-slate-200 border-slate-300 text-slate-800' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                    >N/A</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const InternalNoteList = ({ applicationId }) => {
  const { data: res, isLoading } = useInternalNotes(applicationId);
  if (isLoading) return <div className="text-sm text-slate-500">Loading notes...</div>;
  const notes = res?.data || [];
  
  if (notes.length === 0) return <div className="p-4 text-sm text-slate-500 bg-slate-50 rounded italic">No internal notes have been added.</div>;

  return (
    <div className="space-y-4">
      {notes.map(note => (
        <div key={note.id} className="p-4 bg-yellow-50/50 border border-yellow-200 rounded-lg text-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-semibold text-slate-900">{note.authorName}</span>
              <span className="text-slate-500 ml-2">({note.authorRole.replace('-', ' ')})</span>
            </div>
            <span className="text-slate-400 text-xs">{new Date(note.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-slate-800 whitespace-pre-wrap">{note.content}</p>
          <div className="mt-2 text-xs font-medium text-yellow-700 bg-yellow-100 inline-block px-2 py-0.5 rounded">Category: {note.category}</div>
        </div>
      ))}
    </div>
  );
};

export const AddNoteForm = ({ applicationId }) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const addNote = useAddInternalNote();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    addNote.mutate({ id: applicationId, content, category, visibility: 'internal' }, {
      onSuccess: () => {
        setContent('');
        setCategory('general');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
      <h4 className="font-medium text-slate-900 mb-3">Add Internal Note</h4>
      <div className="space-y-3">
        <select 
          value={category} 
          onChange={e => setCategory(e.target.value)}
          className="block w-full text-sm border-slate-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="general">General</option>
          <option value="document">Document Issue</option>
          <option value="eligibility">Eligibility</option>
          <option value="risk">Risk Flag</option>
          <option value="decision">Decision Rational</option>
        </select>
        <textarea
          rows={3}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Type an internal note... (This will not be visible to the citizen)"
          className="block w-full text-sm border-slate-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
          required
        ></textarea>
        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={addNote.isPending || !content.trim()}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 disabled:opacity-50"
          >
            {addNote.isPending ? 'Saving...' : 'Add Note'}
          </button>
        </div>
      </div>
    </form>
  );
};
