
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
    useLocalContentData: true // Default to true until we determine environment
  });
  
  useEffect(() => {
    const hostname = window.location.hostname;
    
    // Comprehensive check for preview environments
    const isPreview = hostname === 'localhost' || 
                     hostname === '127.0.0.1' || 
                     hostname.includes('lovableproject.com') || 
                     hostname.endsWith('.lovableproject.com') ||
                     hostname.includes('lovable.app') ||
                     hostname.includes('id-preview');
    
    // Explicit production domains
    const productionDomains = [
      'warcrowarmy.com',
      'www.warcrowarmy.com',
      'warcrow-army-builder.netlify.app'
    ];
    
    const isProduction = productionDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
    
    // Check for environment variable override (for build-time configuration)
    const envUseLocal = typeof window !== 'undefined' && 
      window.location.search.includes('use_local=true');
    
    // Use local data only for development/preview environments
    // In production, ALWAYS use database data unless explicitly overridden
    let useLocalContentData: boolean;
    
    if (envUseLocal) {
      useLocalContentData = true;
      console.warn("[useEnvironment] Forced to use local data via URL parameter");
    } else if (isProduction) {
      useLocalContentData = false;
      console.log("[useEnvironment] Production environment - using database data");
    } else {
      useLocalContentData = true;
      console.log("[useEnvironment] Development/preview environment - using local data");
    }
    
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
