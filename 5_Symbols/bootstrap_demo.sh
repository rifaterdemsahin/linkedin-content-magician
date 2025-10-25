#!/bin/bash

# Bootstrap Responsive Demo Script
# This script demonstrates the responsive features of the LinkedIn Content Magician

echo "🚀 LinkedIn Content Magician - Bootstrap Demo"
echo "============================================="
echo ""

# Check if the development server is running
if curl -s http://localhost:5175/linkedin-content-magician/ > /dev/null; then
    echo "✅ Development server is running on http://localhost:5175/linkedin-content-magician/"
else
    echo "❌ Development server is not running. Please start it with:"
    echo "   cd 5_Symbols && npm run dev"
    exit 1
fi

echo ""
echo "📱 Responsive Testing Checklist:"
echo "================================"
echo ""

echo "✅ Desktop View (> 992px):"
echo "   - 4-column stats layout"
echo "   - Full navigation visible"
echo "   - Large typography"
echo "   - Sidebar social links"
echo ""

echo "✅ Tablet View (768px - 992px):"
echo "   - 2-column stats layout"
echo "   - Responsive navigation"
echo "   - Medium typography"
echo "   - Centered social links"
echo ""

echo "✅ Mobile View (< 768px):"
echo "   - Single column layout"
echo "   - Collapsed navigation"
echo "   - Small typography"
echo "   - Stacked social links"
echo ""

echo "🎯 Key Bootstrap Features Implemented:"
echo "======================================"
echo ""
echo "📦 Grid System:"
echo "   - Container-fluid for full width"
echo "   - Responsive columns (sm, md, lg, xl)"
echo "   - Gutters and spacing utilities"
echo ""

echo "🎨 Components:"
echo "   - React Bootstrap Cards"
echo "   - Tab Navigation"
echo "   - Forms with validation"
echo "   - Buttons with variants"
echo "   - Alerts and Badges"
echo ""

echo "🎭 Styling:"
echo "   - Custom glassmorphism cards"
echo "   - Dark theme integration"
echo "   - Gradient backgrounds"
echo "   - Hover animations"
echo ""

echo "📱 Responsive Utilities:"
echo "   - Display utilities (d-flex, d-none)"
echo "   - Spacing utilities (m-, p-, g-)"
echo "   - Text utilities (text-center, text-lg-start)"
echo "   - Flexbox utilities (justify-content, align-items)"
echo ""

echo "🧪 Testing Instructions:"
echo "========================"
echo ""
echo "1. Open your browser developer tools (F12)"
echo "2. Click the responsive design mode icon"
echo "3. Test different device sizes:"
echo "   - iPhone SE (375px)"
echo "   - iPad (768px)"
echo "   - Desktop (1200px)"
echo ""
echo "4. Verify responsive behavior:"
echo "   - Layout adaptation"
echo "   - Navigation changes"
echo "   - Typography scaling"
echo "   - Component reflow"
echo ""

echo "🔧 Browser Commands:"
echo "===================="
echo ""
echo "Chrome: Ctrl+Shift+M (Windows) / Cmd+Shift+M (Mac)"
echo "Firefox: Ctrl+Shift+M (Windows) / Cmd+Shift+M (Mac)"
echo "Safari: Develop > Enter Responsive Design Mode"
echo ""

echo "📊 Breakpoints to Test:"
echo "======================"
echo ""
echo "• 320px  - Small mobile"
echo "• 375px  - iPhone SE"
echo "• 414px  - iPhone Plus"
echo "• 576px  - Bootstrap SM"
echo "• 768px  - Bootstrap MD (iPad)"
echo "• 992px  - Bootstrap LG"
echo "• 1200px - Bootstrap XL"
echo "• 1400px - Bootstrap XXL"
echo ""

echo "🎉 Demo Complete!"
echo "================"
echo ""
echo "The application is now running with Bootstrap 5 responsive design."
echo "All components adapt to different screen sizes automatically."
echo ""
echo "📖 For more details, see: BOOTSTRAP_README.md"
echo ""

# Open the browser automatically if on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🌐 Opening browser automatically..."
    open http://localhost:5175/linkedin-content-magician/
fi