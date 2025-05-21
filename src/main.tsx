
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { checkVersionAndPurgeStorage, purgeStorageExceptLists, clearInvalidTokens } from './utils/storageUtils'
import { Toaster } from './components/ui/toaster'
import { toast } from 'sonner'

// Check for invalid tokens first and clear them if needed
// This needs to happen before any API calls are made
clearInvalidTokens();

// Immediately purge all storage except army lists on every app load
// This ensures any corrupted or outdated data is cleared
purgeStorageExceptLists();

// Add user agent logging to help diagnose mobile issues
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
console.log(`[App] Running on ${isMobile ? 'mobile' : 'desktop'} device`);

// Get the changelog content from the public folder with super aggressive cache-busting
const fetchChangelog = () => {
  // Generate a unique UUID for this fetch operation
  const uniqueId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
  
  // Add timestamp, random value and unique identifier for aggressive cache busting
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 15);
  const cacheBuster = `t=${timestamp}&r=${random}&u=${uniqueId}`;
  console.log(`[App] Fetching CHANGELOG.md with cache buster: ${cacheBuster}`);
  
  fetch(`/CHANGELOG.md?${cacheBuster}`, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Accept': 'text/plain, text/markdown'
    },
    // Add cache: 'no-store' to force bypass cache completely
    cache: 'no-store'
  })
    .then(response => {
      console.log(`[App] CHANGELOG.md fetch status: ${response.status}`);
      if (!response.ok) {
        toast.error("Failed to load version information");
        throw new Error(`Failed to fetch CHANGELOG.md: ${response.status}`);
      }
      return response.text();
    })
    .then(changelog => {
      // Check for version changes and purge storage if needed
      console.log('[App] Fetched CHANGELOG.md, checking version now...');
      
      // Check if we got an HTML document instead of markdown
      if (changelog.trim().startsWith('<!DOCTYPE html>') || 
          changelog.includes('<html') || 
          changelog.includes('<head>') || 
          changelog.includes('<body>')) {
        console.warn('[App] Received HTML instead of markdown content. Using fallback changelog');
        const fallbackChangelog = `# Changelog\n\n## [0.5.8]\nFallback changelog content`;
        const purged = checkVersionAndPurgeStorage(fallbackChangelog);
        console.log(`[App] Storage purge check completed using fallback, storage was ${purged ? 'purged' : 'not purged'}`);
        return;
      }
      
      // At this point we have valid markdown content
      console.log('[App] Changelog content sample:', changelog.substring(0, 200) + '...');
      const purged = checkVersionAndPurgeStorage(changelog);
      console.log(`[App] Storage purge check completed, storage was ${purged ? 'purged' : 'not purged'}`);
    })
    .catch(error => {
      console.error('[App] Failed to load CHANGELOG.md:', error);
      
      // On mobile, fallback to fetching a static version from localStorage or hardcoded value
      if (isMobile) {
        console.log('[App] Mobile device detected, applying fallback version handling');
        // Hardcoded version as last resort
        const hardcodedVersion = "0.5.8"; 
        console.log(`[App] Using hardcoded version: ${hardcodedVersion}`);
        
        // Create minimal changelog content with the hardcoded version
        const minimalChangelog = `# Changelog\n\n## [${hardcodedVersion}]`;
        checkVersionAndPurgeStorage(minimalChangelog);
      }
    });
};

// Execute the fetch immediately with a slight delay to ensure DOM is ready
setTimeout(() => {
  fetchChangelog();
}, 100);

// On mobile, try to fetch changelog again after a short delay
// as mobile connections might be slower
if (isMobile) {
  setTimeout(() => {
    console.log('[App] Retrying changelog fetch for mobile device');
    fetchChangelog();
  }, 3000);
}

// Preconnect to critical domains
const preconnect = (url: string) => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  document.head.appendChild(link);
};

// Preconnect to key domains
preconnect('https://fonts.googleapis.com');
preconnect('https://fonts.gstatic.com');
preconnect('https://odqyoncwqawdzhquxcmh.supabase.co');

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>
)
