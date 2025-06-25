
import React, { useState, useEffect } from 'react';
import { useCacheDiagnostics } from '@/hooks/useCacheDiagnostics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Download } from 'lucide-react';

export const PWAUpdatePrompt: React.FC = () => {
  const { clearStaleAuthData, quickCacheOptimization, clearAllCachesAndReload } = useCacheDiagnostics();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          if (registration.waiting) {
            setUpdateAvailable(true);
          }
        });
      });
    }

    // Check if app is installable
    window.addEventListener('beforeinstallprompt', () => {
      setIsInstallable(true);
    });
  }, []);

  const handleUpdate = async () => {
    console.log('[PWAUpdatePrompt] Handling app update...');
    
    // Clear stale data
    await clearStaleAuthData();
    
    // Optimize cache
    quickCacheOptimization();
    
    // Force reload to get the latest version
    window.location.reload();
  };

  const handleInstall = () => {
    console.log('[PWAUpdatePrompt] Handling app install...');
    // Implementation would depend on stored install prompt event
  };

  const handleEmergencyReset = async () => {
    console.log('[PWAUpdatePrompt] Emergency reset requested...');
    await clearAllCachesAndReload();
  };

  if (!updateAvailable && !isInstallable) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-black/90 border-warcrow-gold/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-warcrow-gold text-sm flex items-center gap-2">
          {updateAvailable && <RefreshCw className="h-4 w-4" />}
          {isInstallable && <Download className="h-4 w-4" />}
          {updateAvailable ? 'Update Available' : 'Install App'}
        </CardTitle>
        <CardDescription className="text-xs">
          {updateAvailable 
            ? 'A new version of the app is available' 
            : 'Install this app for a better experience'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          {updateAvailable && (
            <Button size="sm" onClick={handleUpdate} className="flex-1">
              Update
            </Button>
          )}
          {isInstallable && (
            <Button size="sm" onClick={handleInstall} variant="outline" className="flex-1">
              Install
            </Button>
          )}
        </div>
        {updateAvailable && (
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={handleEmergencyReset}
            className="w-full mt-2 text-xs"
          >
            Emergency Reset
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
