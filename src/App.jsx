
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { EntitlementsProvider } from './hooks/useEntitlements';
import ExpiryBanner from './components/ExpiryBanner/ExpiryBanner';
import Login from './pages/Login/Login';
import Integration from './pages/Integration/Integration';
import Dashboard from './pages/Dashboard/Dashboard';
import GenerateEdit from './pages/GenerateEdit/GenerateEdit';
import Settings from './pages/Settings/Settings';
import LandingPage from './pages/Landing/LandingPage';
import PricingPage from './pages/Pricing/PricingPage';
import DocsPage from './pages/Docs/DocsPage';
import PrivacyPage from './pages/Privacy/PrivacyPage';
import TermsPage from './pages/Terms/TermsPage';
import SupportPage from './pages/Support/SupportPage';
import IntegrationLanding from './pages/IntegrationLanding/IntegrationLanding';
import JiraLanding from './pages/IntegrationLanding/JiraLanding';
import GitHubLanding from './pages/IntegrationLanding/GitHubLanding';
import SlackLanding from './pages/IntegrationLanding/SlackLanding';
import LinearLanding from './pages/IntegrationLanding/LinearLanding';
import AsanaLanding from './pages/IntegrationLanding/AsanaLanding';
import ClickUpLanding from './pages/IntegrationLanding/ClickUpLanding';
import MondayLanding from './pages/IntegrationLanding/MondayLanding';
import IntegrationsPage from './pages/Integrations/IntegrationsPage';
import PublicNote from './pages/PublicNote/PublicNote';
import Changelog from './pages/Changelog/Changelog';
import Signup from './pages/Signup/Signup';
import VerifyOtp from './pages/VerifyOtp/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import { Toaster } from 'react-hot-toast';
import './App.css';

/* Layout wrapper for authenticated pages — sidebar + main area */
function AppShell() {
  return (
    <EntitlementsProvider>
      <div className="app-shell">
        <Sidebar />
        <div className="app-main">
          <ExpiryBanner />
          <Outlet />
        </div>
      </div>
    </EntitlementsProvider>
  );
}

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'var(--font)',
            fontSize: '0.9375rem',
            borderRadius: '10px',
            padding: '10px 16px',
          },
          success: {
            duration: 3000,
            iconTheme: { primary: 'var(--emerald)', secondary: '#fff' },
          },
          error: {
            duration: 4000,
            iconTheme: { primary: 'var(--rose)', secondary: '#fff' },
          },
        }}
      />
      <Routes>
        {/* Public routes — no sidebar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/integrations/devrev" element={<IntegrationLanding />} />
        <Route path="/integrations/jira" element={<JiraLanding />} />
        <Route path="/integrations/github" element={<GitHubLanding />} />
        <Route path="/integrations/slack" element={<SlackLanding />} />
        <Route path="/integrations/linear" element={<LinearLanding />} />
        <Route path="/integrations/asana" element={<AsanaLanding />} />
        <Route path="/integrations/clickup" element={<ClickUpLanding />} />
        <Route path="/integrations/monday" element={<MondayLanding />} />
        <Route path="/n/:slug" element={<PublicNote />} />

        {/* Authenticated routes — sidebar layout */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/integration" element={<ProtectedRoute><Integration /></ProtectedRoute>} />
          <Route path="/generate" element={<ProtectedRoute><GenerateEdit /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/changelog/:userId" element={<ProtectedRoute><Changelog /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
