# N8N Release Prompts Workflow Documentation 🚀

## Overview
The LinkedIn Content Magician now features an enhanced N8N workflow that automatically generates comprehensive release prompts from LinkedIn content. This workflow creates a complete content ecosystem for multi-platform distribution.

## Workflow Structure

### 1. **Webhook Trigger** 
- Receives POST requests from the LinkedIn Content Magician frontend
- Webhook URL: `https://your-n8n-instance.com/webhook/05c91180-4e19-4ccd-8917-658a96008ad9`

### 2. **AI Agent - Generate Content**
- Uses OpenRouter Chat Model for content generation
- Creates LinkedIn post based on provided prompts and RAG sources
- Returns structured content with metrics

### 3. **Generate Release Prompts** (NEW)
- JavaScript node that generates comprehensive content templates
- Uses the template system from `/templates/release-prompts-template.json`
- Creates 15 different types of content prompts across 4 categories

### 4. **Telegram Notification**
- Sends completion notification to configured Telegram channel
- Includes content statistics and release prompt counts

### 5. **Response to Webhook**
- Returns complete data structure to frontend
- Includes original content + generated release prompts

## Input Format

```json
{
  "timestamp": "2025-10-25T...",
  "source": "LinkedIn Content Magician",
  "originalPrompt": "user input topic",
  "generatedContent": "AI-generated LinkedIn post",
  "ragSources": ["source1", "source2"],
  "contentMetrics": {
    "characterCount": 450,
    "wordCount": 85,
    "hashtags": 3,
    "emojis": 8
  },
  "platform": "linkedin",
  "contentType": "post|release_prompts_request",
  "status": "ready_for_review"
}
```

## Output Format

```json
{
  // ... all input data
  "releasePrompts": {
    "textPrompts": [
      {
        "title": "LinkedIn Carousel Post",
        "category": "text",
        "platform": "linkedin", 
        "format": "carousel",
        "description": "10-slide LinkedIn carousel for professional engagement",
        "prompt": "Create a 10-slide LinkedIn carousel about \"topic\"..."
      }
      // ... 4 more text prompts
    ],
    "imagePrompts": [
      {
        "title": "Hero Image",
        "category": "image",
        "platform": "social",
        "format": "hero", 
        "description": "Professional hero image for social media",
        "prompt": "Create a professional hero image for \"topic\"..."
      }
      // ... 4 more image prompts
    ],
    "videoPrompts": [
      {
        "title": "Short-form Video (TikTok/Reels)",
        "category": "video",
        "platform": "social",
        "format": "short",
        "description": "30-60 second vertical video",
        "prompt": "Create a 30-60 second vertical video about \"topic\"..."
      }
      // ... 2 more video prompts
    ],
    "marketingPrompts": [
      {
        "title": "Social Media Campaign",
        "category": "marketing", 
        "platform": "multi",
        "format": "campaign",
        "description": "7-day multi-platform campaign",
        "prompt": "Design a 7-day social media campaign for \"topic\"..."
      }
      // ... 1 more marketing prompt
    ],
    "usageTips": [
      "Copy these prompts to your AI tools (ChatGPT, Claude, Midjourney, etc.)",
      "Customize the prompts with your specific brand voice and requirements",
      "Use the generated content across multiple platforms for maximum reach", 
      "Track performance and iterate based on engagement metrics"
    ]
  },
  "status": "release_prompts_generated",
  "timestamp": "2025-10-25T..."
}
```

## Content Categories Generated

### 📝 Text Content Prompts (5 types)
1. **LinkedIn Carousel Post** - 10-slide professional carousel
2. **Twitter Thread** - 8-12 tweet engaging thread  
3. **Blog Article Outline** - SEO-optimized blog structure
4. **Video Script** - 3-5 minute video with timing
5. **Email Newsletter** - Complete newsletter with subject lines

### 🎨 Image Generation Prompts (5 types)
1. **Hero Image** - Professional social media hero (1200x627px)
2. **Infographic** - Data-driven visual content
3. **Carousel Slides** - Instagram/LinkedIn graphics (1080x1080px)
4. **Quote Graphics** - Shareable quote designs
5. **Video Thumbnail** - Eye-catching YouTube thumbnail

### 🎥 Video Content Prompts (3 types)
1. **Short-form Video** - TikTok/Reels (30-60 seconds)
2. **YouTube Video** - Long-form educational (10-15 minutes)
3. **Tutorial Video** - Step-by-step instructional

### 📈 Marketing & Campaign Prompts (2 types)
1. **Social Media Campaign** - 7-day multi-platform strategy
2. **Landing Page Copy** - Conversion-optimized web copy

## Template Variables

The system uses dynamic variable replacement:
- `{topic}` - The main topic from originalPrompt
- `{baseContent}` - The generated LinkedIn content

## Frontend Integration

### Generate Release Prompts Function
The frontend `generateReleasePrompts()` function now:

1. **Checks for existing prompts** - Avoids regeneration
2. **Attempts N8N generation** - If configured and connected
3. **Falls back to local generation** - If N8N fails
4. **Updates post status** - Marks as 'release_ready'
5. **Displays N8N results** - Shows success/error messages

### Usage Flow
1. User generates LinkedIn content
2. Content appears in "Review & Prepare Release" tab
3. User clicks "Generate Release Prompts" 
4. System tries N8N first, then local fallback
5. 15 comprehensive prompts are generated
6. User can copy prompts to AI tools (ChatGPT, Midjourney, etc.)

## Benefits

### 🚀 **Comprehensive Content Ecosystem**
- Single LinkedIn post → 15 different content formats
- Multi-platform distribution strategy
- Professional prompt engineering

### 🎯 **Template-Driven Consistency**
- Standardized prompt structures
- Brand color specifications (#58A6FF, #A371F7)
- Platform-specific optimizations

### 🔄 **Flexible Architecture**
- N8N cloud processing when available
- Local fallback for reliability
- Template system for easy updates

### 📊 **Enhanced Workflow**
- Telegram notifications with metrics
- Full audit trail and debugging
- Usage tips for optimal results

## Configuration

### N8N Setup
1. Import the workflow JSON
2. Configure OpenRouter credentials
3. Set up Telegram bot for notifications
4. Update webhook URLs in frontend

### Frontend Configuration
1. Set N8N webhook URL in settings
2. Test connection before use
3. Monitor N8N results panel for debugging

## Troubleshooting

### Common Issues
- **N8N Connection Failed**: Check webhook URL and network
- **Missing Release Prompts**: Verify N8N workflow is active
- **Template Errors**: Check variable replacement in JavaScript node

### Debug Information
- Frontend shows N8N response data
- Telegram notifications include prompt counts
- Console logs track generation attempts

## Future Enhancements

### Planned Features
- Custom template management
- Brand voice training integration
- Analytics for prompt performance
- Automated content publishing
- Multi-language prompt generation

This enhanced workflow transforms a single content idea into a comprehensive multi-platform content strategy, maximizing reach and engagement across all digital channels.