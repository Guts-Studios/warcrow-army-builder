import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from "@/components/auth/AuthProvider";

// Import all page components
import Index from '@/pages/Index';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import ResetPassword from '@/pages/ResetPassword';
import Rules from '@/pages/Rules';
import Missions from '@/pages/Missions';
import Mail from '@/pages/Mail';
import Profile from '@/pages/Profile';
import AboutUs from '@/pages/AboutUs';
import UnitStats from '@/pages/UnitStats';
import Play from '@/pages/Play';
import Setup from '@/pages/Setup';
import Deployment from '@/pages/Deployment';
import Game from '@/pages/Game';
import Summary from '@/pages/Summary';
import NotFound from '@/pages/NotFound';
import SharedList from "@/pages/SharedList";

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, isGuest, isPasswordRecovery, isTester } = useAuth();
  
  // Determine if we should show a loading state
  const isLoading = isAuthenticated === null && 
    !window.location.hostname.endsWith('.lovableproject.com') && 
    !isPasswordRecovery;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isPreview = window.location.hostname === 'lovableproject.com' || 
                   window.location.hostname.endsWith('.lovableproject.com');

  return (
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
            <Login onGuestAccess={() => {}} />
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
        path="/shared-list/:listCode" 
        element={<SharedList />} 
      />
      <Route 
        path="*" 
        element={<NotFound />} 
      />
    </Routes>
  );
};

export default AppRoutes;
