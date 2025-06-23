
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProvidersWrapper } from '@/components/providers/ProvidersWrapper';
import { UnifiedSearchProvider } from "@/contexts/UnifiedSearchContext";
import { checkAndPurgeIfNeeded } from '@/utils/versionPurge';
import { AppRoutes } from '@/components/routing/AppRoutes';
import { PWAUpdatePrompt } from '@/components/pwa/PWAUpdatePrompt';
import { PerformanceOptimizer } from '@/components/performance/PerformanceOptimizer';

function App() {
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    // Check version and purge stale cache if needed (preserves auth & army lists)
    console.log('[App] 🚀 Checking for stale cache on startup...');
    
    // Quick performance check - if localStorage is very large, optimize it
    const storageSize = JSON.stringify(localStorage).length;
    if (storageSize > 3 * 1024 * 1024) { // > 3MB
      console.warn('[App] ⚠️ Large localStorage detected, running quick cleanup...');
      
      // Clear any obvious temporary data
      Object.keys(localStorage).forEach(key => {
        if (key.includes('temp') || key.includes('cache') || key.includes('query')) {
          localStorage.removeItem(key);
        }
      });
    }
    
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
            <PWAUpdatePrompt />
            <PerformanceOptimizer />
          </UnifiedSearchProvider>
        </AuthProvider>
      </LanguageProvider>
    </ProvidersWrapper>
  );
}

export default App;
