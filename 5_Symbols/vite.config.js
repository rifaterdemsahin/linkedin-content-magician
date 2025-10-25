/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Custom plugin to handle RAG search API
const ragApiPlugin = () => {
  return {
    name: 'rag-api',
    configureServer(server) {
      server.middlewares.use('/api/rag-search', async (req, res, next) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk.toString()
          })
          req.on('end', async () => {
            try {
              const { query, top_k = 3 } = JSON.parse(body)
              
              // Execute Python RAG search
              const ragDir = './rag'
              const command = `cd ${ragDir} && source venv/bin/activate && python search_api.py --query "${query}" --top-k ${top_k} --json-only`
              
              const { stdout, stderr } = await execAsync(command)
              
              if (stderr) {
                console.warn('RAG search stderr:', stderr)
              }
              
              const result = JSON.parse(stdout)
              
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(result))
              
            } catch (error) {
              console.error('RAG API error:', error)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                success: false,
                error: error.message,
                sources: []
              }))
            }
          })
        } else {
          next()
        }
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ragApiPlugin()],
  base: '/linkedin-content-magician/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
