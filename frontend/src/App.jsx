import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import CitizenLayout from './components/layout/CitizenLayout';
import OfficerLayout from './components/layout/OfficerLayout';
import PermissionGuard from './components/layout/PermissionGuard';
import { Permissions } from './data/officerPermissionModel';
import { grievanceDemoDataService } from './services/grievanceDemoDataService';

// Citizen Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';

// Assistant Pages (Phase 4)
import AssistantHomePage from './pages/assistant/AssistantHomePage';
import AssistantListeningPage from './pages/assistant/AssistantListeningPage';
import AssistantTranscriptPage from './pages/assistant/AssistantTranscriptPage';
import AssistantThinkingPage from './pages/assistant/AssistantThinkingPage';
import AssistantChatPage from './pages/assistant/AssistantChatPage';
import AssistantHistoryPage from './pages/assistant/AssistantHistoryPage';
import AssistantErrorPage from './pages/assistant/AssistantErrorPage';

// Scheme Pages (Phase 5)
import SchemeDiscoveryPage from './pages/schemes/SchemeDiscoveryPage';
import RecommendedSchemesPage from './pages/schemes/RecommendedSchemesPage';
import SavedSchemesPage from './pages/schemes/SavedSchemesPage';
import SchemeDetailsPage from './pages/schemes/SchemeDetailsPage';
import EligibilityIntroPage from './pages/schemes/EligibilityIntroPage';
import EligibilityQuestionsPage from './pages/schemes/EligibilityQuestionsPage';
import EligibilityResultPage from './pages/schemes/EligibilityResultPage';
import { SchemeDocumentsPage } from './pages/schemes/SchemePagesExtended';

// Application Pages (Phase 6)
import ApplicationStartPage from './pages/applications/ApplicationStartPage';
import ApplicationFormPage from './pages/applications/ApplicationFormPage';
import ApplicationDocumentsPage from './pages/applications/ApplicationDocumentsPage';
import ApplicationReviewPage from './pages/applications/ApplicationReviewPage';
import {
  ApplicationDeclarationPage,
  ApplicationSubmittingPage,
  ApplicationSuccessPage,
  ApplicationEditGuardPage
} from './pages/applications/ApplicationFlowPages';

// OCR Scanning & Autofill Pages (Phase 7)
import { DocumentScanHomePage, DocumentCapturePage } from './pages/ocr/DocumentScanPages';
import { DocumentPreviewPage, DocumentQualityCheckPage } from './pages/ocr/DocumentPreviewPages';
import {
  DocumentExtractingPage,
  DocumentExtractionReviewPage,
  DocumentVerificationPage,
  DocumentProcessingResultPage
} from './pages/ocr/DocumentExtractionPages';
import {
  DocumentApplicationMappingPage,
  ApplicationAutofillReviewPage
} from './pages/ocr/DocumentMappingPages';

// Application Tracking & Notifications Pages (Phase 8)
import { ApplicationsListPage } from './pages/tracking/ApplicationsListPage';
import { ApplicationTrackingHubPage } from './pages/tracking/ApplicationTrackingHubPage';
import { 
  ApplicationTimelinePage,
  ApplicationStatusPage,
  ApplicationRemarksPage,
  ApplicationHistoryPage,
  ApplicationDownloadPage,
  ApplicationWithdrawPage
} from './pages/tracking/ApplicationTrackingSubPages';
import { 
  DocumentRequestPage,
  DocumentRespondPage,
  ClarificationRequestPage,
  ClarificationRespondPage 
} from './pages/tracking/ApplicationRequestPages';

// Officer Portal Pages (Phase 9)
import OfficerLogin from './pages/officer/OfficerLogin';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import OfficerQueue from './pages/officer/OfficerQueue';
import ApplicationReviewWorkspace from './pages/officer/ApplicationReviewWorkspace';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import GlobalAuditLog from './pages/admin/GlobalAuditLog';

