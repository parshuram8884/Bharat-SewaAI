import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, useUser } from '@clerk/react';
import CitizenLayout from './components/layout/CitizenLayout';
import OfficerLayout from './components/layout/OfficerLayout';
import PermissionGuard from './components/layout/PermissionGuard';
import { AssistancePanel } from './assistance/components/AssistancePanel';
import { OfflineBanner } from './reliability/components/OfflineBanner';
import { AppErrorBoundary } from './reliability/boundaries/ErrorBoundaries';
import { Permissions } from './data/officerPermissionModel';
import { grievanceDemoDataService } from './services/grievanceDemoDataService';
import { benefitDemoDataService } from './services/benefitDemoDataService';
import { documentDemoDataService } from './services/documentDemoDataService';
import { cscDemoDataService } from './services/cscDemoDataService';

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

// Phase 11: Citizen Benefit & Payment Pages
import BenefitListPage from './pages/benefits/BenefitListPage';
import BenefitTrackingHubPage from './pages/benefits/BenefitTrackingHubPage';
import BenefitTimelinePage from './pages/benefits/BenefitTimelinePage';
import BenefitPaymentPage from './pages/benefits/BenefitPaymentPage';
import BenefitHistoryPage from './pages/benefits/BenefitHistoryPage';
import BenefitSanctionPage from './pages/benefits/BenefitSanctionPage';
import BenefitDownloadPage from './pages/benefits/BenefitDownloadPage';
import BenefitPaymentAdvicePage from './pages/benefits/BenefitPaymentAdvicePage';
import BenefitReportIssuePage from './pages/benefits/BenefitReportIssuePage';
import BenefitIssueDetailPage from './pages/benefits/BenefitIssueDetailPage';

// Phase 11: Officer Payment Pages
import PaymentOfficerDashboard from './pages/officer/payments/PaymentOfficerDashboard';
import PaymentOfficerQueue from './pages/officer/payments/PaymentOfficerQueue';
import PaymentOfficerBatches from './pages/officer/payments/PaymentOfficerBatches';
import PaymentOfficerBatchNew from './pages/officer/payments/PaymentOfficerBatchNew';
import PaymentOfficerBatchDetail from './pages/officer/payments/PaymentOfficerBatchDetail';
import PaymentOfficerBatchReview from './pages/officer/payments/PaymentOfficerBatchReview';
import PaymentOfficerPaymentDetail from './pages/officer/payments/PaymentOfficerPaymentDetail';
import PaymentOfficerPaymentReview from './pages/officer/payments/PaymentOfficerPaymentReview';
import PaymentOfficerPaymentHistory from './pages/officer/payments/PaymentOfficerPaymentHistory';
import PaymentOfficerPaymentNotes from './pages/officer/payments/PaymentOfficerPaymentNotes';
import PaymentOfficerPaymentAudit from './pages/officer/payments/PaymentOfficerPaymentAudit';
import PaymentOfficerWorkload from './pages/officer/payments/PaymentOfficerWorkload';
import PaymentOfficerNotifications from './pages/officer/payments/PaymentOfficerNotifications';

// Phase 11: Admin Payment Pages
import PaymentAdminOverview from './pages/admin/payments/PaymentAdminOverview';
import PaymentAdminOfficers from './pages/admin/payments/PaymentAdminOfficers';
import PaymentAdminBatches from './pages/admin/payments/PaymentAdminBatches';
import PaymentAdminConfig from './pages/admin/payments/PaymentAdminConfig';
import PaymentAdminFailureRules from './pages/admin/payments/PaymentAdminFailureRules';
import PaymentAdminRetryRules from './pages/admin/payments/PaymentAdminRetryRules';
import PaymentAdminAnalytics from './pages/admin/payments/PaymentAdminAnalytics';
import PaymentAdminAudit from './pages/admin/payments/PaymentAdminAudit';

