
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { checkVersionAndPurgeStorage } from './utils/storageUtils'
import { Toaster } from './components/ui/toaster'

// Get the changelog content from the public folder
fetch('/CHANGELOG.md?t=' + new Date().getTime()) // Add cache-busting parameter
  .then(response => response.text())
  .then(changelog => {
    // Check for version changes and purge storage if needed
    console.log('[App] Fetched CHANGELOG.md, checking version now...');
    const purged = checkVersionAndPurgeStorage(changelog);
    console.log(`[App] Storage purge check completed, storage was ${purged ? 'purged' : 'not purged'}`);
  })
  .catch(error => {
    console.error('[App] Failed to load CHANGELOG.md:', error);
  });

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
