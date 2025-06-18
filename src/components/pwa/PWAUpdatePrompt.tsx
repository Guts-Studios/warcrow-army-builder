
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X, Trash2, Bug } from 'lucide-react';
import { toast } from 'sonner';
import { APP_VERSION } from '@/constants/version';
import { useCacheDiagnostics } from '@/hooks/useCacheDiagnostics';

export const PWAUpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showDebugOptions, setShowDebugOptions] = useState(false);
  const { clearStaleAuthData, clearAllCachesAndReload } = useCacheDiagnostics();
  
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
    setShowDebugOptions(false);
  };

  const handleUpdate = () => {
    console.log('Updating service worker...');
    updateServiceWorker(true);
    setShowPrompt(false);
  };

  const handleClearStaleAuth = () => {
    clearStaleAuthData();
    toast.success('Stale auth data cleared! Please refresh the page.');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleDiagnostics = () => {
    // Enable diagnostics for this session
    const diagnostics = useCacheDiagnostics(true);
    toast.info('Check browser console for detailed cache diagnostics');
  };

  // Show prompt if there's an update OR if user is having auth issues
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
                    If you're still seeing old content or auth issues:
                  </p>
                  <div className="flex flex-col gap-1">
                    <Button
                      onClick={handleClearStaleAuth}
                      size="sm"
                      variant="secondary"
                      className="w-full text-xs"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear Auth Data Only
                    </Button>
                    <Button
                      onClick={clearAllCachesAndReload}
                      size="sm"
                      variant="destructive"
                      className="w-full text-xs"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear All Cache & Reload
                    </Button>
                    {!showDebugOptions ? (
                      <Button
                        onClick={() => setShowDebugOptions(true)}
                        size="sm"
                        variant="ghost"
                        className="text-xs text-warcrow-text/70 hover:text-warcrow-text p-0 h-auto"
                      >
                        Still having issues? Debug options
                      </Button>
                    ) : (
                      <Button
                        onClick={handleDiagnostics}
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                      >
                        <Bug className="h-3 w-3 mr-1" />
                        Run Cache Diagnostics
                      </Button>
                    )}
                  </div>
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
