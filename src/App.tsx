import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const isPreview = window.location.hostname.includes('lovableproject.com');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (!session && !isPreview) {
        toast.warning(
          "You are in offline mode. Cloud features like saving lists will not be available.",
          {
            duration: 5000,
          }
        );
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [isPreview]);

  if (isAuthenticated === null && !isPreview) {
    return null; // or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Routes>
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
              element={<Index />} 
            />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
            />
            {/* Catch all route - redirect to login if not authenticated, home if authenticated */}
            <Route 
              path="*" 
              element={
                isPreview ? (
                  <Navigate to="/" replace />
                ) : (
                  isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
                )
              } 
            />
          </Routes>
          <Toaster />
          <Sonner />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;