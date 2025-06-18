
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useCacheDiagnostics } from '@/hooks/useCacheDiagnostics';

export const ManualCacheButton: React.FC = () => {
  const [isClearing, setIsClearing] = useState(false);
  const { clearAllCachesAndReload } = useCacheDiagnostics();

  const handleClearCache = async () => {
    if (isClearing) return;
    
    const confirmed = window.confirm(
      "This will clear all cached data and reload the page. This can help if you're seeing old content or having login issues. Continue?"
    );
    
    if (!confirmed) return;
    
    setIsClearing(true);
    toast.info('Clearing cache and reloading...');
    
    try {
      await clearAllCachesAndReload();
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error('Failed to clear cache. Please try refreshing manually.');
      setIsClearing(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Button
        onClick={handleClearCache}
        disabled={isClearing}
        variant="outline"
        size="sm"
        className="bg-black/80 border-warcrow-gold/50 text-warcrow-text hover:bg-warcrow-gold/20 hover:text-warcrow-gold"
      >
        {isClearing ? (
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
        ) : (
          <Trash2 className="h-3 w-3 mr-1" />
        )}
        {isClearing ? 'Clearing...' : 'Clear Cache'}
      </Button>
    </div>
  );
};
