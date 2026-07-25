import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminDataProvider } from './context/AdminDataContext';
import { ToastProvider } from './context/ToastContext';
import { AdminLayout } from './components/layout/AdminLayout';

// Admin Portal Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { Dashboard } from './pages/admin/Dashboard';
import { CitizensList } from './pages/admin/CitizensList';
import { CitizenDetail } from './pages/admin/CitizenDetail';
import { ApplicationsList } from './pages/admin/ApplicationsList';
import { ApplicationReview } from './pages/admin/ApplicationReview';
import { SchemeManagement } from './pages/admin/SchemeManagement';
import { SchemeCreateEdit } from './pages/admin/SchemeCreateEdit';
import { DocumentReview } from './pages/admin/DocumentReview';
import { AIAnalytics } from './pages/admin/AIAnalytics';
import { ComplaintsManagement } from './pages/admin/ComplaintsManagement';
import { ReportsExport } from './pages/admin/ReportsExport';
import { NotificationsBroadcast } from './pages/admin/NotificationsBroadcast';
import { Settings } from './pages/admin/Settings';
import { AuditLogs } from './pages/admin/AuditLogs';

// Existing Citizen Pages (Kept intact and accessible)
import { Home as CitizenHome } from './pages/Home';
import { Dashboard as CitizenDashboard } from './pages/Dashboard';
import { Login as CitizenLogin } from './pages/Login';
import { Onboarding } from './pages/Onboarding';

function App() {
  return (
    <AdminAuthProvider>
      <AdminDataProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Admin Route */}
              <Route path="/login" element={<AdminLogin />} />

              {/* Protected Admin Portal Routes wrapped in AdminLayout */}
              <Route element={<AdminLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/citizens" element={<CitizensList />} />
                <Route path="/citizens/:id" element={<CitizenDetail />} />
                <Route path="/applications" element={<ApplicationsList />} />
                <Route path="/applications/:id" element={<ApplicationReview />} />
                <Route path="/schemes" element={<SchemeManagement />} />
                <Route path="/schemes/new" element={<SchemeCreateEdit />} />
                <Route path="/schemes/:id/edit" element={<SchemeCreateEdit />} />
                <Route path="/document-review" element={<DocumentReview />} />
                <Route path="/ai-analytics" element={<AIAnalytics />} />
                <Route path="/complaints" element={<ComplaintsManagement />} />
                <Route path="/reports" element={<ReportsExport />} />
                <Route path="/notifications" element={<NotificationsBroadcast />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/audit-logs" element={<AuditLogs />} />
              </Route>

              {/* Existing Citizen Portal Routes (Kept intact and accessible) */}
              <Route path="/citizen-home" element={<CitizenHome />} />
              <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
              <Route path="/citizen-login" element={<CitizenLogin />} />
              <Route path="/onboarding" element={<Onboarding />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AdminDataProvider>
    </AdminAuthProvider>
  );
}

export default App;
