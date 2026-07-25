import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
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
  const [applications, setApplications] = useState([]);
  const [schemes, setSchemes] = useState(initialSchemes);
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [roles, setRoles] = useState(adminRolesList);

  // Fetch complaints & applications directly from Supabase database tables
  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        const { data: compData } = await supabase
          .from('complain')
          .select('*')
          .order('id', { ascending: false });

        if (compData) {
          setComplaints(compData);
        }

        const { data: appData } = await supabase
          .from('applications')
          .select('*')
          .order('id', { ascending: false });

        if (appData && appData.length > 0) {
          const formattedApps = appData.map((item) => ({
            id: item.id || `APP-${item.id}`,
            citizenName: item.citizen_name || 'Citizen User',
            citizenEmail: item.citizen_email || '',
            schemeName: item.service_name || 'Government Scheme',
            details: item.what_happend || 'Application Details',
            status: item.status || 'In Progress',
            submissionDate: item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today'
          }));
          setApplications(formattedApps);
        }
      } catch (err) {
        console.warn('Supabase fetch data notice:', err?.message);
      }
    };
    fetchSupabaseData();
  }, []);

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

  // Complaint Actions - Insert into Supabase table 'complain'
  const addComplaint = (newComplaintData) => {
    const tempItem = {
      id: Date.now(),
      citizen_name: newComplaintData.citizenName || 'Citizen User',
      citizen_email: newComplaintData.citizenEmail || '',
      what_happend: newComplaintData.whatHappened || 'Public Grievance Report',
      where_happend: newComplaintData.whereHappened || 'Local Ward',
      status: 'In Progress'
    };

    setComplaints((prev) => [tempItem, ...prev]);

    // Insert directly into Supabase database table 'complain'
    supabase
      .from('complain')
      .insert([
        {
          citizen_name: tempItem.citizen_name,
          citizen_email: tempItem.citizen_email,
          what_happend: tempItem.what_happend,
          where_happend: tempItem.where_happend,
          status: tempItem.status
        }
      ])
      .select()
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          console.log('✅ Complaint ticket stored in Supabase database table "complain":', data[0]);
          setComplaints((prev) =>
            prev.map((c) => (c.id === tempItem.id ? data[0] : c))
          );
        } else if (error) {
          console.warn('Supabase insert notice (retrying without citizen_email if missing):', error.message);
          supabase
            .from('complain')
            .insert([
              {
                citizen_name: tempItem.citizen_name,
                what_happend: tempItem.what_happend,
                where_happend: tempItem.where_happend,
                status: tempItem.status
              }
            ])
            .select()
            .then(({ data: d2 }) => {
              if (d2 && d2.length > 0) {
                setComplaints((prev) => prev.map((c) => (c.id === tempItem.id ? d2[0] : c)));
              }
            });
        }
      })
      .catch((err) => console.warn('Supabase insert exception:', err?.message));

    return tempItem;
  };

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

  const addApplication = (newAppData) => {
    const sName = newAppData.serviceName || (newAppData.serviceType === 'farmer_disaster' ? 'Farmer Disaster Relief Scheme' : newAppData.serviceType === 'income_certificate' ? 'Income Certificate Application' : 'Government Welfare Application');
    
    const tempItem = {
      id: `APP-${Date.now().toString().slice(-4)}`,
      citizenName: newAppData.citizenName || 'Citizen User',
      citizenEmail: newAppData.citizenEmail || '',
      schemeName: sName,
      details: newAppData.details || newAppData.whatHappened || 'Application form submitted successfully.',
      status: 'In Progress',
      submissionDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      category: 'Welfare Scheme',
      notes: [],
      timeline: [{ date: 'Just now', action: 'Application Created via AI Assistant', author: newAppData.citizenName || 'Citizen' }]
    };

    setApplications((prev) => [tempItem, ...prev]);

    // Insert directly into Supabase database table 'applications'
    supabase
      .from('applications')
      .insert([
        {
          citizen_name: tempItem.citizenName,
          citizen_email: tempItem.citizenEmail,
          service_name: tempItem.schemeName,
          what_happend: tempItem.details,
          status: tempItem.status
        }
      ])
      .select()
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          console.log('✅ Application stored in Supabase database table "applications":', data[0]);
        } else if (error) {
          console.warn('Supabase application insert notice:', error.message);
        }
      });

    return tempItem;
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
        addApplication,
        approveApplication,
        rejectApplication,
        requestApplicationDocs,
        assignReviewer,
        updateCitizenStatus,
        deleteCitizen,
        saveScheme,
        deleteScheme,
        addComplaint,
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
