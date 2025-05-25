
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SupabaseProvider } from "@/integrations/supabase/components/SupabaseProvider";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import LoadingSpinner from "./components/LoadingSpinner";
import { SessionContextProvider } from '@supabase/auth-helpers-react';

// Lazy load components
const ArmyBuilderPage = lazy(() => import("./pages/ArmyBuilder"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const UnitExplorer = lazy(() => import("./pages/UnitExplorer"));
const RulesPage = lazy(() => import("./pages/Rules"));
const AdminPage = lazy(() => import("./pages/Admin"));
const UnitValidationPage = lazy(() => import("./pages/admin/unit-validation"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        console.log('Query failed, attempt:', failureCount, error);
        return failureCount < 2;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <SupabaseProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/army-builder" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ArmyBuilderPage />
                    </Suspense>
                  } />
                  <Route path="/army-builder/:factionId" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ArmyBuilderPage />
                    </Suspense>
                  } />
                  <Route path="/profile" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ProfilePage />
                    </Suspense>
                  } />
                  <Route path="/profile/:wabId" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ProfilePage />
                    </Suspense>
                  } />
                  <Route path="/units" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <UnitExplorer />
                    </Suspense>
                  } />
                  <Route path="/rules" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <RulesPage />
                    </Suspense>
                  } />
                  <Route path="/admin" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminPage />
                    </Suspense>
                  } />
                  <Route path="/admin/unit-validation" element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <UnitValidationPage />
                    </Suspense>
                  } />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </LanguageProvider>
        </SupabaseProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;
