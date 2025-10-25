/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)


// Custom plugin to handle RAG search API (development only)
const ragApiPlugin = () => {
  return {
    name: 'rag-api',
    configureServer(server) {
      server.middlewares.use('/api/rag-search', (req, res) => {
        if (req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, message: 'It works!', sources: [] }));
        } else {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
        }
      });
    }
  };
};


// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [
      react(),
      // Only use local RAG API plugin in development
      ...(isProduction ? [] : [ragApiPlugin()])
    ],
    base: isProduction ? '/linkedin-content-magician/' : '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // Optimize bundle size and memory usage
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor libraries to reduce memory pressure
            vendor: ['react', 'react-dom'],
            ui: ['lucide-react']
          }
        }
      },
      // Increase memory limit warning threshold
      chunkSizeWarningLimit: 1000,
      // Enable aggressive optimization
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info']
        }
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
    },
  }
})
