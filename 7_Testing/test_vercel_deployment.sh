
#!/bin/bash

# Test script for Vercel deployment

# Exit immediately if a command exits with a non-zero status.
set -e

VERCEL_URL="https://linkedin-content-magician-nrywmc06o-rifaterdemsahins-projects.vercel.app"

# Check for Vercel bypass token
if [ -n "$VERCEL_BYPASS_TOKEN" ]; then
  echo "🔒 VERCEL_BYPASS_TOKEN is set. Using it to bypass deployment protection."
  VERCEL_URL="$VERCEL_URL?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=$VERCEL_BYPASS_TOKEN"
fi

echo "🧪 Starting Vercel deployment tests..."

# Test 1: Check if the frontend is accessible
echo "
[1/2] Checking frontend accessibility..."

response_code=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL")

if [ "$response_code" -eq 200 ]; then
  echo "✅ Frontend is accessible (HTTP status code: $response_code)."
else
  echo "❌ Frontend is not accessible (HTTP status code: $response_code)."
  echo "If your deployment is protected, please set the VERCEL_BYPASS_TOKEN environment variable."
  exit 1
fi

# Test 2: Check if the RAG API is responding
echo "
[2/2] Checking RAG API endpoint..."

# The API path needs to be constructed carefully with the bypass token if present
API_BASE_URL="https://linkedin-content-magician-nrywmc06o-rifaterdemsahins-projects.vercel.app/api/rag-search"
if [ -n "$VERCEL_BYPASS_TOKEN" ]; then
  API_URL="$API_BASE_URL?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=$VERCEL_BYPASS_TOKEN"
else
  API_URL="$API_BASE_URL"
fi

api_response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"query": "test"}' "$API_URL")

if echo "$api_response" | grep -q 'results'; then
  echo "✅ RAG API is responding correctly."
  echo "Response: $api_response"
else
  echo "❌ RAG API did not respond as expected."
  echo "Response: $api_response"
  exit 1
fi

echo "
🎉 All Vercel deployment tests passed!"
