
import { useState, useEffect } from 'react';

interface EnvironmentInfo {
  isPreview: boolean;
  isProduction: boolean;
  hostname: string;
  useLocalContentData: boolean;
}

/**
 * Hook to detect the current environment and provide consistent configuration
 * across the application
 */
export const useEnvironment = (): EnvironmentInfo => {
  const [environmentInfo, setEnvironmentInfo] = useState<EnvironmentInfo>({
    isPreview: false,
    isProduction: false,
    hostname: '',
    useLocalContentData: true
  });
  
  useEffect(() => {
    const hostname = window.location.hostname;
    const origin = window.location.origin;
    
    // Explicit production domain check - UPDATED to include both the primary domain and netlify subdomain
    const isExplicitProductionDomain = hostname === 'warcrowarmy.com' || 
                                      hostname.endsWith('.warcrowarmy.com') ||
                                      hostname === 'warcrowarmybuilder.netlify.app' ||
                                      hostname === 'warcrow-army-builder.netlify.app';
    
    // More comprehensive preview detection - any domain that is not explicitly production
    const isPreview = hostname === 'localhost' || 
                     hostname === '127.0.0.1' || 
                     hostname.includes('lovableproject.com') || 
                     hostname.endsWith('.lovableproject.com') ||
                     (hostname.includes('netlify.app') && !isExplicitProductionDomain) || 
                     hostname.includes('lovable.app');
    
    // Production is either explicitly defined or not a preview
    const isProduction = isExplicitProductionDomain || (!isPreview);
    
    // Always use local data for content in all environments
    const useLocalContentData = true;
    
    setEnvironmentInfo({
      isPreview,
      isProduction,
      hostname,
      useLocalContentData
    });
    
    console.log("[useEnvironment] Environment detected:", { 
      hostname, 
      origin,
      isExplicitProductionDomain,
      isPreview, 
      isProduction,
      useLocalContentData,
      timestamp: new Date().toISOString()
    });
  }, []);
  
  return environmentInfo;
};

export default useEnvironment;
