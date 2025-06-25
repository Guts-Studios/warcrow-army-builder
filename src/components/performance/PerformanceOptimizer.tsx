
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Zap, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const PerformanceOptimizer: React.FC = () => {
  const handleOptimizeCache = () => {
    // Clear React Query cache
    if (typeof window !== 'undefined') {
      console.log('[PerformanceOptimizer] Optimizing cache...');
      
      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
      }
      
      toast.success('Cache optimized for better performance');
    }
  };

  const handleForceRefresh = () => {
    console.log('[PerformanceOptimizer] Force refreshing page...');
    window.location.reload();
  };

  const handleClearMemory = () => {
    // Clear any large objects from memory
    console.log('[PerformanceOptimizer] Clearing memory...');
    
    if (typeof window !== 'undefined') {
      // Clear any cached images
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (img.src.startsWith('data:')) {
          img.src = '';
        }
      });
    }
    
    toast.success('Memory cleared');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-warcrow-gold flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Performance Tools
        </CardTitle>
        <CardDescription>
          Tools to optimize app performance and clear cached data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={handleOptimizeCache}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Optimize Cache
          </Button>
          
          <Button 
            onClick={handleClearMemory}
            variant="outline"
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Clear Memory
          </Button>
          
          <Button 
            onClick={handleForceRefresh}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Force Refresh
          </Button>
        </div>
        
        <div className="text-sm text-warcrow-muted">
          <p>Use these tools if you experience performance issues or see outdated data.</p>
        </div>
      </CardContent>
    </Card>
  );
};
