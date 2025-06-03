
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProvidersWrapper } from '@/components/providers/ProvidersWrapper';
import { UnifiedSearchProvider } from "@/contexts/UnifiedSearchContext";
import { checkVersionAndPurgeStorage } from '@/utils/versionPurge';
import { AppRoutes } from '@/components/routing/AppRoutes';

function App() {
  const [versionChecked, setVersionChecked] = useState(false);

  // Force redirect to canonical domain only in production
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('localhost:') || hostname.startsWith('127.0.0.1:');
    const isLovablePreview = hostname.includes('lovableproject.com') || hostname.endsWith('.lovableproject.com') || hostname.includes('lovable.app');
    const isCanonicalDomain = hostname === 'warcrowarmy.com' || hostname === 'www.warcrowarmy.com';
    
    // Only redirect if:
    // 1. Not on localhost/development
    // 2. Not on Lovable preview domains
    // 3. Not already on canonical domain
    // 4. Actually on a Netlify domain that needs redirecting
    const isNetlifyDomain = hostname.includes('netlify.app') || hostname.includes('netlify.com');
    
    if (!isLocalhost && !isLovablePreview && !isCanonicalDomain && isNetlifyDomain) {
      console.log('[App] Redirecting to canonical domain warcrowarmy.com from:', hostname);
      window.location.replace(
        `https://warcrowarmy.com${window.location.pathname}${window.location.search}${window.location.hash}`
      );
      return; // Exit early since we're redirecting
    }
    
    console.log('[App] No redirect needed, running on:', hostname);
  }, []);

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
            <AppRoutes />
            <Toaster />
          </UnifiedSearchProvider>
        </AuthProvider>
      </LanguageProvider>
    </ProvidersWrapper>
  );
}

export default App;
