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
import ResetPassword from './pages/ResetPassword';

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
  const [isGuest, setIsGuest] = React.useState(false);
  const [isPasswordRecovery, setIsPasswordRecovery] = React.useState(false);
  const isPreview = window.location.hostname === 'lovableproject.com' || 
                   window.location.hostname.endsWith('.lovableproject.com');

  React.useEffect(() => {
    const setupAuth = async () => {
      // Check if we're in a password recovery flow
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');
      
      if (type === 'recovery') {
        console.log('Password recovery flow detected');
        setIsPasswordRecovery(true);
        setIsAuthenticated(false);
        return;
      }

      if (isPreview) {
        console.log('Preview mode detected, setting as authenticated');
        setIsAuthenticated(true);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      console.log('Auth session check:', session ? 'Authenticated' : 'Not authenticated');
      setIsAuthenticated(!!session);
      
      if (!session && !isPreview) {
        toast.warning(
          "You are in offline mode. Cloud features like saving lists will not be available.",
          {
            duration: 5000,
          }
        );
      }
    };

    setupAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event triggered:', {
        event,
        sessionExists: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email
      });

      if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery event detected');
        setIsPasswordRecovery(true);
        setIsAuthenticated(false);
        return;
      }

      // Don't update auth state during password recovery
      if (!isPasswordRecovery) {
        setIsAuthenticated(!!session);
      }
    });

    return () => subscription.unsubscribe();
  }, [isPreview, isPasswordRecovery]);

  if (isAuthenticated === null && !isPreview && !isPasswordRecovery) {
    return <div>Loading...</div>;
  }

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router>
            <Routes>
              <Route 
                path="/reset-password" 
                element={<ResetPassword />} 
              />
              <Route 
                path="/login" 
                element={
                  isAuthenticated && !isPasswordRecovery ? (
                    <Navigate to="/builder" replace />
                  ) : (
                    <Login onGuestAccess={() => setIsGuest(true)} />
                  )
                } 
              />
              <Route 
                path="/" 
                element={<Navigate to="/builder" replace />} 
              />
              <Route 
                path="/landing" 
                element={<Landing />} 
              />
              <Route 
                path="/builder" 
                element={
                  isPreview || isAuthenticated || isGuest ? (
                    <Index />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              <Route 
                path="*" 
                element={<Navigate to="/landing" replace />} 
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