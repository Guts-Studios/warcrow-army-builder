import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob: wss:; connect-src * 'unsafe-inline' 'unsafe-eval' data: blob: wss:; frame-src *; frame-ancestors *;",
      'Access-Control-Allow-Origin': '*',
      'X-Frame-Options': 'ALLOWALL',
      'X-Content-Type-Options': 'nosniff',
      'X-Debug': 'false'
    }
  },
  preview: {
    headers: {
      'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob: wss:; connect-src * 'unsafe-inline' 'unsafe-eval' data: blob: wss:; frame-src *; frame-ancestors *;",
      'Access-Control-Allow-Origin': '*',
      'X-Frame-Options': 'ALLOWALL'
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));