// Citizen Grievance Pages (Phase 10)
import GrievanceCreationPage from './pages/grievances/GrievanceCreationPage';
import GrievanceListPage from './pages/grievances/GrievanceListPage';
import GrievanceTrackingHubPage from './pages/grievances/GrievanceTrackingHubPage';
import GrievanceTimelinePage from './pages/grievances/GrievanceTimelinePage';
import GrievanceRespondPage from './pages/grievances/GrievanceRespondPage';
import GrievanceEvidencePage from './pages/grievances/GrievanceEvidencePage';
import GrievanceEscalatePage from './pages/grievances/GrievanceEscalatePage';
import GrievanceResolutionPage from './pages/grievances/GrievanceResolutionPage';
import GrievanceReopenPage from './pages/grievances/GrievanceReopenPage';
import GrievanceAppealPage from './pages/grievances/GrievanceAppealPage';
import GrievanceFeedbackPage from './pages/grievances/GrievanceFeedbackPage';
import GrievanceDownloadPage from './pages/grievances/GrievanceDownloadPage';

// Officer Grievance Pages (Phase 10)
import OfficerGrievanceOverviewPage from './pages/officer/grievances/OfficerGrievanceOverviewPage';
import OfficerGrievanceQueuePage from './pages/officer/grievances/OfficerGrievanceQueuePage';
import OfficerGrievanceReviewPage from './pages/officer/grievances/OfficerGrievanceReviewPage';
import OfficerGrievanceNotesPage from './pages/officer/grievances/OfficerGrievanceNotesPage';
import OfficerGrievanceRequestsPage from './pages/officer/grievances/OfficerGrievanceRequestsPage';
import OfficerGrievanceResolutionPage from './pages/officer/grievances/OfficerGrievanceResolutionPage';
import OfficerGrievanceAuditPage from './pages/officer/grievances/OfficerGrievanceAuditPage';
import OfficerGrievanceWorkloadPage from './pages/officer/grievances/OfficerGrievanceWorkloadPage';
import OfficerGrievanceNotificationsPage from './pages/officer/grievances/OfficerGrievanceNotificationsPage';

