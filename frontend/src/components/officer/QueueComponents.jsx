import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApplicationQueue } from '../../hooks/useOfficerReviewQuery';
import { officerAuthService } from '../../services/officerAuthService';

const StatusBadge = ({ status }) => {
  const map = {
    'queued': 'bg-slate-100 text-slate-700 border-slate-200',
    'assigned': 'bg-blue-50 text-blue-700 border-blue-200',
    'review-started': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'document-review': 'bg-purple-50 text-purple-700 border-purple-200',
    'eligibility-review': 'bg-violet-50 text-violet-700 border-violet-200',
    'clarification-pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'document-response-pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'field-verification-pending': 'bg-orange-50 text-orange-700 border-orange-200',
    'recommendation-submitted': 'bg-teal-50 text-teal-700 border-teal-200',
    'decision-pending': 'bg-teal-50 text-teal-700 border-teal-200',
    'approved': 'bg-green-50 text-green-700 border-green-200',
    'rejected': 'bg-red-50 text-red-700 border-red-200',
    'returned-for-correction': 'bg-rose-50 text-rose-700 border-rose-200',
    'escalated': 'bg-red-50 text-red-700 border-red-200',
    'closed': 'bg-slate-100 text-slate-700 border-slate-200',
  };
  const color = map[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${color}`}>
      {status.replace(/-/g, ' ')}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const map = {
    low: 'bg-slate-100 text-slate-600',
    normal: 'bg-blue-50 text-blue-600',
    high: 'bg-orange-50 text-orange-600',
    urgent: 'bg-red-50 text-red-600'
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${map[priority] || map.normal}`}>
      {priority}
    </span>
  );
};

export const QueueTable = ({ applications, onAssign }) => {
  const user = officerAuthService.getCurrentUser();
  const canAssign = user && (user.role === 'department-admin' || user.role === 'senior-reviewer' || user.role === 'reviewer');

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-slate-900">No applications found</h3>
        <p className="mt-1 text-sm text-slate-500">No results match the current filters or queue type.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Application ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Scheme / Applicant</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned To</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {applications.map(app => (
            <tr key={app.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                <Link to={`/officer/applications/${app.id}`} className="hover:underline">{app.id}</Link>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-slate-900 truncate max-w-xs" title={app.schemeName}>{app.schemeName}</div>
                <div className="text-sm text-slate-500">{app.citizenNameMasked}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1 items-start">
                  <StatusBadge status={app.internalStatus} />
                  {app.needsAttention && <span className="text-xs font-medium text-red-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> Needs Attention</span>}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <PriorityBadge priority={app.priority} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {app.assignedOfficerName || <span className="text-slate-400 italic">Unassigned</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {app.assignedOfficerId === user?.id ? (
                  <Link to={`/officer/applications/${app.id}/review`} className="text-blue-600 hover:text-blue-900">Review</Link>
                ) : !app.assignedOfficerId && canAssign ? (
                  <button onClick={() => onAssign(app.id, user.id)} className="text-blue-600 hover:text-blue-900">Self-Assign</button>
                ) : (
                  <Link to={`/officer/applications/${app.id}`} className="text-slate-600 hover:text-slate-900">View</Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
