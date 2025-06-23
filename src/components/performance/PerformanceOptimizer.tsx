
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Trash2, RefreshCw, Gauge } from 'lucide-react';
import { useCacheDiagnostics } from '@/hooks/useCacheDiagnostics';
import { toast } from 'sonner';

export const PerformanceOptimizer = () => {
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const { cacheHealth, clearStaleAuthData, clearAllCachesAndReload, quickCacheOptimization } = useCacheDiagnostics(true);

  useEffect(() => {
    // Measure initial load performance
    const measureLoadTime = () => {
      if (performance && performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        setLoadTime(loadTime);
        
        // Show optimizer if load time is slow (> 3 seconds)
        if (loadTime > 3000) {
          setShowOptimizer(true);
          toast.info('Slow loading detected - performance optimizer available');
        }
      }
    };

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      measureLoadTime();
    } else {
      window.addEventListener('load', measureLoadTime);
      return () => window.removeEventListener('load', measureLoadTime);
    }
  }, []);

  const getCacheHealthColor = () => {
    switch (cacheHealth) {
      case 'good': return 'bg-green-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getLoadTimeColor = () => {
    if (!loadTime) return 'bg-gray-500';
    if (loadTime < 2000) return 'bg-green-500';
    if (loadTime < 4000) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!showOptimizer && cacheHealth === 'good' && (loadTime || 0) < 3000) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 z-50 max-w-sm bg-warcrow-background border border-warcrow-gold/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-warcrow-gold flex items-center">
          <Gauge className="h-5 w-5 mr-2" />
          Performance Optimizer
        </CardTitle>
        <CardDescription className="text-warcrow-text/80">
          Improve app loading speed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-warcrow-text">Cache Health:</span>
          <Badge className={`${getCacheHealthColor()} text-white`}>
            {cacheHealth}
          </Badge>
        </div>
        
        {loadTime && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-warcrow-text">Load Time:</span>
            <Badge className={`${getLoadTimeColor()} text-white`}>
              {(loadTime / 1000).toFixed(1)}s
            </Badge>
          </div>
        )}

        <div className="space-y-2">
          <Button
            onClick={quickCacheOptimization}
            size="sm"
            className="w-full bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90"
          >
            <Zap className="h-4 w-4 mr-2" />
            Quick Optimization
          </Button>
          
          <Button
            onClick={clearStaleAuthData}
            size="sm"
            variant="outline"
            className="w-full border-warcrow-accent text-warcrow-text"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Auth Cache
          </Button>
          
          <Button
            onClick={clearAllCachesAndReload}
            size="sm"
            variant="destructive"
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Nuclear Reset
          </Button>
        </div>

        <Button
          onClick={() => setShowOptimizer(false)}
          size="sm"
          variant="ghost"
          className="w-full text-xs text-warcrow-text/60"
        >
          Hide Optimizer
        </Button>
      </CardContent>
    </Card>
  );
};
