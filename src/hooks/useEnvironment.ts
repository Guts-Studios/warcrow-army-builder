
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
    
    // ONLY local development should be considered "preview" for data purposes
    const isLocalDev = hostname === 'localhost' || 
                      hostname === '127.0.0.1';
    
    // Lovable preview environments should behave like production for data fetching
    const isLovablePreview = hostname.includes('lovableproject.com') || 
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
    
    // NEW LOGIC: Only use local data for actual local development
    // Preview and production should BOTH use remote data
    let useLocalContentData: boolean;
    
    if (envUseLocal) {
      useLocalContentData = true;
      console.warn("[useEnvironment] Forced to use local data via URL parameter");
    } else if (isLocalDev) {
      useLocalContentData = true;
      console.log("[useEnvironment] Local development - using local data");
    } else {
      useLocalContentData = false;
      console.log("[useEnvironment] Remote environment (preview/production) - using database data");
    }
    
    setEnvironmentInfo({
      isPreview: isLovablePreview, // Still track if it's a preview environment
      isProduction,
      hostname,
      useLocalContentData
    });
    
    console.log("[useEnvironment] Environment detected:", { 
      hostname, 
      isLocalDev,
      isLovablePreview,
      isProduction,
      useLocalContentData,
      environmentType: isLocalDev ? 'local-dev' : isLovablePreview ? 'lovable-preview' : isProduction ? 'production' : 'unknown',
      timestamp: new Date().toISOString()
    });
  }, []);
  
  return environmentInfo;
};

export default useEnvironment;
