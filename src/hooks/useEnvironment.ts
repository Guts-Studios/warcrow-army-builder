
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
    
    // Comprehensive check for preview environments
    const isPreview = hostname === 'localhost' || 
                     hostname === '127.0.0.1' || 
                     hostname.includes('lovableproject.com') || 
                     hostname.endsWith('.lovableproject.com') ||
                     hostname.includes('lovable.app') ||
                     hostname.includes('id-preview') ||
                     hostname.includes('netlify.app');
    
    // Explicit production domains only
    const productionDomains = [
      'warcrowarmy.com',
      'www.warcrowarmy.com',
      'warcrow-army-builder.netlify.app'
    ];
    
    const isProduction = productionDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
    
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
      isPreview, 
      isProduction,
      useLocalContentData,
      timestamp: new Date().toISOString()
    });
  }, []);
  
  return environmentInfo;
};

export default useEnvironment;
