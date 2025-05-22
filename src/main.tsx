
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { checkVersionAndPurgeStorage, clearInvalidTokens, purgeStorageExceptLists } from './utils/storageUtils'
import { Toaster } from './components/ui/toaster'
import { toast } from 'sonner'

// On app load, ONLY check for CLEARLY invalid tokens (empty or malformed)
// but don't clear tokens just because we're on a different domain
console.log("[App] Checking for obviously invalid auth tokens...");
setTimeout(async () => {
  try {
    // Delayed token validation to ensure app has loaded and avoid blocking UI
    const cleared = await clearInvalidTokens();
    if (cleared) {
      console.log("[App] Invalid tokens were found and cleared");
    } else {
      console.log("[App] No invalid tokens found or cleared");
    }
  } catch (err) {
    console.error("[App] Error checking tokens:", err);
  }
}, 500);

// Immediately purge all storage except army lists and auth tokens on every app load
// Auth tokens are now preserved in purgeStorageExceptLists()
purgeStorageExceptLists();

// Add user agent logging to help diagnose mobile issues
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
console.log(`[App] Running on ${isMobile ? 'mobile' : 'desktop'} device`);

// Detect if the user might be having issues with auth state
// This helps with recovering from broken states
const detectBrokenAuthState = async () => {
  try {
    // Check only for partial or corrupted auth tokens that are definitely broken
    // Don't clear valid tokens just because we're on a different domain
    const hasPartialAuth = Object.keys(localStorage)
      .some(key => (key.startsWith('sb-') || key.includes('auth')) && 
            (!localStorage.getItem(key) || localStorage.getItem(key) === "undefined"));
    
    if (hasPartialAuth) {
      console.warn('[App] Detected potentially broken auth state with empty values, cleaning up');
      await clearInvalidTokens();
    }
  } catch (error) {
    console.error('[App] Error checking for broken auth state:', error);
  }
};

// Run the auth state check
detectBrokenAuthState();

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
        // Silently log the error instead of showing a toast
        console.warn("Failed to load version information, using default version");
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

// Check if debug buttons should be shown - updated to use consistent naming
const shouldShowDebugButtons = () => {
  try {
    return localStorage.getItem('warcrow_show_debug_buttons') === 'true';
  } catch (e) {
    return false;
  }
};

// Check if recovery buttons should be shown
const shouldShowRecoveryButtons = () => {
  try {
    const preference = localStorage.getItem('warcrow_show_recovery_buttons');
    // Default to true if not set
    return preference === null ? true : preference === 'true';
  } catch (e) {
    return true; // Default to true for safety
  }
};

// Add a mechanism to detect if the page is stuck and offer recovery
setTimeout(() => {
  // If the page has been loading for a long time, offer a recovery button
  const appRoot = document.getElementById('root');
  if (appRoot && !appRoot.hasChildNodes()) {
    console.error('[App] Page appears to be stuck loading. Adding recovery option.');
    
    // Only show recovery button if enabled
    if (shouldShowRecoveryButtons()) {
      // Create a recovery button
      const recoveryDiv = document.createElement('div');
      recoveryDiv.style.position = 'fixed';
      recoveryDiv.style.bottom = '20px';
      recoveryDiv.style.right = '20px';
      recoveryDiv.style.zIndex = '9999';
      
      const recoveryButton = document.createElement('button');
      recoveryButton.innerText = 'Recover App';
      recoveryButton.style.backgroundColor = '#1E40AF';
      recoveryButton.style.color = 'white';
      recoveryButton.style.padding = '8px 12px';
      recoveryButton.style.borderRadius = '4px';
      recoveryButton.style.border = 'none';
      recoveryButton.style.cursor = 'pointer';
      
      recoveryButton.onclick = () => {
        // Clear storage and reload
        localStorage.clear();
        window.location.reload();
      };
      
      recoveryDiv.appendChild(recoveryButton);
      document.body.appendChild(recoveryDiv);
    }
  }
}, 15000); // Wait 15s before showing recovery option

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
