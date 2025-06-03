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
    
    // Production domains that should NOT redirect
    const productionDomains = [
      'warcrowarmy.com',
      'www.warcrowarmy.com'
    ];
    
    // Development/preview domains that should NOT redirect
    const developmentDomains = [
      'localhost',
      '127.0.0.1'
    ];
    
    // Lovable/preview domains that should NOT redirect
    const isLovablePreview = hostname.includes('lovableproject.com') || 
                            hostname.endsWith('.lovableproject.com') ||
                            hostname.includes('lovable.app') ||
                            hostname.includes('id-preview');
    
    // Check if we're on a domain that should not redirect
    const shouldNotRedirect = 
      productionDomains.some(domain => hostname === domain) ||
      developmentDomains.some(domain => hostname === domain || hostname.startsWith(domain)) ||
      isLovablePreview;
    
    // Only redirect if we're NOT on an exempt domain
    if (!shouldNotRedirect) {
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
