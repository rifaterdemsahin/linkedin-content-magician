#!/bin/bash

# Formula: Markdown Configuration Sync Script
# Based on the formula_markdown_config_sync.md process
# Usage: ./sync_markdown_configs.sh

echo "🔍 LinkedIn Content Magician - Markdown Config Sync"
echo "=================================================="

# Define sections as arrays
DIRS=("1_Real" "2_Environment" "4_Formula" "6_Semblance" "7_Testing" "3_UI/sample_docs")
CONFIGS=("real" "environment" "formula" "semblance" "testing" "sample_docs")

echo ""
echo "📊 Current Status Check:"
echo "------------------------"

total_configured=0
total_actual=0
mismatches=0

for i in "${!DIRS[@]}"; do
    dir_name="${DIRS[$i]}"
    config_key="${CONFIGS[$i]}"
    
    # Count actual markdown files
    if [ -d "$dir_name" ]; then
        actual_count=$(find "$dir_name" -name "*.md" -type f | wc -l | tr -d ' ')
        
        # Extract configured count from markdown-configs.js
        configured_count=$(node -e "
            const fs = require('fs');
            try {
                let content = fs.readFileSync('markdown-configs.js', 'utf8');
                // Remove the const declaration and other JS syntax
                content = content.replace(/^.*const\s+MarkdownConfigs\s*=\s*/, 'const MarkdownConfigs = ');
                content = content.replace(/\/\*[\s\S]*?\*\//g, '');
                content = content.replace(/\/\/.*$/gm, '');
                
                // Extract just the object part
                const start = content.indexOf('{');
                const end = content.lastIndexOf('};') + 1;
                if (start !== -1 && end !== -1) {
                    const objectPart = 'const MarkdownConfigs = ' + content.substring(start, end);
                    eval(objectPart);
                    const config = MarkdownConfigs['$config_key'];
                    console.log(config ? config.length : 0);
                } else {
                    console.log(0);
                }
            } catch(e) {
                console.log(0);
            }
        " 2>/dev/null || echo "0")
        
        total_configured=$((total_configured + configured_count))
        total_actual=$((total_actual + actual_count))
        
        if [ "$actual_count" -eq "$configured_count" ]; then
            echo "✅ $dir_name: $actual_count files (configured: $configured_count)"
        else
            echo "❌ $dir_name: $actual_count files (configured: $configured_count) - MISMATCH"
            mismatches=$((mismatches + 1))
            
            # Show which files are missing from config
            echo "   Missing from config:"
            find "$dir_name" -name "*.md" -type f -exec basename {} \; | sort > /tmp/actual_$config_key.txt
            node -e "
                const fs = require('fs');
                try {
                    let content = fs.readFileSync('markdown-configs.js', 'utf8');
                    // Remove the const declaration and other JS syntax
                    content = content.replace(/^.*const\s+MarkdownConfigs\s*=\s*/, 'const MarkdownConfigs = ');
                    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
                    content = content.replace(/\/\/.*$/gm, '');
                    
                    // Extract just the object part
                    const start = content.indexOf('{');
                    const end = content.lastIndexOf('};') + 1;
                    if (start !== -1 && end !== -1) {
                        const objectPart = 'const MarkdownConfigs = ' + content.substring(start, end);
                        eval(objectPart);
                        const config = MarkdownConfigs['$config_key'] || [];
                        config.forEach(f => console.log(f));
                    }
                } catch(e) {}
            " 2>/dev/null | sort > /tmp/configured_$config_key.txt
            
            diff /tmp/configured_$config_key.txt /tmp/actual_$config_key.txt | grep "^>" | sed 's/^> /   - /'
        fi
    else
        echo "⚠️  $dir_name: Directory not found"
    fi
done

echo ""
echo "📈 Summary:"
echo "-----------"
echo "Total actual markdown files: $total_actual"
echo "Total configured files: $total_configured"
echo "Sections with mismatches: $mismatches"

if [ "$mismatches" -eq 0 ]; then
    echo ""
    echo "🎉 All sections are properly synchronized!"
    echo "✅ Configuration is up to date"
else
    echo ""
    echo "⚠️  Configuration needs updating"
    echo "💡 Follow the steps in formula_markdown_config_sync.md to fix mismatches"
fi

# Cleanup temp files
rm -f /tmp/actual_*.txt /tmp/configured_*.txt

echo ""
echo "🔗 For detailed instructions, see:"
echo "   4_Formula/formula_markdown_config_sync.md"