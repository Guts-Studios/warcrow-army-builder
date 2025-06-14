
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';

export const PWAUpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
    onNeedRefresh() {
      console.log('SW needs refresh');
      setShowPrompt(true);
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
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
    setShowPrompt(false);
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
