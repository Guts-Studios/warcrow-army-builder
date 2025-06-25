
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import ArmyBuilder from "./pages/ArmyBuilder";
import Account from "./pages/Account";
import { checkAndPurgeIfNeeded, emergencyCacheClear } from "@/utils/versionPurge";
import { useEffect } from "react";

// Initialize query client with aggressive cache invalidation for data consistency
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Always fetch fresh data for critical data issues
      gcTime: 1000 * 60, // Keep in cache for only 1 minute
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      retry: 3,
    },
  },
});

function App() {
  useEffect(() => {
    // CRITICAL: Handle data consistency issues on app startup
    console.log('[App] 🚀 Starting app with data validation...');
    
    // Check for cache issues and purge if needed
    checkAndPurgeIfNeeded();
    
    // If URL has emergency cache clear parameter, do emergency clear
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('emergencyReset') === 'true') {
      console.log('[App] 🚨 Emergency reset requested via URL parameter');
      emergencyCacheClear().then(() => {
        // Remove the parameter and reload
        urlParams.delete('emergencyReset');
        const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
        window.history.replaceState({}, '', newUrl);
        window.location.reload();
      });
    }
    
    // Add global error handler for data validation
    window.addEventListener('error', (event) => {
      if (event.message.includes('CRITICAL DATA MISMATCH')) {
        console.error('[App] 🚨 Critical data error detected:', event);
      }
    });
    
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/army-builder" element={<ArmyBuilder />} />
                <Route path="/account" element={<Account />} />
              </Routes>
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