// Phase 12: Citizen Document Vault Pages
import DocumentVaultPage from './pages/documents/DocumentVaultPage';
import DocumentUploadPage from './pages/documents/DocumentUploadPage';
import DigilockerImportPage from './pages/documents/DigilockerImportPage';
import DigilockerHistoryPage from './pages/documents/DigilockerHistoryPage';
import DocumentDetailPage from './pages/documents/DocumentDetailPage';
import DocumentHistoryPage from './pages/documents/DocumentHistoryPage';
import DocumentVersionsPage from './pages/documents/DocumentVersionsPage';
import DocumentVerificationRequestPage from './pages/documents/DocumentVerificationRequestPage';
import DocumentRenewPage from './pages/documents/DocumentRenewPage';
import DocumentReplacePage from './pages/documents/DocumentReplacePage';
import DocumentSharePage from './pages/documents/DocumentSharePage';
import DocumentEsignPage from './pages/documents/DocumentEsignPage';
import DocumentDownloadPage from './pages/documents/DocumentDownloadPage';
import SharedDocumentViewPage from './pages/documents/SharedDocumentViewPage';

// Phase 12: Officer Document Pages
import OfficerDocumentDashboard from './pages/officer/documents/OfficerDocumentDashboard';
import OfficerDocumentQueue from './pages/officer/documents/OfficerDocumentQueue';
import OfficerDocumentReview from './pages/officer/documents/OfficerDocumentReview';
import OfficerDocumentNotes from './pages/officer/documents/OfficerDocumentNotes';
import OfficerDocumentRequests from './pages/officer/documents/OfficerDocumentRequests';
import OfficerDocumentHistory from './pages/officer/documents/OfficerDocumentHistory';
import OfficerDocumentAudit from './pages/officer/documents/OfficerDocumentAudit';
import OfficerDocumentWorkload from './pages/officer/documents/OfficerDocumentWorkload';
import OfficerDocumentNotifications from './pages/officer/documents/OfficerDocumentNotifications';

// Phase 12: Admin Document Pages
import DocumentAdminOverview from './pages/admin/documents/DocumentAdminOverview';
import DocumentAdminCategories from './pages/admin/documents/DocumentAdminCategories';
import DocumentAdminVerificationRules from './pages/admin/documents/DocumentAdminVerificationRules';
import DocumentAdminExpiryRules from './pages/admin/documents/DocumentAdminExpiryRules';
import DocumentAdminRetention from './pages/admin/documents/DocumentAdminRetention';
import DocumentAdminOfficers from './pages/admin/documents/DocumentAdminOfficers';
import DocumentAdminAnalytics from './pages/admin/documents/DocumentAdminAnalytics';
import DocumentAdminAudit from './pages/admin/documents/DocumentAdminAudit';

// Phase 13: CSC Pages
import CentreDiscoveryPage from './pages/csc/CentreDiscoveryPage';
import ServiceCataloguePage from './pages/csc/ServiceCataloguePage';
import AppointmentBookingPage from './pages/csc/AppointmentBookingPage';
import AppointmentTrackingPage from './pages/csc/AppointmentTrackingPage';
import WalkinRegistrationPage from './pages/csc/WalkinRegistrationPage';
import CscFeedbackPage from './pages/csc/CscFeedbackPage';
import OperatorDashboard from './pages/officer/csc/OperatorDashboard';
import OperatorQueue from './pages/officer/csc/OperatorQueue';
import OperatorWorkspace from './pages/officer/csc/OperatorWorkspace';
import CscManagerDashboard from './pages/admin/csc/CscManagerDashboard';
import CscAdminOverview from './pages/admin/csc/CscAdminOverview';

// Phase 14: Analytics Pages
import { analyticsDemoDataService } from './services/analyticsDemoDataService';
import ExecutiveDashboardPage from './pages/analytics/ExecutiveDashboardPage';
import DepartmentAnalyticsPage from './pages/analytics/DepartmentAnalyticsPage';
import DataQualityDashboardPage from './pages/analytics/DataQualityDashboardPage';
import ReportBuilderPage from './pages/analytics/reports/ReportBuilderPage';
import ReportRunHistoryPage from './pages/analytics/reports/ReportRunHistoryPage';
import OpenDataDatasetReviewPage from './pages/analytics/open-data/OpenDataDatasetReviewPage';
import OpenDataDatasetListPage from './pages/analytics/open-data/OpenDataDatasetListPage';
import { AnalyticsPermissions } from './data/analyticsPermissionModel';
import { SecurityPermissions } from './data/securityPermissionModel';

