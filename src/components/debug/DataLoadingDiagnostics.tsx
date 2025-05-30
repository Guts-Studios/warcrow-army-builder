
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEnvironment } from '@/hooks/useEnvironment';
import { APP_VERSION } from '@/constants/version';

export const DataLoadingDiagnostics: React.FC = () => {
  const { authReady, isAuthenticated, userId, isLoading } = useAuth();
  const { useLocalContentData, isPreview, isProduction, hostname } = useEnvironment();

  // Only show in development or preview
  if (isProduction) return null;

  // Determine environment type for display
  const environmentType = hostname === 'localhost' || hostname.startsWith('127.') 
    ? 'Local Dev' 
    : isPreview 
    ? 'Lovable Preview' 
    : 'Unknown';

  // Check for potential issues
  const hasEnvironmentIssue = !hostname.startsWith('localhost') && 
                             !hostname.startsWith('127.') && 
                             useLocalContentData;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded text-xs max-w-sm z-50">
      <div className="font-bold mb-2">🩺 Data Loading Diagnostics</div>
      <div className="space-y-1">
        <div>Version: {APP_VERSION}</div>
        <div>Environment: {environmentType}</div>
        <div>Hostname: {hostname}</div>
        <div className={useLocalContentData ? 'text-yellow-300' : 'text-green-300'}>
          Use Local Data: {useLocalContentData ? '🏠 Local' : '🌐 Remote'}
        </div>
        <div>Auth Ready: {authReady ? '✅' : '❌'}</div>
        <div>Auth Loading: {isLoading ? '⏳' : '✅'}</div>
        <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
        <div>User ID: {userId || 'None'}</div>
        {hasEnvironmentIssue && (
          <div className="text-red-400 font-bold">
            ⚠️ ENV MISMATCH!
          </div>
        )}
      </div>
    </div>
  );
};
