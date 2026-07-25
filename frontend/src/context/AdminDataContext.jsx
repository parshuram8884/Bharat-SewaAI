import React, { createContext, useContext, useState } from 'react';
import {
  initialStats,
  initialCitizens,
  initialApplications,
  initialSchemes,
  initialComplaints,
  initialNotifications,
  initialAuditLogs,
  adminRolesList
} from '../mock/adminMockData';

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {
  const [stats, setStats] = useState(initialStats);
  const [citizens, setCitizens] = useState(initialCitizens);
  const [applications, setApplications] = useState(initialApplications);
  const [schemes, setSchemes] = useState(initialSchemes);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [roles, setRoles] = useState(adminRolesList);

  const addAuditLog = (action, target, details) => {
    const newLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      adminName: 'Tejas Mail (Super Admin)',
      action,
      target,
      ipAddress: '127.0.0.1 (Local Simulation)',
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Application Actions
  const approveApplication = (appId, reviewerName = 'Tejas Mail', noteText = '') => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const newNotes = noteText
          ? [...app.notes, { id: `N-${Date.now()}`, author: reviewerName, date: 'Just now', text: noteText }]
          : app.notes;
        const newTimeline = [
          ...app.timeline,
          { date: 'Just now', action: `Application Approved by ${reviewerName}`, author: reviewerName }
        ];
        return {
          ...app,
          status: 'Approved',
          assignedReviewer: reviewerName,
          notes: newNotes,
          timeline: newTimeline
        };
      })
    );
    setStats((prev) => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1)
    }));
    addAuditLog('APPROVED_APPLICATION', appId, `Application approved by ${reviewerName}. Note: ${noteText || 'None'}`);
  };

  const rejectApplication = (appId, reviewerName = 'Tejas Mail', noteText = '') => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const newNotes = noteText
          ? [...app.notes, { id: `N-${Date.now()}`, author: reviewerName, date: 'Just now', text: noteText }]
          : app.notes;
        const newTimeline = [
          ...app.timeline,
          { date: 'Just now', action: `Application Rejected by ${reviewerName}`, author: reviewerName }
        ];
        return {
          ...app,
          status: 'Rejected',
          assignedReviewer: reviewerName,
          notes: newNotes,
          timeline: newTimeline
        };
      })
    );
    setStats((prev) => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1)
    }));
    addAuditLog('REJECTED_APPLICATION', appId, `Application rejected by ${reviewerName}. Reason: ${noteText || 'Unspecified'}`);
  };

  const requestApplicationDocs = (appId, reviewerName = 'Tejas Mail', noteText = '') => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const newNotes = noteText
          ? [...app.notes, { id: `N-${Date.now()}`, author: reviewerName, date: 'Just now', text: noteText }]
          : app.notes;
        const newTimeline = [
          ...app.timeline,
          { date: 'Just now', action: `Requested additional documents from citizen`, author: reviewerName }
        ];
        return {
          ...app,
          status: 'Documents Requested',
          assignedReviewer: reviewerName,
          notes: newNotes,
          timeline: newTimeline
        };
      })
    );
    addAuditLog('REQUESTED_DOCUMENTS', appId, `Requested clarification/documents. Note: ${noteText}`);
  };

  const assignReviewer = (appId, reviewerName) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, assignedReviewer: reviewerName } : app))
    );
    addAuditLog('ASSIGNED_REVIEWER', appId, `Assigned review responsibility to ${reviewerName}`);
  };

  // Citizen Actions
  const updateCitizenStatus = (citizenId, newStatus) => {
    setCitizens((prev) =>
      prev.map((c) => (c.id === citizenId ? { ...c, status: newStatus } : c))
    );
    addAuditLog('UPDATED_CITIZEN_STATUS', citizenId, `Changed citizen status to ${newStatus}`);
  };

  const deleteCitizen = (citizenId) => {
    setCitizens((prev) => prev.filter((c) => c.id !== citizenId));
    setStats((prev) => ({ ...prev, activeCitizens: Math.max(0, prev.activeCitizens - 1) }));
    addAuditLog('DELETED_CITIZEN', citizenId, `Removed citizen profile and associated records`);
  };

  // Scheme Actions
  const saveScheme = (schemeData) => {
    if (schemeData.id) {
      setSchemes((prev) =>
        prev.map((s) => (s.id === schemeData.id ? { ...s, ...schemeData } : s))
      );
      addAuditLog('UPDATED_SCHEME', schemeData.code, `Modified scheme details and eligibility rules`);
    } else {
      const newScheme = {
        ...schemeData,
        id: `SCH-${Date.now().toString().slice(-3)}`,
        status: 'Active',
        beneficiariesCount: 0,
        versionHistory: [{ version: 'v1.0', date: 'Just now', changes: 'Initial scheme setup created.', author: 'Tejas Mail' }]
      };
      setSchemes((prev) => [newScheme, ...prev]);
      addAuditLog('CREATED_SCHEME', newScheme.code, `Launched new scheme: ${newScheme.name}`);
    }
  };

  const deleteScheme = (schemeId) => {
    setSchemes((prev) => prev.filter((s) => s.id !== schemeId));
    addAuditLog('DELETED_SCHEME', schemeId, `Removed government scheme from active catalog`);
  };

  // Complaint Actions
  const addComplaintComment = (complaintId, text, author = 'Tejas Mail (Admin)') => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        const newComment = { id: `C-${Date.now()}`, author, date: 'Just now', text };
        const newTimeline = [...c.timeline, { date: 'Just now', event: `New note added by ${author}` }];
        return { ...c, comments: [...c.comments, newComment], timeline: newTimeline };
      })
    );
  };

  const updateComplaintStatus = (complaintId, newStatus) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        const newTimeline = [...c.timeline, { date: 'Just now', event: `Status updated to ${newStatus}` }];
        return { ...c, status: newStatus, timeline: newTimeline };
      })
    );
    addAuditLog('UPDATED_COMPLAINT_STATUS', complaintId, `Resolved / updated ticket to ${newStatus}`);
  };

  // Notification Actions
  const sendNotification = (notifData) => {
    const newNotif = {
      ...notifData,
      id: `NOTIF-${Date.now().toString().slice(-3)}`,
      status: notifData.scheduledAt ? 'Scheduled' : 'Sent',
      scheduledAt: notifData.scheduledAt || 'Just now',
      sentCount: notifData.scheduledAt ? 0 : Math.floor(Math.random() * 3000) + 1000,
      failedCount: notifData.scheduledAt ? 0 : Math.floor(Math.random() * 10)
    };
    setNotifications((prev) => [newNotif, ...prev]);
    addAuditLog('SENT_NOTIFICATION', newNotif.title, `Broadcasted alert via ${newNotif.channel}`);
  };

  return (
    <AdminDataContext.Provider
      value={{
        stats,
        citizens,
        applications,
        schemes,
        complaints,
        notifications,
        auditLogs,
        roles,
        approveApplication,
        rejectApplication,
        requestApplicationDocs,
        assignReviewer,
        updateCitizenStatus,
        deleteCitizen,
        saveScheme,
        deleteScheme,
        addComplaintComment,
        updateComplaintStatus,
        sendNotification
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
}
