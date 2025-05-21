
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { checkVersionAndPurgeStorage, purgeStorageExceptLists } from './utils/storageUtils'
import { Toaster } from './components/ui/toaster'

// Immediately purge all storage except army lists on every app load
purgeStorageExceptLists();

// Add user agent logging to help diagnose mobile issues
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
console.log(`[App] Running on ${isMobile ? 'mobile' : 'desktop'} device`);

// Get the changelog content from the public folder with strong cache-busting
const fetchChangelog = () => {
  // Add timestamp and random value for aggressive cache busting
  const cacheBuster = `t=${new Date().getTime()}&r=${Math.random()}`;
  console.log(`[App] Fetching CHANGELOG.md with cache buster: ${cacheBuster}`);
  
  fetch(`/CHANGELOG.md?${cacheBuster}`)
    .then(response => {
      console.log(`[App] CHANGELOG.md fetch status: ${response.status}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch CHANGELOG.md: ${response.status}`);
      }
      return response.text();
    })
    .then(changelog => {
      // Check for version changes and purge storage if needed
      console.log('[App] Fetched CHANGELOG.md, checking version now...');
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

// Execute the fetch immediately 
fetchChangelog();

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

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>
)
