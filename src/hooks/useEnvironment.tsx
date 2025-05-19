
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
    const isPreview = hostname.includes('lovableproject.com') || 
                     hostname.endsWith('.lovableproject.com') || 
                     hostname.includes('localhost') || 
                     hostname.includes('127.0.0.1') || 
                     hostname.includes('netlify.app') || 
                     hostname.includes('lovable.app');
    
    // Production is warcrowarmy.com
    const isProduction = hostname.includes('warcrowarmy.com');
    
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
