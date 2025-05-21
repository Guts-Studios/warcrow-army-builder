
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
    
    // More comprehensive preview detection
    const isPreview = hostname === 'localhost' || 
                     hostname === '127.0.0.1' || 
                     hostname.includes('lovableproject.com') || 
                     hostname.endsWith('.lovableproject.com') ||
                     hostname.includes('netlify.app') || 
                     hostname.includes('lovable.app');
    
    // Production includes warcrowarmy.com or any custom domain that's not a preview domain
    const isProduction = hostname === 'warcrowarmy.com' || 
                        hostname.endsWith('.warcrowarmy.com') ||
                        (!isPreview && hostname !== 'localhost' && hostname !== '127.0.0.1');
    
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
      isPreview, 
      isProduction,
      useLocalContentData,
      timestamp: new Date().toISOString()
    });
  }, []);
  
  return environmentInfo;
};

export default useEnvironment;
