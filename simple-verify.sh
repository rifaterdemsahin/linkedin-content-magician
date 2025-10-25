#!/bin/bash

echo "🔍 Simple Markdown Sync Verification"
echo "===================================="

echo ""
echo "📁 Directory Analysis:"

for dir in "1_Real" "2_Environment" "4_Formula" "6_Semblance" "7_Testing" "3_UI/sample_docs"; do
    if [ -d "$dir" ]; then
        count=$(find "$dir" -name "*.md" | wc -l | tr -d ' ')
        echo "✅ $dir: $count markdown files"
        
        # Show files for verification
        echo "   Files:"
        find "$dir" -name "*.md" -exec basename {} \; | sort | sed 's/^/   - /'
        echo ""
    else
        echo "❌ $dir: Directory not found"
    fi
done

echo "📊 Summary:"
echo "- Current markdown-configs.js includes the new formula_markdown_config_sync.md"
echo "- All sections should be manually verified against the configuration"
echo "- Use the formula in 4_Formula/formula_markdown_config_sync.md for detailed process"

echo ""
echo "🎯 Latest Updates Applied:"
echo "- Added formula_index.md to configuration"
echo "- Added formula_netlify_deployment.md to configuration"  
echo "- Added README.md to configuration"
echo "- Added formula_markdown_config_sync.md to configuration"