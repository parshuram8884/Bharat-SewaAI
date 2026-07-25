import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';

// Assistant Pages
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
import { SchemeDocumentsPage, SchemeApplicationHandoffPage } from './pages/schemes/SchemePagesExtended';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-neutral-950 flex flex-col font-sans">
          <Navbar />
          <div className="flex-1 flex overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-y-auto">
              <Routes>
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
                <Route path="/schemes/:schemeId/apply" element={<SchemeApplicationHandoffPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
