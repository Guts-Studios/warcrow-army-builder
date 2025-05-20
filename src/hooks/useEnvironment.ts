
import { useState, useEffect } from 'react';

interface EnvironmentInfo {
  isPreview: boolean;
  isProduction: boolean;
  hostname: string;
  useLocalContentData: boolean;
  useMockData: boolean;
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
    useLocalContentData: true,
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
    
    // Production is explicitly warcrowarmy.com or any subdomain
    const isProduction = hostname === 'warcrowarmy.com' || 
                        hostname.endsWith('.warcrowarmy.com');
    
    // Always use local data for content in all environments
    const useLocalContentData = true;
    
    // Never use mock data in any environment
    const useMockData = false;
    
    setEnvironmentInfo({
      isPreview,
      isProduction,
      hostname,
      useLocalContentData,
      useMockData
    });
    
    console.log("[useEnvironment] Environment detected:", { 
      hostname, 
      isPreview, 
      isProduction,
      useLocalContentData,
      useMockData
    });
  }, []);
  
  return environmentInfo;
};

export default useEnvironment;
