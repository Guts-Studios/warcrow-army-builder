
import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-warcrow-background">
      <div className="flex flex-col items-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-warcrow-gold" />
        <p className="text-warcrow-gold">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
