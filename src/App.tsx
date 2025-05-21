
import * as React from 'react';
import { ProvidersWrapper } from "@/components/providers/ProvidersWrapper";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { Toaster as SonnerToaster } from "sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useEnvironment } from '@/hooks/useEnvironment';
import { checkVersionAndPurgeStorage } from '@/utils/storageUtils';

function App() {
  const { isPreview } = useEnvironment();

  // Debug function to manually purge storage in development
  const handleDebugPurge = React.useCallback(() => {
    const fakeChangelog = `# Changelog\n\n## [999.999.999]`;
    checkVersionAndPurgeStorage(fakeChangelog, true);
    // Force reload the page
    window.location.reload();
  }, []);

  return (
    <div className="dark">
      <ProvidersWrapper>
        <LanguageProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </LanguageProvider>
      </ProvidersWrapper>
      
      {/* Debug controls for development only */}
      {isPreview && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={handleDebugPurge}
            className="bg-red-600/90 hover:bg-red-700 text-white text-xs rounded px-2 py-1 shadow"
          >
            Debug: Purge Storage
          </button>
        </div>
      )}
      
      <SonnerToaster 
        theme="dark" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            color: '#e0e0e0'
          }
        }}
      />
    </div>
  );
}

export default App;
