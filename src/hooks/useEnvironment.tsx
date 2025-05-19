
import { useState, useEffect } from 'react';

interface EnvironmentInfo {
  isPreview: boolean;
  isProduction: boolean;
  hostname: string;
  useMockData: boolean;
}

/**
 * Hook to detect the current environment and determine if mock data should be used
 * @param forceMockData - Optional parameter to force using mock data regardless of environment
 * @returns Environment information including whether to use mock data
 */
export const useEnvironment = (forceMockData?: boolean): EnvironmentInfo => {
  const [environmentInfo, setEnvironmentInfo] = useState<EnvironmentInfo>({
    isPreview: false,
    isProduction: false,
    hostname: '',
    useMockData: false
  });
  
  useEffect(() => {
    const hostname = window.location.hostname;
    
    // More comprehensive preview detection
    const isPreview = hostname === 'localhost' || 
                     hostname === '127.0.0.1' || 
                     hostname.includes('lovableproject.com') || 
                     hostname.endsWith('.lovableproject.com') ||
                     hostname.includes('netlify.app') || 
                     hostname.includes('lovable.app') ||
                     hostname.includes('id-preview');
    
    // Production is explicitly warcrowarmy.com
    const isProduction = hostname === 'warcrowarmy.com' || 
                        hostname.endsWith('.warcrowarmy.com');
    
    // By default, we only use mock data in preview environments when specifically requested
    // Force mock data takes precedence if provided
    const useMockData = typeof forceMockData !== 'undefined' ? 
      forceMockData : 
      (isPreview && !isProduction && false); // Set to false to use real data in preview
    
    setEnvironmentInfo({
      isPreview,
      isProduction,
      hostname,
      useMockData
    });
    
    console.log("[useEnvironment] Environment detected:", { 
      hostname, 
      isPreview, 
      isProduction,
      useMockData
    });
  }, [forceMockData]);
  
  return environmentInfo;
};

export default useEnvironment;
