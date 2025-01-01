import * as React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Index from './pages/Index';
import Landing from './pages/Landing';
import Login from './pages/Login';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const isPreview = window.location.hostname.includes('lovableproject.com');

  React.useEffect(() => {
    if (isPreview) {
      console.log('Preview mode detected, setting as authenticated');
      setIsAuthenticated(true);
      return;
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Auth session check:', session ? 'Authenticated' : 'Not authenticated');
      setIsAuthenticated(!!session);
      
      if (!session) {
        toast.warning(
          "You are in offline mode. Cloud features like saving lists will not be available.",
          {
            duration: 5000,
          }
        );
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session ? 'Authenticated' : 'Not authenticated');
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [isPreview]);

  if (isAuthenticated === null && !isPreview) {
    return <div>Loading...</div>;
  }

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router>
            <Routes>
              <Route 
                path="/login" 
                element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
              />
              <Route 
                path="/" 
                element={
                  isPreview ? (
                    <Landing />
                  ) : (
                    isAuthenticated ? <Landing /> : <Navigate to="/login" replace />
                  )
                } 
              />
              <Route 
                path="/builder" 
                element={
                  isPreview ? (
                    <Index />
                  ) : (
                    isAuthenticated ? <Index /> : <Navigate to="/login" replace />
                  )
                } 
              />
              <Route 
                path="*" 
                element={<Navigate to="/" replace />} 
              />
            </Routes>
            <Toaster />
            <Sonner />
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </React.Suspense>
  );
}

export default App;