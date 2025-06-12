
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProvidersWrapper } from '@/components/providers/ProvidersWrapper';
import { UnifiedSearchProvider } from "@/contexts/UnifiedSearchContext";
import { checkAndPurgeIfNeeded } from '@/utils/versionPurge';
import { AppRoutes } from '@/components/routing/AppRoutes';

function App() {
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    // Check version and purge stale cache if needed (preserves auth & army lists)
    console.log('[App] 🚀 Checking for stale cache on startup...');
    checkAndPurgeIfNeeded();
    setStorageReady(true);
  }, []);

  // Don't render the app until storage check is complete
  if (!storageReady) {
    return (
      <div className="min-h-screen bg-warcrow-background flex items-center justify-center">
        <div className="text-warcrow-text">Initializing...</div>
      </div>
    );
  }

  return (
    <ProvidersWrapper>
      <LanguageProvider>
        <AuthProvider>
          <UnifiedSearchProvider>
            <AppRoutes />
            <Toaster />
          </UnifiedSearchProvider>
        </AuthProvider>
      </LanguageProvider>
    </ProvidersWrapper>
  );
}

export default App;
