
import * as React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GameProvider } from "@/context/GameContext";

import Index from './pages/Index';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Rules from './pages/Rules';
import Missions from './pages/Missions';
import Mail from './pages/Mail';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';
import UnitStats from './pages/UnitStats';
import Play from './pages/Play';
import Setup from './pages/Setup';
import Deployment from './pages/Deployment';
import Game from './pages/Game';
import Summary from './pages/Summary';
import NotFound from './pages/NotFound';

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
  const [isTester, setIsTester] = React.useState(false);
  const isPreview = window.location.hostname === 'lovableproject.com' || 
                   window.location.hostname.endsWith('.lovableproject.com');

  React.useEffect(() => {
    const setupAuth = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');
      const accessToken = hashParams.get('access_token');
      
      if (type === 'recovery' && accessToken) {
        console.log('Password recovery flow detected');
        setIsPasswordRecovery(true);
        setIsAuthenticated(false);
        if (!window.location.pathname.includes('reset-password')) {
          window.location.href = '/reset-password' + window.location.hash;
        }
        return;
      }

      if (isPreview) {
        console.log('Preview mode detected, setting as authenticated and tester');
        setIsAuthenticated(true);
        setIsTester(true);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      console.log('Auth session check:', session ? 'Authenticated' : 'Not authenticated');
      setIsAuthenticated(!!session);
      
      if (session) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('tester')
            .eq('id', session.user.id)
            .single();
          
          setIsTester(!!data?.tester);
          console.log('Tester role check:', data?.tester ? 'Tester' : 'Not tester');
        } catch (error) {
          console.error('Error checking tester status:', error);
        }
      }
      
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

      if (!isPasswordRecovery) {
        setIsAuthenticated(!!session);
        
        if (session) {
          // Fixed: properly handle the Promise chain
          supabase
            .from('profiles')
            .select('tester')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              setIsTester(!!data?.tester);
            })
            .catch(error => {
              console.error('Error checking tester status:', error);
              setIsTester(false);
            });
        } else {
          setIsTester(false);
        }
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
          <GameProvider>
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
                      <Navigate to="/landing" replace />
                    ) : (
                      <Login onGuestAccess={() => {
                        setIsGuest(true);
                        return <Navigate to="/landing" replace />;
                      }} />
                    )
                  } 
                />
                <Route 
                  path="/" 
                  element={<Navigate to="/landing" replace />} 
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
                  path="/rules" 
                  element={<Rules />} 
                />
                <Route 
                  path="/missions" 
                  element={<Missions />} 
                />
                <Route 
                  path="/mail" 
                  element={
                    isPreview || isAuthenticated ? (
                      <Mail />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    (isPreview || (isAuthenticated && isTester && !isGuest)) ? (
                      <Profile />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  } 
                />
                <Route 
                  path="/unit-stats" 
                  element={
                    isPreview || isAuthenticated ? (
                      <UnitStats />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  } 
                />
                <Route 
                  path="/play" 
                  element={
                    isPreview || isAuthenticated ? (
                      <Play />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  } 
                />
                <Route 
                  path="/setup" 
                  element={
                    isPreview || isAuthenticated ? (
                      <Setup />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  } 
                />
                <Route 
                  path="/deployment" 
                  element={
                    isPreview || isAuthenticated ? (
                      <Deployment />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  } 
                />
                <Route 
                  path="/game" 
                  element={
                    isPreview || isAuthenticated ? (
                      <Game />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  } 
                />
                <Route 
                  path="/summary" 
                  element={
                    isPreview || isAuthenticated ? (
                      <Summary />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  } 
                />
                <Route 
                  path="/about" 
                  element={<AboutUs />} 
                />
                <Route 
                  path="*" 
                  element={<NotFound />} 
                />
              </Routes>
              <Toaster />
              <Sonner />
            </Router>
          </GameProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.Suspense>
  );
}

export default App;
