
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
    
    // Comprehensive production domain list
    const productionDomains = [
      'warcrowarmy.com',
      'www.warcrowarmy.com',
      'warcrow-army-builder.netlify.app',
      'warcrowarmybuilder.netlify.app'
    ];
    
    // Check if the current hostname is a production domain
    const isExplicitProductionDomain = productionDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
    
    // Any development or test domain is considered preview
    const isPreview = hostname === 'localhost' || 
                     hostname === '127.0.0.1' || 
                     hostname.includes('lovableproject.com') || 
                     hostname.endsWith('.lovableproject.com') ||
                     (hostname.includes('netlify.app') && !isExplicitProductionDomain) || 
                     hostname.includes('lovable.app');
    
    // Production is either explicitly defined or not a preview
    const isProduction = isExplicitProductionDomain;
    
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
      productionDomains,
      timestamp: new Date().toISOString()
    });
  }, []);
  
  return environmentInfo;
};

export default useEnvironment;
