
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

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
  </React.StrictMode>
)
