
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProvidersWrapper } from '@/components/providers/ProvidersWrapper';
import { UnifiedSearchProvider } from "@/contexts/UnifiedSearchContext";
import { checkVersionAndPurgeStorage } from '@/utils/versionPurge';

// Import all pages
import Landing from '@/pages/Landing';
import Play from '@/pages/Play';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ArmyBuilder from '@/pages/ArmyBuilder';
import AboutUs from '@/pages/AboutUs';
import Rules from '@/pages/Rules';
import FAQ from '@/pages/FAQ';
import TermsOfService from '@/pages/TermsOfService';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Admin from '@/pages/Admin';
import Missions from '@/pages/Missions';
import Profile from '@/pages/Profile';
import ResetPassword from '@/pages/ResetPassword';
import UnitStats from '@/pages/UnitStats';
import Activity from '@/pages/Activity';
import NotFound from '@/pages/NotFound';

function App() {
  const [versionChecked, setVersionChecked] = useState(false);

  useEffect(() => {
    // Run version check as the very first thing - this is critical to prevent stale data
    const runVersionCheck = async () => {
      console.log('[App] 🔍 Running version check before app initialization...');
      try {
        const wasStoragePurged = await checkVersionAndPurgeStorage();
        if (!wasStoragePurged) {
          // Only continue if storage wasn't purged (which would reload the page)
          console.log('[App] ✅ Version check complete, proceeding with app initialization');
          setVersionChecked(true);
        }
        // If storage was purged, the page will reload and this component will unmount
      } catch (error) {
        console.error('[App] ❌ Version check failed, continuing with app load:', error);
        setVersionChecked(true);
      }
    };

    runVersionCheck();
  }, []);

  // Don't render the app until version check is complete
  if (!versionChecked) {
    return (
      <div className="min-h-screen bg-warcrow-background flex items-center justify-center">
        <div className="text-warcrow-text">Loading...</div>
      </div>
    );
  }

  return (
    <ProvidersWrapper>
      <LanguageProvider>
        <AuthProvider>
          <UnifiedSearchProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/play" element={<Play />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/builder" element={<ArmyBuilder />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/unit-stats" element={<UnitStats />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </UnifiedSearchProvider>
        </AuthProvider>
      </LanguageProvider>
    </ProvidersWrapper>
  );
}

export default App;
