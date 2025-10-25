#!/usr/bin/env node

// Simple markdown config checker
const fs = require('fs');
const path = require('path');

// Read and parse the configuration from browser-side JS file
let MarkdownConfigs = {};
try {
    const content = fs.readFileSync('markdown-configs.js', 'utf8');
    // Extract the MarkdownConfigs object
    const start = content.indexOf('const MarkdownConfigs = {');
    const end = content.indexOf('};', start) + 2;
    
    if (start !== -1 && end !== -1) {
        const configPart = content.substring(start, end);
        // Use eval to parse the JavaScript object
        eval(configPart);
    }
} catch (error) {
    console.error('Error reading markdown-configs.js:', error.message);
    process.exit(1);
}

const sections = [
    { dir: '1_Real', key: 'real' },
    { dir: '2_Environment', key: 'environment' },
    { dir: '4_Formula', key: 'formula' },
    { dir: '6_Semblance', key: 'semblance' },
    { dir: '7_Testing', key: 'testing' },
    { dir: '3_UI/sample_docs', key: 'sample_docs' }
];

console.log('🔍 LinkedIn Content Magician - Markdown Config Sync');
console.log('==================================================');
console.log('');
console.log('📊 Current Status Check:');
console.log('------------------------');

let totalConfigured = 0;
let totalActual = 0;
let mismatches = 0;

sections.forEach(({ dir, key }) => {
    if (fs.existsSync(dir)) {
        // Get actual markdown files
        const files = fs.readdirSync(dir);
        const actualFiles = files.filter(file => file.endsWith('.md')).sort();
        const actualCount = actualFiles.length;
        
        // Get configured files
        const configuredFiles = MarkdownConfigs[key] || [];
        const configuredCount = configuredFiles.length;
        
        totalActual += actualCount;
        totalConfigured += configuredCount;
        
        if (actualCount === configuredCount) {
            console.log(`✅ ${dir}: ${actualCount} files (configured: ${configuredCount})`);
        } else {
            console.log(`❌ ${dir}: ${actualCount} files (configured: ${configuredCount}) - MISMATCH`);
            mismatches++;
            
            // Find missing files
            const missingFromConfig = actualFiles.filter(file => !configuredFiles.includes(file));
            const extraInConfig = configuredFiles.filter(file => !actualFiles.includes(file));
            
            if (missingFromConfig.length > 0) {
                console.log('   Missing from config:');
                missingFromConfig.forEach(file => console.log(`   - ${file}`));
            }
            
            if (extraInConfig.length > 0) {
                console.log('   Extra in config (files not found):');
                extraInConfig.forEach(file => console.log(`   - ${file}`));
            }
        }
    } else {
        console.log(`⚠️  ${dir}: Directory not found`);
    }
});

console.log('');
console.log('📈 Summary:');
console.log('-----------');
console.log(`Total actual markdown files: ${totalActual}`);
console.log(`Total configured files: ${totalConfigured}`);
console.log(`Sections with mismatches: ${mismatches}`);

if (mismatches === 0) {
    console.log('');
    console.log('🎉 All sections are properly synchronized!');
    console.log('✅ Configuration is up to date');
} else {
    console.log('');
    console.log('⚠️  Configuration needs updating');
    console.log('💡 Follow the steps in formula_markdown_config_sync.md to fix mismatches');
}

console.log('');
console.log('🔗 For detailed instructions, see:');
console.log('   4_Formula/formula_markdown_config_sync.md');