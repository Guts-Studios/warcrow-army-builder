
export const useEnvironment = () => {
  // Get hostname and determine environment
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  
  const isPreview = hostname === 'localhost' || 
                   hostname === '127.0.0.1' || 
                   hostname.includes('lovableproject.com') || 
                   hostname.endsWith('.lovableproject.com') ||
                   hostname.includes('netlify.app') || 
                   hostname.includes('lovable.app') ||
                   hostname.includes('id-preview');
                   
  const isProduction = hostname === 'warcrowarmy.com' || 
                      hostname.endsWith('.warcrowarmy.com');
  
  // Always use local data for content regardless of environment
  const useLocalContentData = true;
  
  return {
    hostname,
    isPreview,
    isProduction,
    useLocalContentData
  };
};

export default useEnvironment;
