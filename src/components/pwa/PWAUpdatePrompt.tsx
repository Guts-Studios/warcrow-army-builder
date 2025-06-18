
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { APP_VERSION } from '@/constants/version';

export const PWAUpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
      console.log('App version:', APP_VERSION);
      console.log('Storage keys:', Object.keys(localStorage));
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
    onNeedRefresh() {
      console.log('SW needs refresh - new version available');
      setShowPrompt(true);
      toast.info('New app version available!');
    },
    onOfflineReady() {
      console.log('SW offline ready');
      toast.success('App is ready to work offline');
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowPrompt(false);
    setShowAdvancedOptions(false);
  };

  const handleUpdate = () => {
    console.log('Updating service worker...');
    updateServiceWorker(true);
    setShowPrompt(false);
  };

  const clearSWAndReload = () => {
    console.log('Clearing all caches and service workers...');
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }
    
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    
    toast.success('All caches cleared! Reloading...');
    
    // Force reload without cache
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (!showPrompt && !needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-warcrow-background border border-warcrow-gold rounded-lg p-4 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="text-warcrow-gold font-semibold text-sm mb-1">
              Update Available
            </h4>
            <p className="text-warcrow-text text-xs mb-3">
              A new version of the app is available. Reload to get the latest features and fixes.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  onClick={handleUpdate}
                  size="sm"
                  className="bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Update Now
                </Button>
                <Button
                  onClick={close}
                  size="sm"
                  variant="outline"
                  className="border-warcrow-accent text-warcrow-text hover:bg-warcrow-accent"
                >
                  Later
                </Button>
              </div>
              
              {!showAdvancedOptions ? (
                <Button
                  onClick={() => setShowAdvancedOptions(true)}
                  size="sm"
                  variant="ghost"
                  className="text-xs text-warcrow-text/70 hover:text-warcrow-text p-0 h-auto"
                >
                  Having cache issues? Click for advanced options
                </Button>
              ) : (
                <div className="border-t border-warcrow-accent pt-2 mt-1">
                  <p className="text-xs text-warcrow-text/70 mb-2">
                    If you're still seeing old content:
                  </p>
                  <Button
                    onClick={clearSWAndReload}
                    size="sm"
                    variant="destructive"
                    className="w-full text-xs"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear All Cache & Reload
                  </Button>
                </div>
              )}
            </div>
          </div>
          <Button
            onClick={close}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-warcrow-text hover:text-warcrow-gold"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
