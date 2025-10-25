#!/bin/bash

# 🚀 RAG System Demo Script
echo "🔍 Vector Search RAG System Demo"
echo "================================="

# Check if we're in the right directory
if [ ! -f "index.py" ] || [ ! -f "search.py" ]; then
    echo "❌ Error: Please run this script from the rag directory"
    echo "📍 Expected location: /Users/rifaterdemsahin/projects/linkedin-content-magician/5_Symbols/rag"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "🔧 Creating vector index from sample documents..."
python index.py --folder sample_docs

echo ""
echo "🔍 Running sample searches..."

echo ""
echo "🎥 Query 1: LinkedIn video creation"
echo "----------------------------------------"
python search.py --query "How to create engaging LinkedIn videos"

echo ""
echo "📊 Query 2: Analytics and metrics"
echo "----------------------------------------"
python search.py --query "measuring social media engagement"

echo ""
echo "🤖 Query 3: AI tools for content"
echo "----------------------------------------"
python search.py --query "AI tools for content creation"

echo ""
echo "📈 Query 4: Personal branding"
echo "----------------------------------------"
python search.py --query "LinkedIn profile optimization"

echo ""
echo "✅ Demo complete! Your RAG system is ready to use."
echo ""
echo "🎯 Try your own queries:"
echo "python search.py --query \"your search query here\""
echo ""
echo "📚 Available documents:"
echo "- linkedin_strategy.md - LinkedIn content strategy"
echo "- video_production.md - Video creation workflow"  
echo "- ai_tools.md - AI tools for content"
echo "- analytics_metrics.md - Social media analytics"
echo "- personal_branding.md - Personal branding guide"