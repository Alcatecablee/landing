import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/providers/AuthProvider";
import Index from "./pages/Index";
import AppPage from "./pages/AppPage";
import TestSuite from "./pages/TestSuite";
import Docs from "./pages/Docs";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";

import TeamDashboard from "./pages/TeamDashboard";
import TeamSettings from "./pages/TeamSettings";
import LiveCollaboration from "./pages/LiveCollaboration";
import EnhancedTeamDashboard from "./pages/EnhancedTeamDashboard";
import LiveCodeSessions from "./pages/LiveCodeSessions";
import TeamAnalytics from "./pages/TeamAnalytics";
import SSOIntegration from "./pages/enterprise/SSOIntegration";
import WebhookSystem from "./pages/enterprise/WebhookSystem";
import EnterpriseAnalytics from "./pages/enterprise/EnterpriseAnalytics";
import AdvancedAI from "./pages/enterprise/AdvancedAI";
import MarketPositioning from "./pages/enterprise/MarketPositioning";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTest from "./pages/AdminTest";
import Dashboard from "./pages/Dashboard";
import SupabaseTest from "./pages/SupabaseTest";
import APIDocumentation from "./pages/APIDocumentation";
import CLIDocumentation from "./pages/CLIDocumentation";
import VSCodeDocumentation from "./pages/VSCodeDocumentation";
import { Billing } from "./pages/Billing";
import { ProtectedApp } from "./pages/ProtectedApp";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/AppLayout";
import { History } from "./pages/History";
import NotFound from "./pages/NotFound";
import Enterprise from "./pages/Enterprise";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";

import ScrollToTop from "./components/ScrollToTop";
import { InfoWidget } from "./components/InfoWidget";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* Skip link for keyboard navigation */}
          <a
            href="#main-content"
            className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[9999] bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-all duration-200"
          >
            Skip to main content
          </a>

          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Protected App Routes - No Header/Footer */}
              <Route path="/app" element={<ProtectedApp />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/billing"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Billing />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teams"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <EnhancedTeamDashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/team/settings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TeamSettings />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team/collaborate"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <LiveCollaboration />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team/analytics"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TeamAnalytics />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <History />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Live Code Sessions - No Header/Footer */}
              <Route
                path="/team/live-sessions"
                element={
                  <div className="min-h-screen bg-black text-white">
                    <main id="main-content" className="relative">
                      <LiveCodeSessions />
                    </main>
                  </div>
                }
              />

              {/* Public Routes - With Header/Footer */}
              <Route
                path="/*"
                element={
                  <div className="min-h-screen bg-black text-white">
                    <SiteHeader />
                    <main id="main-content" className="relative">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/test" element={<TestSuite />} />
                        <Route path="/docs" element={<Docs />} />
                        <Route
                          path="/api-docs"
                          element={<APIDocumentation />}
                        />
                        <Route
                          path="/cli-docs"
                          element={<CLIDocumentation />}
                        />
                        <Route
                          path="/vs-docs"
                          element={<VSCodeDocumentation />}
                        />
                        <Route path="/features" element={<Features />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/enterprise" element={<Enterprise />} />
                        <Route path="/admin-test" element={<AdminTest />} />
                        <Route
                          path="/supabase-test"
                          element={<SupabaseTest />}
                        />

                        <Route
                          path="/enterprise/sso"
                          element={<SSOIntegration />}
                        />
                        <Route
                          path="/enterprise/webhooks"
                          element={<WebhookSystem />}
                        />
                        <Route
                          path="/enterprise/analytics"
                          element={<EnterpriseAnalytics />}
                        />
                        <Route path="/enterprise/ai" element={<AdvancedAI />} />
                        <Route
                          path="/enterprise/market"
                          element={<MarketPositioning />}
                        />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <SiteFooter />
                    <InfoWidget />
                  </div>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
