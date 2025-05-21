
import * as React from 'react';
import { ProvidersWrapper } from "@/components/providers/ProvidersWrapper";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { Toaster as SonnerToaster } from "sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useEnvironment } from '@/hooks/useEnvironment';
import { checkVersionAndPurgeStorage, clearInvalidTokens } from '@/utils/storageUtils';
import { SessionValidator } from '@/components/auth/SessionValidator';

function App() {
  const { isPreview } = useEnvironment();
  const [isRecoveryMode, setIsRecoveryMode] = React.useState<boolean>(false);

  // If the app has been loading for more than 5 seconds, show a recovery button
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsRecoveryMode(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Debug function to manually purge storage in development
  const handleDebugPurge = React.useCallback(() => {
    const fakeChangelog = `# Changelog\n\n## [999.999.999]`;
    checkVersionAndPurgeStorage(fakeChangelog, true);
    // Force reload the page
    window.location.reload();
  }, []);
  
  // Recovery function for users experiencing issues
  const handleRecoverSession = React.useCallback(() => {
    // Clear any invalid tokens
    clearInvalidTokens();
    
    // Force a complete storage purge
    const fakeChangelog = `# Changelog\n\n## [999.999.999]`;
    checkVersionAndPurgeStorage(fakeChangelog, true);
    
    // Force reload after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }, []);

  return (
    <div className="dark">
      <ProvidersWrapper>
        <LanguageProvider>
          <AuthProvider>
            <SessionValidator>
              <AppRoutes />
            </SessionValidator>
          </AuthProvider>
        </LanguageProvider>
      </ProvidersWrapper>
      
      {/* Debug and recovery controls */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {/* Show recovery button for all users */}
        {isRecoveryMode && (
          <button
            onClick={handleRecoverSession}
            className="bg-blue-600/90 hover:bg-blue-700 text-white text-xs rounded px-2 py-1 shadow"
          >
            Having trouble? Click to fix
          </button>
        )}
        
        {/* Debug controls for development only */}
        {isPreview && (
          <button
            onClick={handleDebugPurge}
            className="bg-red-600/90 hover:bg-red-700 text-white text-xs rounded px-2 py-1 shadow"
          >
            Debug: Purge Storage
          </button>
        )}
      </div>
      
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
