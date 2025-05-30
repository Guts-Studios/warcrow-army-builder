
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEnvironment } from '@/hooks/useEnvironment';
import { APP_VERSION } from '@/constants/version';

export const DataLoadingDiagnostics: React.FC = () => {
  const { authReady, isAuthenticated, userId, isLoading } = useAuth();
  const { useLocalContentData, isPreview, isProduction, hostname } = useEnvironment();

  // Only show in development or preview
  if (isProduction) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded text-xs max-w-sm z-50">
      <div className="font-bold mb-2">🩺 Data Loading Diagnostics</div>
      <div className="space-y-1">
        <div>Version: {APP_VERSION}</div>
        <div>Environment: {isPreview ? 'Preview' : 'Dev'}</div>
        <div>Hostname: {hostname}</div>
        <div>Use Local Data: {useLocalContentData ? '✅' : '❌'}</div>
        <div>Auth Ready: {authReady ? '✅' : '❌'}</div>
        <div>Auth Loading: {isLoading ? '⏳' : '✅'}</div>
        <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
        <div>User ID: {userId || 'None'}</div>
      </div>
    </div>
  );
};
