import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./store/hooks";
import Login from "./pages/Login";
import SyndicDashboard from "./pages/SyndicDashboard";
import CoOwnerDashboard from "./pages/CoOwnerDashboard";
import Owners from "./pages/Owners";
import Properties from "./pages/Properties";
import Assemblies from "./pages/Assemblies";
import VotingPage from "./pages/VotingPage";
import Finances from "./pages/Finances";
import Proxies from "./pages/Proxies";
import Maintenance from "./pages/Maintenance";
import Documents from "./pages/Documents";
import Signatures from "./pages/Signatures";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const DashboardRouter = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  if (user?.role === 'syndic') {
    return <SyndicDashboard />;
  }
  
  return <CoOwnerDashboard />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owners"
            element={
              <ProtectedRoute allowedRoles={['syndic']}>
                <Owners />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties"
            element={
              <ProtectedRoute allowedRoles={['syndic']}>
                <Properties />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assemblies"
            element={
              <ProtectedRoute>
                <Assemblies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assemblies/:assemblyID/vote"
            element={
              <ProtectedRoute>
                <VotingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finances"
            element={
              <ProtectedRoute allowedRoles={['syndic']}>
                <Finances />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proxies"
            element={
              <ProtectedRoute>
                <Proxies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance"
            element={
              <ProtectedRoute allowedRoles={['syndic']}>
                <Maintenance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signatures"
            element={
              <ProtectedRoute>
                <Signatures />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
