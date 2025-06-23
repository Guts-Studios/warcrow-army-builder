
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
    // Async function to handle storage check without blocking
    const initializeStorage = async () => {
      console.log('[App] 🚀 Quick storage check...');
      
      try {
        // Quick storage size check - don't block on large cleanups
        const storageSize = JSON.stringify(localStorage).length;
        if (storageSize > 3 * 1024 * 1024) { // > 3MB
          console.warn('[App] ⚠️ Large localStorage detected');
          
          // Do a quick cleanup of obvious temp data only
          const tempKeys = Object.keys(localStorage).filter(key => 
            key.includes('temp') || key.includes('cache') || key.includes('query')
          );
          
          // Only clear if there are obvious temp keys and not too many
          if (tempKeys.length > 0 && tempKeys.length < 20) {
            tempKeys.forEach(key => localStorage.removeItem(key));
            console.log(`[App] 🧹 Cleared ${tempKeys.length} temp keys`);
          }
        }
        
        // Run version check asynchronously without blocking
        checkAndPurgeIfNeeded();
        
      } catch (error) {
        console.warn('[App] ⚠️ Storage check error:', error);
      } finally {
        // Always mark as ready to not block the app
        setStorageReady(true);
      }
    };

    initializeStorage();
  }, []);

  // Don't block app loading on storage check - just show a minimal loader
  if (!storageReady) {
    return (
      <div className="min-h-screen bg-warcrow-background flex items-center justify-center">
        <div className="text-warcrow-text text-sm">Loading...</div>
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
