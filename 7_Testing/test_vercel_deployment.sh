
#!/bin/bash

# Test script for Vercel deployment

# Exit immediately if a command exits with a non-zero status.
set -e

VERCEL_URL="https://linkedin-content-magician-nrywmc06o-rifaterdemsahins-projects.vercel.app"

echo "🧪 Starting Vercel deployment tests..."

# Test 1: Check if the frontend is accessible
echo "
[1/2] Checking frontend accessibility..."

response_code=$(curl -s -o /dev/null -w "%{http_code}" $VERCEL_URL)

if [ "$response_code" -eq 200 ]; then
  echo "✅ Frontend is accessible (HTTP status code: $response_code)."
else
  echo "❌ Frontend is not accessible (HTTP status code: $response_code)."
  exit 1
fi

# Test 2: Check if the RAG API is responding
echo "
[2/2] Checking RAG API endpoint..."

api_url="$VERCEL_URL/api/rag-search"

api_response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"query": "test"}' $api_url)

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
