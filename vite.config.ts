
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { execSync } from "child_process";

// Extract version during build
function extractVersionPlugin() {
  return {
    name: 'extract-version',
    buildStart() {
      console.log('Extracting version from CHANGELOG.md...');
      try {
        execSync('node scripts/extract-version.cjs', { stdio: 'inherit' });
      } catch (error) {
        console.error('Failed to extract version:', error);
        throw error;
      }
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 8080,
    headers: {
      'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src * 'unsafe-inline' 'unsafe-eval' data: blob:; frame-src *; frame-ancestors *; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline';",
      'Access-Control-Allow-Origin': '*',
      'X-Frame-Options': 'ALLOWALL',
      'X-Content-Type-Options': 'nosniff',
      'X-Debug': 'false'
    }
  },
  preview: {
    headers: {
      'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src * 'unsafe-inline' 'unsafe-eval' data: blob:; frame-src *; frame-ancestors *; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline';",
      'Access-Control-Allow-Origin': '*',
      'X-Frame-Options': 'ALLOWALL'
    }
  },
  plugins: [
    extractVersionPlugin(),
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
