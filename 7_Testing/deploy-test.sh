#!/bin/bash

# Vercel Deployment Test Script
echo "🚀 LinkedIn Content Magician - Vercel Deployment"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found. Run this script from the project root."
    exit 1
fi

echo "✅ Found vercel.json configuration"

# Check if required files exist
echo "🔍 Checking required files..."

files=(
    "api/rag-search.py"
    "requirements.txt"
    "package.json"
    "faiss_index.bin"
    "filepaths.txt"
    "5_Symbols/package.json"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
    fi
done

# Check if sample docs exist
echo "📚 Checking sample documents..."
if [ -d "sample_docs" ]; then
    doc_count=$(ls sample_docs/*.md 2>/dev/null | wc -l)
    echo "✅ Found $doc_count sample documents"
else
    echo "❌ Missing: sample_docs directory"
fi

# Test Python serverless function locally
echo "🐍 Testing Python function..."
cd api
if python3 rag-search.py > /dev/null 2>&1; then
    echo "✅ Python function syntax is valid"
else
    echo "❌ Python function has syntax errors"
fi
cd ..

# Test frontend build
echo "🏗️ Testing frontend build..."
cd 5_Symbols
if npm run build > /dev/null 2>&1; then
    echo "✅ Frontend builds successfully"
    echo "📁 Build output: $(ls -la dist/ | wc -l) files in dist/"
else
    echo "❌ Frontend build failed"
fi
cd ..

echo ""
echo "🎯 Ready for deployment? Run:"
echo "   vercel --prod"
echo ""
echo "🔗 Documentation:"
echo "   - Deployment Guide: 2_Environment/vercel-deployment-guide.md"
echo "   - Implementation: 2_Environment/vercel-implementation.md"