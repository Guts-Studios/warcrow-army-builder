
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { checkVersionAndPurgeStorage } from './utils/storageUtils'
import { Toaster } from './components/ui/toaster'

// Get the changelog content from the public folder
fetch('/CHANGELOG.md')
  .then(response => response.text())
  .then(changelog => {
    // Check for version changes and purge storage if needed
    checkVersionAndPurgeStorage(changelog);
  })
  .catch(error => {
    console.error('Failed to load CHANGELOG.md:', error);
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
