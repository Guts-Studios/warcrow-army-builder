
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UnifiedSearchProvider } from "@/contexts/UnifiedSearchContext";
import LoadingSpinner from '@/components/LoadingSpinner';

// Core pages that should load immediately
import Landing from '@/pages/Landing';
import Index from '@/pages/Index';
const Play = lazy(() => import('@/pages/Play'));
const SharedList = lazy(() => import('@/pages/SharedList'));
const Setup = lazy(() => import('@/pages/Setup'));
const Deployment = lazy(() => import('@/pages/Deployment'));
const Game = lazy(() => import('@/pages/Game'));
const Scoring = lazy(() => import('@/pages/Scoring'));
const Summary = lazy(() => import('@/pages/Summary'));
const Profile = lazy(() => import('@/pages/Profile'));
const Missions = lazy(() => import('@/pages/Missions'));
const UnitStats = lazy(() => import('@/pages/UnitStats'));
const Activity = lazy(() => import('@/pages/Activity'));
const Login = lazy(() => import('@/pages/Login'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const Rules = lazy(() => import('@/pages/Rules'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const AboutUs = lazy(() => import('@/pages/AboutUs'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Mail = lazy(() => import('@/pages/Mail'));

// Admin pages - these are heavy and rarely used
const Admin = lazy(() => import('@/pages/Admin'));
const AdminAlerts = lazy(() => import('@/pages/AdminAlerts'));
const DeveloperOptions = lazy(() => import('@/pages/DeveloperOptions'));
const DeploymentManagement = lazy(() => import('@/pages/DeploymentManagement'));
const ChangelogEditor = lazy(() => import('@/pages/ChangelogEditor'));
const ValidateCsvPage = lazy(() => import('@/app/admin/validate-csv/page'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-warcrow-background flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/builder" element={<Index />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/unit-stats" element={<UnitStats />} />
        <Route path="/game" element={<Game />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/play" element={<Play />} />
        <Route path="/play/:gameId" element={<Play />} />
        <Route path="/deployment" element={<Deployment />} />
        <Route path="/deployment/:gameId" element={<Deployment />} />
        <Route path="/scoring" element={<Scoring />} />
        <Route path="/scoring/:gameId" element={<Scoring />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/summary/:gameId" element={<Summary />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/mail" element={<Mail />} />
        <Route path="/shared-list/:listCode" element={<SharedList />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/alerts" element={<AdminAlerts />} />
        <Route path="/admin/deployment" element={<DeploymentManagement />} />
        <Route path="/admin/changelog" element={<ChangelogEditor />} />
        <Route path="/admin/dev-options" element={<DeveloperOptions />} />
        <Route path="/admin/validate-csv" element={<ValidateCsvPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
