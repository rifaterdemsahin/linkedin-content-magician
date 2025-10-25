# N8N Workflow Test Guide 🧪

## Testing the Release Prompts Workflow

### Prerequisites
- N8N instance running and accessible
- OpenRouter API credentials configured
- Telegram bot set up for notifications

### Test Data Payload

Send this test payload to the webhook:

```json
{
  "timestamp": "2025-10-25T10:30:00.000Z",
  "source": "LinkedIn Content Magician - Test",
  "originalPrompt": "AI automation in business",
  "generatedContent": "🎯 AI automation in business\n\nJust finished exploring this fascinating topic! Here's what I discovered:\n\n🔍 The key insight: It's not about replacing humans, it's about amplifying human potential.\n\n💡 What caught my attention:\n• 80% of businesses see ROI within 6 months\n• Most failures come from poor change management\n• The sweet spot is automating repetitive tasks first\n\n🚀 The practical takeaway: Start small, measure everything, scale what works.\n\nWhat's your experience with AI automation? Drop your thoughts below! 👇\n\n#AIAutomation #BusinessTransformation #Innovation",
  "ragSources": ["AI Business Report 2024", "Automation Best Practices Guide"],
  "contentMetrics": {
    "characterCount": 450,
    "wordCount": 85,
    "hashtags": 3,
    "emojis": 8
  },
  "platform": "linkedin",
  "contentType": "post",
  "status": "ready_for_review"
}
```

### Expected Response Structure

The N8N workflow should return:

```json
{
  "timestamp": "2025-10-25T10:30:00.000Z",
  "source": "LinkedIn Content Magician - Test",
  "originalPrompt": "AI automation in business",
  "generatedContent": "...",
  "ragSources": ["AI Business Report 2024", "Automation Best Practices Guide"],
  "contentMetrics": {
    "characterCount": 450,
    "wordCount": 85,
    "hashtags": 3,
    "emojis": 8
  },
  "platform": "linkedin",
  "contentType": "post",
  "releasePrompts": {
    "textPrompts": [
      {
        "title": "LinkedIn Carousel Post",
        "category": "text",
        "platform": "linkedin",
        "format": "carousel",
        "description": "10-slide LinkedIn carousel for professional engagement",
        "prompt": "Create a 10-slide LinkedIn carousel about \"AI automation in business\". Each slide should have:\n- Slide 1: Hook/Title\n- Slides 2-8: Key points with actionable insights\n- Slide 9: Call-to-action\n- Slide 10: About me/contact\n\nUse this content as reference: [generated content]"
      }
      // ... 4 more text prompts
    ],
    "imagePrompts": [
      // ... 5 image prompts
    ],
    "videoPrompts": [
      // ... 3 video prompts  
    ],
    "marketingPrompts": [
      // ... 2 marketing prompts
    ],
    "usageTips": [
      "Copy these prompts to your AI tools (ChatGPT, Claude, Midjourney, etc.)",
      "Customize the prompts with your specific brand voice and requirements",
      "Use the generated content across multiple platforms for maximum reach",
      "Track performance and iterate based on engagement metrics"
    ]
  },
  "status": "release_prompts_generated"
}
```

### Validation Checklist

- [ ] **Webhook receives data** - N8N workflow triggers successfully
- [ ] **AI Agent processes** - Content generation works (if needed)
- [ ] **Release Prompts generated** - JavaScript node executes without errors
- [ ] **15 total prompts created** - 5 text + 5 image + 3 video + 2 marketing
- [ ] **Variable replacement works** - {topic} and {baseContent} are replaced
- [ ] **Telegram notification sent** - Message includes prompt counts
- [ ] **Response returned** - Frontend receives complete data structure

### Testing Commands

Test the webhook directly with curl:

```bash
curl -X POST https://your-n8n-instance.com/webhook/05c91180-4e19-4ccd-8917-658a96008ad9 \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2025-10-25T10:30:00.000Z",
    "source": "LinkedIn Content Magician - Test",
    "originalPrompt": "AI automation in business",
    "generatedContent": "Test content for AI automation...",
    "ragSources": ["test source"],
    "contentMetrics": {"characterCount": 100, "wordCount": 20, "hashtags": 2, "emojis": 3},
    "platform": "linkedin",
    "contentType": "post",
    "status": "ready_for_review"
  }'
```

### Common Issues & Solutions

#### Issue: JavaScript node fails
**Solution**: Check the template data syntax and variable replacement logic

#### Issue: Missing release prompts in response  
**Solution**: Verify the node connections and return structure

#### Issue: Telegram notification not sent
**Solution**: Check Telegram bot credentials and chat ID

#### Issue: Template variables not replaced
**Solution**: Verify the input data structure and replace logic

### Success Indicators

✅ **N8N Execution Log** - All nodes execute successfully  
✅ **Telegram Message** - Notification received with prompt counts  
✅ **Response Data** - Complete releasePrompts object returned  
✅ **Frontend Display** - All 15 prompts render correctly  
✅ **Copy Functionality** - Each prompt can be copied to clipboard  

### Performance Metrics

- **Workflow Execution Time**: < 10 seconds
- **Response Size**: ~15-20KB
- **Template Generation**: All 15 prompts created
- **Error Rate**: 0% for valid inputs

This testing guide ensures the N8N workflow properly transforms LinkedIn content into comprehensive release prompts for multi-platform content strategy.