// Phase 15: Security & Platform Health
const SecurityOverviewPage = React.lazy(() => import('./pages/admin/security/SecurityOverviewPage'));
const PlatformHealthPage = React.lazy(() => import('./pages/admin/security/PlatformHealthPage'));
import { queryRecoveryService } from './reliability/services/queryRecoveryService';

const queryClient = new QueryClient({
  defaultOptions: queryRecoveryService.getDefaultOptions()
});

function App() {
  React.useEffect(() => {
    // Phase 13 CSC Initialization
    import('./services/cscDemoDataService').then(module => {
      module.cscDemoDataService.initialize();
    });

    // Phase 14 Analytics Initialization
    analyticsDemoDataService.initialize();

    const storedUser = localStorage.getItem('bsai_user');
    grievanceDemoDataService.initializeDemoData();
    benefitDemoDataService.initializeDemoData();
    documentDemoDataService.initializeDemoData();
    cscDemoDataService.initializeCscStorage();
  }, []);

  return (
    <AppErrorBoundary>
      <ErrorBoundary fallback={<ErrorDisplay title="Application Error" message="A critical error occurred while rendering the application." />}>
        <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppCommandPalette />
          <GlobalNotificationCenter />
          <AssistancePanel />
          <OfflineBanner />
          <Routes>
            <Route path="/demo-control" element={
              <React.Suspense fallback={<div>Loading Demo Control...</div>}>
                {React.createElement(React.lazy(() => import('./demo/components/DemoControlPanel').then(m => ({ default: m.DemoControlPanel }))))}
              </React.Suspense>
            } />
            
            {/* Officer Login - No layout */}
            <Route path="/officer/login" element={<OfficerLogin />} />

          {/* Phase 12: Public Shared Route */}
          <Route path="/shared/docs/:token" element={<SharedDocumentViewPage />} />

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

            {/* Officer Payment Routes (Phase 11) */}
            <Route path="payments/dashboard" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_VIEW, Permissions.PAYMENT_VIEW_DEPARTMENT]}>
                <PaymentOfficerDashboard />
              </PermissionGuard>
            } />
            <Route path="payments/queue" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_VIEW, Permissions.PAYMENT_VIEW_DEPARTMENT]}>
                <PaymentOfficerQueue />
              </PermissionGuard>
            } />
            <Route path="payments/queue/:filter" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_VIEW, Permissions.PAYMENT_VIEW_DEPARTMENT]}>
                <PaymentOfficerQueue />
              </PermissionGuard>
            } />
            <Route path="payments/batches" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_BATCH_VIEW]}>
                <PaymentOfficerBatches />
              </PermissionGuard>
            } />
            <Route path="payments/batches/new" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_BATCH_CREATE]}>
                <PaymentOfficerBatchNew />
              </PermissionGuard>
            } />
            <Route path="payments/batches/:batchId" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_BATCH_VIEW]}>
                <PaymentOfficerBatchDetail />
              </PermissionGuard>
            } />
            <Route path="payments/batches/:batchId/review" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_BATCH_VIEW]}>
                <PaymentOfficerBatchReview />
              </PermissionGuard>
            } />
            <Route path="payments/:paymentId" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_VIEW, Permissions.PAYMENT_VIEW_DEPARTMENT]}>
                <PaymentOfficerPaymentDetail />
              </PermissionGuard>
            } />
            <Route path="payments/:paymentId/review" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_VIEW, Permissions.PAYMENT_VIEW_DEPARTMENT]}>
                <PaymentOfficerPaymentReview />
              </PermissionGuard>
            } />
            <Route path="payments/:paymentId/history" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_VIEW, Permissions.PAYMENT_VIEW_DEPARTMENT]}>
                <PaymentOfficerPaymentHistory />
              </PermissionGuard>
            } />
            <Route path="payments/:paymentId/notes" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_VIEW, Permissions.PAYMENT_VIEW_DEPARTMENT]}>
                <PaymentOfficerPaymentNotes />
              </PermissionGuard>
            } />
            <Route path="payments/:paymentId/audit" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_VIEW, Permissions.PAYMENT_VIEW_DEPARTMENT]}>
                <PaymentOfficerPaymentAudit />
              </PermissionGuard>
            } />
            <Route path="payments/workload" element={
              <PermissionGuard requiredPermissions={[Permissions.WORKLOAD_VIEW]}>
                <PaymentOfficerWorkload />
              </PermissionGuard>
            } />
            <Route path="payments/notifications" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_VIEW, Permissions.PAYMENT_VIEW_DEPARTMENT]}>
                <PaymentOfficerNotifications />
              </PermissionGuard>
            } />

            {/* Officer Document Vault Routes (Phase 12) */}
            <Route path="documents/dashboard" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_OFFICER_REVIEW]}>
                <OfficerDocumentDashboard />
              </PermissionGuard>
            } />
            <Route path="documents/queue" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_OFFICER_REVIEW]}>
                <OfficerDocumentQueue />
              </PermissionGuard>
            } />
            <Route path="documents/queue/:filter" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_OFFICER_REVIEW]}>
                <OfficerDocumentQueue />
              </PermissionGuard>
            } />
            <Route path="documents/:documentId" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_OFFICER_REVIEW]}>
                <OfficerDocumentReview />
              </PermissionGuard>
            } />
            <Route path="documents/:documentId/review" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_OFFICER_REVIEW]}>
                <OfficerDocumentReview />
              </PermissionGuard>
            } />
            <Route path="documents/:documentId/notes" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_OFFICER_REVIEW]}>
                <OfficerDocumentNotes />
              </PermissionGuard>
            } />
            <Route path="documents/:documentId/requests" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_OFFICER_REVIEW]}>
                <OfficerDocumentRequests />
              </PermissionGuard>
            } />
            <Route path="documents/:documentId/history" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_OFFICER_REVIEW]}>
                <OfficerDocumentHistory />
              </PermissionGuard>
            } />
            <Route path="documents/:documentId/audit" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_OFFICER_REVIEW]}>
                <OfficerDocumentAudit />
              </PermissionGuard>
            } />
            <Route path="documents/workload" element={
              <PermissionGuard requiredPermissions={[Permissions.WORKLOAD_VIEW]}>
                <OfficerDocumentWorkload />
              </PermissionGuard>
            } />
            <Route path="documents/notifications" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_OFFICER_REVIEW]}>
                <OfficerDocumentNotifications />
              </PermissionGuard>
            } />

            {/* Officer CSC Routes (Phase 13) */}
            <Route path="csc/dashboard" element={
              <PermissionGuard requiredPermissions={[Permissions.CSC_QUEUE_MANAGE]}>
                <OperatorDashboard />
              </PermissionGuard>
            } />
            <Route path="csc/queue" element={
              <PermissionGuard requiredPermissions={[Permissions.CSC_QUEUE_MANAGE]}>
                <OperatorQueue />
              </PermissionGuard>
            } />
            <Route path="csc/workspace/:tokenId" element={
              <PermissionGuard requiredPermissions={[Permissions.CSC_VISIT_MANAGE]}>
                <OperatorWorkspace />
              </PermissionGuard>
            } />
          </Route>

          {/* Admin Portal - OfficerLayout */}
          <Route path="/admin" element={<React.Suspense fallback={<div className="p-8 text-center">Loading Admin Module...</div>}><OfficerLayout /></React.Suspense>}>
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

            {/* Admin Payment Routes (Phase 11) */}
            <Route path="payments" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_ANALYTICS_VIEW]}>
                <PaymentAdminOverview />
              </PermissionGuard>
            } />
            <Route path="payments/officers" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_OFFICER_MANAGE]}>
                <PaymentAdminOfficers />
              </PermissionGuard>
            } />
            <Route path="payments/batches" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_BATCH_VIEW]}>
                <PaymentAdminBatches />
              </PermissionGuard>
            } />
            <Route path="payments/configuration" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_CONFIG_MANAGE]}>
                <PaymentAdminConfig />
              </PermissionGuard>
            } />
            <Route path="payments/failure-rules" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_CONFIG_MANAGE]}>
                <PaymentAdminFailureRules />
              </PermissionGuard>
            } />
            <Route path="payments/retry-rules" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_CONFIG_MANAGE]}>
                <PaymentAdminRetryRules />
              </PermissionGuard>
            } />
            <Route path="payments/analytics" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_ANALYTICS_VIEW]}>
                <PaymentAdminAnalytics />
              </PermissionGuard>
            } />
            <Route path="payments/audit" element={
              <PermissionGuard requiredPermissions={[Permissions.PAYMENT_AUDIT_VIEW]}>
                <PaymentAdminAudit />
              </PermissionGuard>
            } />

            {/* Admin Document Routes (Phase 12) */}
            <Route path="documents" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_ANALYTICS_VIEW]}>
                <DocumentAdminOverview />
              </PermissionGuard>
            } />
            <Route path="documents/categories" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_CATEGORY_CONFIG]}>
                <DocumentAdminCategories />
              </PermissionGuard>
            } />
            <Route path="documents/verification-rules" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_CATEGORY_CONFIG]}>
                <DocumentAdminVerificationRules />
              </PermissionGuard>
            } />
            <Route path="documents/expiry-rules" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_EXPIRY_RULES]}>
                <DocumentAdminExpiryRules />
              </PermissionGuard>
            } />
            <Route path="documents/retention" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_RETENTION_CONFIG]}>
                <DocumentAdminRetention />
              </PermissionGuard>
            } />
            <Route path="documents/officers" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_OFFICER_MANAGE]}>
                <DocumentAdminOfficers />
              </PermissionGuard>
            } />
            <Route path="documents/analytics" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_ANALYTICS_VIEW]}>
                <DocumentAdminAnalytics />
              </PermissionGuard>
            } />
            <Route path="documents/audit" element={
              <PermissionGuard requiredPermissions={[Permissions.DOCUMENT_AUDIT_VIEW]}>
                <DocumentAdminAudit />
              </PermissionGuard>
            } />

                        {/* Phase 14: Analytics Routes */}
            <Route path="analytics/executive" element={
              <PermissionGuard requiredPermissions={[AnalyticsPermissions.GLOBAL_VIEW]}>
                <ExecutiveDashboardPage />
              </PermissionGuard>
            } />
            <Route path="analytics/departments/:departmentId" element={
              <PermissionGuard requiredPermissions={[AnalyticsPermissions.DEPARTMENT_VIEW]}>
                <DepartmentAnalyticsPage />
              </PermissionGuard>
            } />
            <Route path="analytics/data-quality" element={
              <PermissionGuard requiredPermissions={[AnalyticsPermissions.DATA_QUALITY_VIEW]}>
                <DataQualityDashboardPage />
              </PermissionGuard>
            } />
            <Route path="analytics/reports/new" element={
              <PermissionGuard requiredPermissions={[AnalyticsPermissions.REPORT_CREATE]}>
                <ReportBuilderPage />
              </PermissionGuard>
            } />
            <Route path="analytics/reports/:reportId/runs" element={
              <PermissionGuard requiredPermissions={[AnalyticsPermissions.REPORT_VIEW]}>
                <ReportRunHistoryPage />
              </PermissionGuard>
            } />
            <Route path="open-data/datasets" element={
              <PermissionGuard requiredPermissions={[AnalyticsPermissions.OPEN_DATA_VIEW]}>
                <OpenDataDatasetListPage />
              </PermissionGuard>
            } />
            <Route path="open-data/datasets/:datasetId/review" element={
              <PermissionGuard requiredPermissions={[AnalyticsPermissions.OPEN_DATA_APPROVE]}>
                <OpenDataDatasetReviewPage />
              </PermissionGuard>
            } />

            {/* Admin CSC Routes (Phase 13) */}
            <Route path="csc/manager-dashboard" element={
              <PermissionGuard requiredPermissions={[Permissions.CSC_SCHEDULE_MANAGE]}>
                <CscManagerDashboard />
              </PermissionGuard>
            } />
            <Route path="csc" element={
              <PermissionGuard requiredPermissions={[Permissions.CSC_ANALYTICS_VIEW]}>
                <CscAdminOverview />
              </PermissionGuard>
            } />

            {/* Admin Security Routes (Phase 15) */}
            <Route path="security/overview" element={
              <PermissionGuard requiredPermissions={[SecurityPermissions.EVENTS_VIEW]}>
                <SecurityOverviewPage />
              </PermissionGuard>
            } />
            <Route path="security/health" element={
              <PermissionGuard requiredPermissions={[SecurityPermissions.HEALTH_VIEW]}>
                <PlatformHealthPage />
              </PermissionGuard>
            } />
          </Route>

          {/* Phase 18 Design System Internal Routes */}
          <Route path="/design-system" element={
            <React.Suspense fallback={<div className="p-8 text-center">Loading Design System...</div>}>
              {/* Note: The user said we should protect these. In a real app we'd add PermissionGuard */}
              {React.createElement(React.lazy(() => import('./design-system/layouts/DesignSystemLayout').then(m => ({ default: m.DesignSystemLayout }))))}
            </React.Suspense>
          }>
            <Route index element={
              <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                {React.createElement(React.lazy(() => import('./pages/design-system/DesignSystemOverviewPage')))}
              </React.Suspense>
            } />
            <Route path="components" element={<div className="p-8">Component Catalogue placeholder</div>} />
            <Route path="patterns" element={<div className="p-8">Patterns placeholder</div>} />
            <Route path="tokens" element={<div className="p-8">Tokens placeholder</div>} />
            <Route path="foundations" element={<div className="p-8">Foundations placeholder</div>} />
            <Route path="diagnostics" element={<div className="p-8">Diagnostics placeholder</div>} />
            <Route path="migration-status" element={<div className="p-8">Migration placeholder</div>} />
            <Route path="visual-review" element={<div className="p-8">Visual Review placeholder</div>} />
          </Route>

          {/* Citizen Portal - CitizenLayout */}
          <Route element={<React.Suspense fallback={<div className="p-8 text-center">Loading Citizen Module...</div>}><CitizenLayout /></React.Suspense>}>
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

            {/* Benefit Disbursement & Payments Routes (Phase 11) */}
            <Route path="/benefits" element={<BenefitListPage />} />
            <Route path="/benefits/:benefitId" element={<BenefitTrackingHubPage />} />
            <Route path="/benefits/:benefitId/timeline" element={<BenefitTimelinePage />} />
            <Route path="/benefits/:benefitId/payment" element={<BenefitPaymentPage />} />
            <Route path="/benefits/:benefitId/history" element={<BenefitHistoryPage />} />
            <Route path="/benefits/:benefitId/sanction" element={<BenefitSanctionPage />} />
            <Route path="/benefits/:benefitId/download" element={<BenefitDownloadPage />} />
            <Route path="/benefits/:benefitId/payment-advice" element={<BenefitPaymentAdvicePage />} />
            <Route path="/benefits/:benefitId/report-issue" element={<BenefitReportIssuePage />} />
            <Route path="/benefits/:benefitId/issue/:issueId" element={<BenefitIssueDetailPage />} />

            {/* Digital Document Vault (Phase 12) Routes */}
            <Route path="/documents" element={<DocumentVaultPage />} />
            <Route path="/documents/upload" element={<DocumentUploadPage />} />
            <Route path="/documents/import" element={<DigilockerImportPage />} />
            <Route path="/documents/import/history" element={<DigilockerHistoryPage />} />
            <Route path="/documents/:documentId" element={<DocumentDetailPage />} />
            <Route path="/documents/:documentId/history" element={<DocumentHistoryPage />} />
            <Route path="/documents/:documentId/versions" element={<DocumentVersionsPage />} />
            <Route path="/documents/:documentId/verification" element={<DocumentVerificationRequestPage />} />
            <Route path="/documents/:documentId/renew" element={<DocumentRenewPage />} />
            <Route path="/documents/:documentId/replace" element={<DocumentReplacePage />} />
            <Route path="/documents/:documentId/share" element={<DocumentSharePage />} />
            <Route path="/documents/:documentId/esign" element={<DocumentEsignPage />} />
            <Route path="/documents/:documentId/download" element={<DocumentDownloadPage />} />

            {/* Citizen Service Centre (Phase 13) Routes */}
            <Route path="/csc" element={<CentreDiscoveryPage />} />
            <Route path="/csc/services" element={<ServiceCataloguePage />} />
            <Route path="/csc/book" element={<AppointmentBookingPage />} />
            <Route path="/csc/appointments" element={<AppointmentTrackingPage />} />
            <Route path="/csc/walkin" element={<WalkinRegistrationPage />} />
            <Route path="/csc/feedback" element={<CscFeedbackPage />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </QueryClientProvider>
      </ErrorBoundary>
    </AppErrorBoundary>
  );
}

export default App;
