
import { useState, useEffect } from 'react';

interface EnvironmentInfo {
  isPreview: boolean;
  isProduction: boolean;
  hostname: string;
}

export const useEnvironment = (): EnvironmentInfo => {
  const [environmentInfo, setEnvironmentInfo] = useState<EnvironmentInfo>({
    isPreview: false,
    isProduction: false,
    hostname: ''
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
    
    setEnvironmentInfo({
      isPreview,
      isProduction,
      hostname
    });
    
    console.log("[useEnvironment] Environment detected:", { 
      hostname, 
      isPreview, 
      isProduction 
    });
  }, []);
  
  return environmentInfo;
};

export default useEnvironment;
