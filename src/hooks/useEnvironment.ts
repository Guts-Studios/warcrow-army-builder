
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
  // Calculate environment info synchronously and deterministically
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  
  // STRICT: Only localhost and 127.* should use local data
  const useLocalContentData = hostname === 'localhost' || hostname.startsWith('127.');
  
  // ONLY local development should be considered "preview" for data purposes
  const isLocalDev = hostname === 'localhost' || hostname === '127.0.0.1';
  
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
  
  // Create the environment info object once, synchronously
  const [environmentInfo] = useState<EnvironmentInfo>({
    isPreview: isLovablePreview,
    isProduction,
    hostname,
    useLocalContentData
  });
  
  useEffect(() => {
    // Log environment detection on every app load
    console.log("[useEnvironment] 🌍 Environment detected on app load:", {
      hostname,
      isLocalDev,
      isLovablePreview,
      isProduction,
      useLocalContentData,
      environmentType: isLocalDev ? 'local-dev' : isLovablePreview ? 'lovable-preview' : isProduction ? 'production' : 'unknown',
      timestamp: new Date().toISOString()
    });
    
    // ERROR CHECK: Detect mismatches and log errors
    if (!isLocalDev && useLocalContentData) {
      console.error("[useEnvironment] 🚨 ENVIRONMENT MISMATCH DETECTED!", {
        hostname,
        useLocalContentData,
        shouldBeLocal: false,
        message: "Remote hostname is trying to use local data - this should never happen!"
      });
      
      // Force reload to prevent inconsistent state
      setTimeout(() => {
        console.error("[useEnvironment] 🔄 Reloading app due to environment mismatch");
        window.location.reload();
      }, 1000);
    }
    
    // Prevent mode flipping - warn if somehow the state would change
    const currentUseLocal = hostname === 'localhost' || hostname.startsWith('127.');
    if (currentUseLocal !== useLocalContentData) {
      console.error("[useEnvironment] 🚨 MODE FLIPPING DETECTED!", {
        original: useLocalContentData,
        computed: currentUseLocal,
        hostname,
        message: "Environment mode changed after initial detection - this should never happen!"
      });
    }
  }, []); // Empty dependency array - only run once on mount
  
  return environmentInfo;
};

export default useEnvironment;