// Admin Grievance Pages (Phase 10)
import GrievanceAdminOverviewPage from './pages/admin/grievances/GrievanceAdminOverviewPage';
import GrievanceCategoryManagementPage from './pages/admin/grievances/GrievanceCategoryManagementPage';
import GrievanceSlaManagementPage from './pages/admin/grievances/GrievanceSlaManagementPage';
import GrievanceEscalationRulesPage from './pages/admin/grievances/GrievanceEscalationRulesPage';
import GrievanceOfficerManagementPage from './pages/admin/grievances/GrievanceOfficerManagementPage';
import GrievanceAnalyticsPage from './pages/admin/grievances/GrievanceAnalyticsPage';
import GrievanceAuditLogPage from './pages/admin/grievances/GrievanceAuditLogPage';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function App() {
  React.useEffect(() => {
    // Initialize mock data on app load
    grievanceDemoDataService.initializeDemoData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Officer Login - No layout */}
          <Route path="/officer/login" element={<OfficerLogin />} />

          {/* Officer Portal - OfficerLayout */}
          <Route path="/officer" element={<OfficerLayout />}>
            <Route path="dashboard" element={
              <PermissionGuard requiredPermissions={[Permissions.QUEUE_VIEW]}>
                <OfficerDashboard />
              </PermissionGuard>
            } />
            <Route path="queue/*" element={
              <PermissionGuard requiredPermissions={[Permissions.QUEUE_VIEW]}>
                <OfficerQueue />
              </PermissionGuard>
            } />
            <Route path="applications/:applicationId" element={
              <PermissionGuard requiredPermissions={[Permissions.APPLICATION_VIEW]}>
                <ApplicationReviewWorkspace />
              </PermissionGuard>
            } />
            <Route path="applications/:applicationId/review" element={
              <PermissionGuard requiredPermissions={[Permissions.APPLICATION_VIEW]}>
                <ApplicationReviewWorkspace />
              </PermissionGuard>
            } />
            
            {/* Officer Grievance Routes (Phase 10) */}
            <Route path="grievances/dashboard" element={
              <PermissionGuard requiredPermissions={[Permissions.Grievance_VIEW, Permissions.Grievance_VIEW_DEPARTMENT]}>
                <OfficerGrievanceOverviewPage />
              </PermissionGuard>
            } />
            <Route path="grievances/queue" element={
              <PermissionGuard requiredPermissions={[Permissions.GRIEVANCE_VIEW, Permissions.GRIEVANCE_VIEW_DEPARTMENT]}>
                <OfficerGrievanceQueuePage />
              </PermissionGuard>
            } />
            <Route path="grievances/queue/:filter" element={
              <PermissionGuard requiredPermissions={[Permissions.GRIEVANCE_VIEW, Permissions.GRIEVANCE_VIEW_DEPARTMENT]}>
                <OfficerGrievanceQueuePage />
              </PermissionGuard>
            } />
            <Route path="grievances/:grievanceId" element={
              <PermissionGuard requiredPermissions={[Permissions.GRIEVANCE_VIEW, Permissions.GRIEVANCE_VIEW_DEPARTMENT]}>
                <OfficerGrievanceReviewPage />
              </PermissionGuard>
            } />
            <Route path="grievances/:grievanceId/review" element={
              <PermissionGuard requiredPermissions={[Permissions.GRIEVANCE_VIEW, Permissions.GRIEVANCE_VIEW_DEPARTMENT]}>
                <OfficerGrievanceReviewPage />
              </PermissionGuard>
            } />
            <Route path="grievances/:grievanceId/notes" element={
              <PermissionGuard requiredPermissions={[Permissions.GRIEVANCE_VIEW, Permissions.GRIEVANCE_VIEW_DEPARTMENT]}>
                <OfficerGrievanceNotesPage />
              </PermissionGuard>
            } />
            <Route path="grievances/:grievanceId/requests" element={
              <PermissionGuard requiredPermissions={[Permissions.GRIEVANCE_VIEW, Permissions.GRIEVANCE_VIEW_DEPARTMENT]}>
                <OfficerGrievanceRequestsPage />
              </PermissionGuard>
            } />
            <Route path="grievances/:grievanceId/resolution" element={
              <PermissionGuard requiredPermissions={[Permissions.GRIEVANCE_VIEW, Permissions.GRIEVANCE_VIEW_DEPARTMENT]}>
                <OfficerGrievanceResolutionPage />
              </PermissionGuard>
            } />
            <Route path="grievances/:grievanceId/audit" element={
              <PermissionGuard requiredPermissions={[Permissions.GRIEVANCE_VIEW, Permissions.GRIEVANCE_VIEW_DEPARTMENT]}>
                <OfficerGrievanceAuditPage />
              </PermissionGuard>
            } />
            <Route path="grievances/workload" element={
              <PermissionGuard requiredPermissions={[Permissions.WORKLOAD_VIEW]}>
                <OfficerGrievanceWorkloadPage />
              </PermissionGuard>
            } />
            <Route path="grievances/notifications" element={
              <PermissionGuard requiredPermissions={[Permissions.GRIEVANCE_VIEW, Permissions.GRIEVANCE_VIEW_DEPARTMENT]}>
                <OfficerGrievanceNotificationsPage />
              </PermissionGuard>
            } />
          </Route>

          {/* Admin Portal - OfficerLayout */}
          <Route path="/admin" element={<OfficerLayout />}>
            <Route path="analytics" element={
              <PermissionGuard requiredPermissions={[Permissions.ANALYTICS_VIEW]}>
                <AdminAnalytics />
              </PermissionGuard>
            } />
            <Route path="audit" element={
              <PermissionGuard requiredPermissions={[Permissions.AUDIT_VIEW]}>
                <GlobalAuditLog />
              </PermissionGuard>
            } />
            
            {/* Admin Grievance Routes (Phase 10) */}
            <Route path="grievances" element={
              <PermissionGuard requiredPermissions={[Permissions.GRIEVANCE_CONFIG_MANAGE, Permissions.GRIEVANCE_CATEGORY_MANAGE, Permissions.GRIEVANCE_SLA_MANAGE]}>
                <GrievanceAdminOverviewPage />
              </PermissionGuard>
            } />
            <Route path="grievances/categories" element={
              <PermissionGuard requiredPermissions={[Permissions.GRIEVANCE_CATEGORY_MANAGE]}>
                <GrievanceCategoryManagementPage />
              </PermissionGuard>
            } />
            <Route path="grievances/sla" element={
              <PermissionGuard requiredPermissions={[Permissions.GRIEVANCE_SLA_MANAGE]}>
                <GrievanceSlaManagementPage />
              </PermissionGuard>
            } />
            <Route path="grievances/escalation-rules" element={
              <PermissionGuard requiredPermissions={[Permissions.GRIEVANCE_CONFIG_MANAGE]}>
                <GrievanceEscalationRulesPage />
              </PermissionGuard>
            } />
            <Route path="grievances/officers" element={
              <PermissionGuard requiredPermissions={[Permissions.OFFICERS_MANAGE]}>
                <GrievanceOfficerManagementPage />
              </PermissionGuard>
            } />
            <Route path="grievances/analytics" element={
              <PermissionGuard requiredPermissions={[Permissions.GRIEVANCE_ANALYTICS_VIEW]}>
                <GrievanceAnalyticsPage />
              </PermissionGuard>
            } />
            <Route path="grievances/audit" element={
              <PermissionGuard requiredPermissions={[Permissions.GRIEVANCE_AUDIT_VIEW]}>
                <GrievanceAuditLogPage />
              </PermissionGuard>
            } />
          </Route>

          {/* Citizen Portal - CitizenLayout */}
          <Route element={<CitizenLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* AI Assistant Phase 4 Routes */}
            <Route path="/assistant" element={<AssistantHomePage />} />
            <Route path="/assistant/listening" element={<AssistantListeningPage />} />
            <Route path="/assistant/transcript" element={<AssistantTranscriptPage />} />
            <Route path="/assistant/thinking" element={<AssistantThinkingPage />} />
            <Route path="/assistant/chat" element={<AssistantChatPage />} />
            <Route path="/assistant/history" element={<AssistantHistoryPage />} />
            <Route path="/assistant/error" element={<AssistantErrorPage />} />

            {/* Government Schemes Phase 5 Routes */}
            <Route path="/schemes" element={<SchemeDiscoveryPage />} />
            <Route path="/schemes/recommended" element={<RecommendedSchemesPage />} />
            <Route path="/schemes/saved" element={<SavedSchemesPage />} />
            <Route path="/schemes/:schemeId" element={<SchemeDetailsPage />} />
            <Route path="/schemes/:schemeId/eligibility" element={<EligibilityIntroPage />} />
            <Route path="/schemes/:schemeId/eligibility/questions" element={<EligibilityQuestionsPage />} />
            <Route path="/schemes/:schemeId/eligibility/result" element={<EligibilityResultPage />} />
            <Route path="/schemes/:schemeId/documents" element={<SchemeDocumentsPage />} />

            {/* Application Workflow Phase 6 Routes */}
            <Route path="/schemes/:schemeId/apply" element={<ApplicationStartPage />} />
            <Route path="/applications/new/:schemeId" element={<ApplicationStartPage />} />
            <Route path="/applications/:applicationId/form" element={<ApplicationFormPage />} />
            <Route path="/applications/:applicationId/documents" element={<ApplicationDocumentsPage />} />
            <Route path="/applications/:applicationId/review" element={<ApplicationReviewPage />} />
            <Route path="/applications/:applicationId/declaration" element={<ApplicationDeclarationPage />} />
            <Route path="/applications/:applicationId/submitting" element={<ApplicationSubmittingPage />} />
            <Route path="/applications/:applicationId/success" element={<ApplicationSuccessPage />} />
            <Route path="/applications/:applicationId/edit" element={<ApplicationEditGuardPage />} />

            {/* OCR Scanning & Autofill Phase 7 Routes */}
            <Route path="/documents/scan" element={<DocumentScanHomePage />} />
            <Route path="/documents/scan/:documentType" element={<DocumentCapturePage />} />
            <Route path="/documents/:documentId/preview" element={<DocumentPreviewPage />} />
            <Route path="/documents/:documentId/quality-check" element={<DocumentQualityCheckPage />} />
            <Route path="/documents/:documentId/extracting" element={<DocumentExtractingPage />} />
            <Route path="/documents/:documentId/extraction-review" element={<DocumentExtractionReviewPage />} />
            <Route path="/documents/:documentId/verification" element={<DocumentVerificationPage />} />
            <Route path="/documents/:documentId/result" element={<DocumentProcessingResultPage />} />
            <Route path="/applications/:applicationId/documents/:documentId/map" element={<DocumentApplicationMappingPage />} />
            <Route path="/applications/:applicationId/autofill-review" element={<ApplicationAutofillReviewPage />} />

            {/* Application Tracking & Notifications Phase 8 Routes */}
            <Route path="/applications" element={<ApplicationsListPage />} />
            <Route path="/applications/:applicationId" element={<ApplicationTrackingHubPage />} />
            <Route path="/applications/:applicationId/timeline" element={<ApplicationTimelinePage />} />
            <Route path="/applications/:applicationId/status" element={<ApplicationStatusPage />} />
            <Route path="/applications/:applicationId/remarks" element={<ApplicationRemarksPage />} />
            <Route path="/applications/:applicationId/documents/request" element={<DocumentRequestPage />} />
            <Route path="/applications/:applicationId/documents/respond" element={<DocumentRespondPage />} />
            <Route path="/applications/:applicationId/clarification" element={<ClarificationRequestPage />} />
            <Route path="/applications/:applicationId/clarification/respond" element={<ClarificationRespondPage />} />
            <Route path="/applications/:applicationId/history" element={<ApplicationHistoryPage />} />
            <Route path="/applications/:applicationId/download" element={<ApplicationDownloadPage />} />
            <Route path="/applications/:applicationId/withdraw" element={<ApplicationWithdrawPage />} />

            {/* Grievance Routes (Phase 10) */}
            <Route path="/grievances" element={<GrievanceListPage />} />
            <Route path="/grievances/new" element={<GrievanceCreationPage />} />
            <Route path="/grievances/new/application" element={<GrievanceCreationPage />} />
            <Route path="/grievances/new/general" element={<GrievanceCreationPage />} />
            <Route path="/grievances/:grievanceId" element={<GrievanceTrackingHubPage />} />
            <Route path="/grievances/:grievanceId/timeline" element={<GrievanceTimelinePage />} />
            <Route path="/grievances/:grievanceId/respond" element={<GrievanceRespondPage />} />
            <Route path="/grievances/:grievanceId/evidence" element={<GrievanceEvidencePage />} />
            <Route path="/grievances/:grievanceId/escalate" element={<GrievanceEscalatePage />} />
            <Route path="/grievances/:grievanceId/resolution" element={<GrievanceResolutionPage />} />
            <Route path="/grievances/:grievanceId/reopen" element={<GrievanceReopenPage />} />
            <Route path="/grievances/:grievanceId/appeal" element={<GrievanceAppealPage />} />
            <Route path="/grievances/:grievanceId/feedback" element={<GrievanceFeedbackPage />} />
            <Route path="/grievances/:grievanceId/download" element={<GrievanceDownloadPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

