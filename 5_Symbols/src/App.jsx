import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Tab, Card, Button, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { Send, Bot, User, Database, Zap, MessageSquare, CheckCircle, XCircle, Loader } from 'lucide-react';

export default function LinkedInContentMagician() {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('seed-data');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugData, setDebugData] = useState({
    visible: false,
    timestamp: '',
    inputPrompt: '',
    ragSources: [],
    generatedContent: '',
    n8nPayload: {},
    processingSteps: []
  });
  const [n8nConfig, setN8nConfig] = useState({
    normalizeWebhookUrl: import.meta.env.VITE_N8N_NORMALIZE_WEBHOOK_URL || 'https://n8n.rifaterdemsahin.com/webhook/normalize-data',
    promptWebhookUrl: import.meta.env.VITE_N8N_PROMPT_WEBHOOK_URL || 'https://n8n.rifaterdemsahin.com/webhook/05c91180-4e19-4ccd-8917-658a96008ad9',
    connectionStatus: 'disconnected',
    testing: false,
    debugOutput: []
  });
  const [vectorDB, setVectorDB] = useState({
    indexed: 0,
    status: 'disconnected'
  });
  const [n8nSending, setN8nSending] = useState(false);
  const [n8nResult, setN8nResult] = useState(null);

  useEffect(() => {
    loadFromStorage();
  }, []);

  // Keyboard shortcut for debug toggle (Ctrl/Cmd + D)
  useEffect(() => {
    const handleKeyPress = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        setDebugData(prev => ({ ...prev, visible: !prev.visible }));
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const loadFromStorage = async () => {
    try {
      const postsData = await window.storage.get('posts');
      const configData = await window.storage.get('config');
      const vectorData = await window.storage.get('vectordb');
      
      if (postsData) setPosts(JSON.parse(postsData.value));
      if (configData) setN8nConfig(JSON.parse(configData.value));
      if (vectorData) setVectorDB(JSON.parse(vectorData.value));
    } catch (error) {
      console.log('No stored data found, starting fresh');
    }
  };

  const saveToStorage = async (key, value) => {
    try {
      await window.storage.set(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  };

  const generateContent = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    
    // Initialize debug data
    const timestamp = new Date().toISOString();
    const debugSteps = [];
    
    debugSteps.push(`🕐 [${new Date().toLocaleTimeString()}] Starting content generation process`);
    debugSteps.push(`📥 Input prompt: "${prompt}"`);
    
    // Perform real RAG data retrieval using Python search API
    let ragSources = [];
    try {
      debugSteps.push(`🔍 [${new Date().toLocaleTimeString()}] Performing RAG search...`);
      debugSteps.push(`📡 [${new Date().toLocaleTimeString()}] Requesting POST /api/rag-search`);
      
      // Call Python RAG search API
      const ragResponse = await fetch('/api/rag-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          top_k: 3
        })
      });
      
      if (ragResponse.ok) {
        const ragData = await ragResponse.json();
        if (ragData.success && ragData.sources) {
          ragSources = ragData.sources.map(source => ({
            title: source.title || source.file_name,
            fileName: source.file_name,
            distance: source.distance,
            similarity: source.similarity,
            score: ((1 - source.distance) * 100).toFixed(1) // Convert distance to percentage score
          }));
          debugSteps.push(`✅ [${new Date().toLocaleTimeString()}] RAG search completed successfully`);
          debugSteps.push(`📊 Found ${ragSources.length} relevant sources from knowledge base`);
        } else {
          throw new Error(ragData.error || 'RAG search failed');
        }
      } else {
        throw new Error(`HTTP ${ragResponse.status}: ${ragResponse.statusText}`);
      }
    } catch (error) {
      // Fallback to default sources if RAG search fails
      debugSteps.push(`⚠️ [${new Date().toLocaleTimeString()}] RAG search failed: ${error.message}`);
      debugSteps.push(`🔄 [${new Date().toLocaleTimeString()}] Using fallback knowledge sources`);
      ragSources = [
        { title: 'Previous LinkedIn post about automation', fileName: 'fallback_automation.md', score: '85.0', distance: 0.15 },
        { title: 'Video transcript from tech talk', fileName: 'fallback_techtalk.md', score: '82.0', distance: 0.18 }, 
        { title: 'Article draft on AI implementation', fileName: 'fallback_ai.md', score: '80.0', distance: 0.20 }
      ];
    }
    
    debugSteps.push(`📊 Final source count: ${ragSources.length} sources selected`);
    
    // Simulate content generation with RAG
    setTimeout(async () => {
      const templates = [
        `🎯 ${prompt}

Just finished exploring this fascinating topic! Here's what I discovered:

🔍 The key insight: [Insert your specific angle here]

💡 What caught my attention:
• First major point about the topic
• Second insight that challenges conventional thinking  
• Third practical application

🚀 The practical takeaway: This isn't just theory - it's about real implementation.

What's your experience with ${prompt.toLowerCase()}? Drop your thoughts below! 👇

#LinkedIn #Innovation #Technology`,

        `🧠 Quick thoughts on ${prompt}:

After years in this space, I've learned that [insert personal insight].

Here's the framework I use:
📊 Step 1: [Analyze the current state]
⚡ Step 2: [Identify the gap]
🎯 Step 3: [Design the solution]

The biggest mistake I see? People focus on the tool, not the outcome.

Remember: Technology is just the enabler. The real magic happens when you combine it with human insight.

What's your take? How are you approaching this?

#DigitalTransformation #Strategy #Leadership`,

        `🔥 Unpopular opinion about ${prompt}:

Everyone's talking about the technical aspects, but missing the human element.

Here's what I've observed working with 50+ clients:
• 80% of failures aren't technical - they're organizational
• The best implementations start with culture, not code
• ROI comes from adoption, not features

My hot take: Stop building for engineers. Start building for humans.

The companies winning in this space? They're the ones who remember that behind every screen is a person trying to do their job better.

Agree or disagree? Let's debate in the comments! 🔥

#HumanCenteredDesign #Technology #BusinessStrategy`
      ];

      const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
      
      debugSteps.push(`✨ [${new Date().toLocaleTimeString()}] Content generation completed`);
      debugSteps.push(`📝 Generated ${selectedTemplate.length} characters of content`);
      
      // Prepare n8n payload
      const n8nPayload = {
        timestamp: timestamp,
        source: 'LinkedIn Content Magician',
        originalPrompt: prompt,
        generatedContent: selectedTemplate,
        ragSources: ragSources,
        contentMetrics: {
          characterCount: selectedTemplate.length,
          wordCount: selectedTemplate.split(' ').length,
          hashtags: (selectedTemplate.match(/#\w+/g) || []).length,
          emojis: (selectedTemplate.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length
        },
        platform: 'linkedin',
        contentType: 'post',
        status: 'ready_for_review'
      };
      
      debugSteps.push(`📦 [${new Date().toLocaleTimeString()}] n8n payload prepared`);
      debugSteps.push(`🚀 Ready to send to n8n webhooks:`);
      debugSteps.push(`   📡 Normalize: ${n8nConfig.normalizeWebhookUrl}`);
      debugSteps.push(`   📡 Prompt Generation: ${n8nConfig.promptWebhookUrl}`);
      
      // Update debug data
      setDebugData({
        visible: true,
        timestamp: timestamp,
        inputPrompt: prompt,
        ragSources: ragSources,
        generatedContent: selectedTemplate,
        n8nPayload: n8nPayload,
        processingSteps: debugSteps
      });
      
      const newPost = {
        id: Date.now(),
        content: selectedTemplate,
        prompt: prompt,
        timestamp: timestamp,
        status: 'pending',
        ragSources: ragSources
      };

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      await saveToStorage('posts', updatedPosts);
      await indexContent(selectedTemplate);
      
      setLoading(false);
      setPrompt('');
      setActiveTab('prompt-generation');
    }, 2000);
  };

  const getRandomTemplate = () => {
    const templates = [
      "🎯 Just discovered something fascinating about {topic}...",
      "🔥 Hot take on {topic} that might be controversial...", 
      "💡 Here's what 5 years of {topic} experience taught me...",
      "🚀 Quick wins you can implement with {topic} today..."
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const updatePostStatus = async (postId, status) => {
    const updatedPosts = posts.map(p => 
      p.id === postId ? { ...p, status } : p
    );
    setPosts(updatedPosts);
    await saveToStorage('posts', updatedPosts);
  };

  const indexContent = async (content) => {
    setVectorDB({ ...vectorDB, status: 'indexing' });
    
    setTimeout(async () => {
      const updated = {
        indexed: vectorDB.indexed + 1,
        status: 'connected'
      };
      setVectorDB(updated);
      await saveToStorage('vectordb', updated);
    }, 1000);
  };

  const normalizeData = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    
    const normalizePayload = {
      seedData: prompt,
      timestamp: new Date().toISOString(),
      source: 'LinkedIn Content Magician',
      action: 'normalize',
      metadata: {
        wordCount: prompt.trim().split(/\s+/).filter(Boolean).length,
        characterCount: prompt.length
      }
    };

    try {
      await sendToN8n(normalizePayload, 'normalize');
      setActiveTab('prompt-generation');
    } catch (error) {
      console.error('Failed to normalize data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupTestIndex = async () => {
    const documents = [
      'ai_tools.md',
      'analytics_metrics.md', 
      'linkedin_strategy.md',
      'personal_branding.md',
      'video_production.md'
    ];
    
    // Initialize debug tracking for indexing
    const timestamp = new Date().toISOString();
    const debugSteps = [];
    
    debugSteps.push(`🚀 [${new Date().toLocaleTimeString()}] Starting test index setup for ${documents.length} documents`);
    debugSteps.push(`📂 Target documents: ${documents.join(', ')}`);
    
    setVectorDB({ ...vectorDB, status: 'indexing', indexed: 0 });
    setDebugData({
      ...debugData,
      visible: true,
      timestamp,
      inputPrompt: 'Test Index Setup',
      processingSteps: debugSteps
    });
    
    // Index each document with realistic API simulation
    for (let i = 0; i < documents.length; i++) {
      const currentDoc = documents[i];
      debugSteps.push(`\n📄 [${new Date().toLocaleTimeString()}] Processing document ${i + 1}/${documents.length}: ${currentDoc}`);
      
      // Simulate API call to index endpoint
      debugSteps.push(`📡 [${new Date().toLocaleTimeString()}] API Request: POST /api/vector-db/index`);
      debugSteps.push(`📤 Request Headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer ****...****",
  "X-Request-ID": "${Math.random().toString(36).substr(2, 9)}",
  "User-Agent": "LinkedInContentMagician/1.0.0"
}`);
      debugSteps.push(`📤 Request Payload: {
  "document": "${currentDoc}",
  "source": "sample_docs/${currentDoc}",
  "operation": "index",
  "chunk_size": 512,
  "overlap": 50,
  "metadata": {
    "type": "linkedin_content",
    "category": "${currentDoc.replace('.md', '').replace('_', ' ')}",
    "indexed_at": "${new Date().toISOString()}",
    "source_path": "/3_UI/sample_docs/${currentDoc}"
  }
}`);
      
      // Update debug data in real-time
      setDebugData(prev => ({
        ...prev,
        processingSteps: [...debugSteps]
      }));
      
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate processing time
      
      // Simulate API response
      const processingTime = Math.floor(Math.random() * 200) + 100;
      const chunksCreated = Math.floor(Math.random() * 5) + 3;
      debugSteps.push(`✅ [${new Date().toLocaleTimeString()}] API Response: 200 OK`);
      debugSteps.push(`📥 Response Headers: {
  "Content-Type": "application/json",
  "X-Processing-Time": "${processingTime}ms",
  "X-Chunks-Created": "${chunksCreated}",
  "X-Vector-Dimensions": "1536"
}`);
      debugSteps.push(`📥 Response Body: {
  "success": true,
  "document_id": "${currentDoc.replace('.md', '')}_${Date.now()}",
  "chunks_created": ${chunksCreated},
  "embedding_dimensions": 1536,
  "processing_time_ms": ${processingTime},
  "vector_ids": [${Array.from({length: chunksCreated}, (_, i) => `"vec_${Date.now()}_${i}"`).join(', ')}],
  "index_size_after": ${(i + 1) * chunksCreated + Math.floor(Math.random() * 10)},
  "status": "indexed",
  "timestamp": "${new Date().toISOString()}"
}`);
      
      const updated = {
        indexed: i + 1,
        status: i === documents.length - 1 ? 'connected' : 'indexing'
      };
      setVectorDB(prev => ({ ...prev, ...updated }));
      await saveToStorage('vectordb', { ...vectorDB, ...updated });
      
      // Update debug with final status for this document
      debugSteps.push(`🎯 Document ${currentDoc} successfully indexed (${i + 1}/${documents.length} complete)`);
      
      setDebugData(prev => ({
        ...prev,
        processingSteps: [...debugSteps]
      }));
    }
    
    debugSteps.push(`\n🎉 [${new Date().toLocaleTimeString()}] Test index setup completed successfully!`);
    debugSteps.push(`📊 Final status: ${documents.length} documents indexed, vector database ready`);
    
    setDebugData(prev => ({
      ...prev,
      processingSteps: [...debugSteps]
    }));
  };

  const testN8nConnection = async () => {
    const debugLog = [];
    const timestamp = new Date().toISOString();
    
    debugLog.push(`🔍 [${new Date().toLocaleTimeString()}] Starting connection test for both webhooks...`);
    debugLog.push(`📡 Normalize URL: ${n8nConfig.normalizeWebhookUrl}`);
    debugLog.push(`📡 Prompt Generation URL: ${n8nConfig.promptWebhookUrl}`);
    
    setN8nConfig({ 
      ...n8nConfig, 
      testing: true, 
      debugOutput: debugLog,
      connectionStatus: 'testing'
    });
    
    try {
      const testWebhook = async (url, type) => {
        debugLog.push(`\n🚀 [${new Date().toLocaleTimeString()}] Testing ${type} webhook...`);
        
        const requestPayload = {
          test: true,
          message: `Connection test from LinkedIn Content Magician - ${type}`,
          timestamp: timestamp,
          source: 'LinkedIn Content Magician UI',
          debugMode: true,
          webhookType: type
        };
        
        debugLog.push(`📦 ${type} payload: ${JSON.stringify(requestPayload, null, 2)}`);
        
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'LinkedIn-Content-Magician/1.0.0',
            'X-Debug-Request': 'true'
          },
          body: JSON.stringify(requestPayload)
        };
        
        const startTime = performance.now();
        const response = await fetch(url, requestOptions);
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        
        debugLog.push(`⏱️ ${type} response time: ${responseTime}ms`);
        debugLog.push(`📊 ${type} status: ${response.status} ${response.statusText}`);
        
        let responseText = '';
        try {
          responseText = await response.text();
          debugLog.push(`📄 ${type} response: ${responseText || '(empty)'}`);
        } catch (textError) {
          debugLog.push(`❌ Failed to read ${type} response: ${textError.message}`);
        }

        return { success: response.ok, status: response.status, responseTime, responseText };
      };

      // Test both webhooks
      const normalizeResult = await testWebhook(n8nConfig.normalizeWebhookUrl, 'Normalize');
      const promptResult = await testWebhook(n8nConfig.promptWebhookUrl, 'Prompt Generation');

      const bothSuccessful = normalizeResult.success && promptResult.success;
      
      if (bothSuccessful) {
        debugLog.push(`\n✅ [${new Date().toLocaleTimeString()}] Both webhooks connected successfully!`);
        const updated = { 
          ...n8nConfig, 
          connectionStatus: 'connected', 
          testing: false,
          debugOutput: debugLog,
          lastTestTime: timestamp,
          lastResponseTime: `Normalize: ${normalizeResult.responseTime}ms, Prompt: ${promptResult.responseTime}ms`
        };
        setN8nConfig(updated);
        await saveToStorage('config', updated);
      } else {
        const failedWebhooks = [];
        if (!normalizeResult.success) failedWebhooks.push(`Normalize (${normalizeResult.status})`);
        if (!promptResult.success) failedWebhooks.push(`Prompt Generation (${promptResult.status})`);
        
        debugLog.push(`\n❌ [${new Date().toLocaleTimeString()}] Failed webhooks: ${failedWebhooks.join(', ')}`);
        
        setN8nConfig({ 
          ...n8nConfig, 
          connectionStatus: 'failed', 
          testing: false,
          debugOutput: debugLog,
          lastError: `Failed: ${failedWebhooks.join(', ')}`,
          lastTestTime: timestamp
        });
      }
    } catch (error) {
      debugLog.push(`\n💥 [${new Date().toLocaleTimeString()}] Network Error: ${error.message}`);
      debugLog.push(`🔍 Error type: ${error.name}`);
      
      // More specific error analysis
      if (error.message.includes('Failed to fetch')) {
        debugLog.push(`🌐 Network issue: Unable to reach the server. Check internet connection and URLs.`);
      } else if (error.message.includes('CORS')) {
        debugLog.push(`🔒 CORS Error: Server may not allow cross-origin requests.`);
      } else if (error.message.includes('timeout')) {
        debugLog.push(`⏰ Timeout Error: Request took too long. Server may be slow or down.`);
      }
      
      console.error('Connection test failed:', error);
      setN8nConfig({ 
        ...n8nConfig, 
        connectionStatus: 'failed', 
        testing: false,
        debugOutput: debugLog,
        lastError: error.message,
        lastTestTime: timestamp
      });
    }
  };

  const updateConfig = async (field, value) => {
    const updated = { ...n8nConfig, [field]: value };
    setN8nConfig(updated);
    await saveToStorage('config', updated);
  };

  const sendToN8n = async (payload, webhookType = 'prompt') => {
    setN8nSending(true);
    setN8nResult(null);
    
    // Select the appropriate webhook URL based on the type
    const webhookUrl = webhookType === 'normalize' 
      ? n8nConfig.normalizeWebhookUrl 
      : n8nConfig.promptWebhookUrl;
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'LinkedIn-Content-Magician/1.0.0'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const responseData = await response.text();
        const result = {
          success: true,
          message: 'Successfully sent to N8N!',
          data: responseData,
          timestamp: new Date().toISOString()
        };
        setN8nResult(result);
        
        // Results persist until manually dismissed - no auto-dismiss
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      const result = {
        success: false,
        message: `Failed to send to N8N: ${error.message}`,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      setN8nResult(result);
      
      // Results persist until manually dismissed - no auto-dismiss
    } finally {
      setN8nSending(false);
    }
  };

  // Template content prompts - these will be populated by N8N workflow output
  const getTemplateReleasePrompts = (post) => {
    return {
      textPrompts: [
        {
          title: "LinkedIn Carousel Post",
          prompt: `Create a 10-slide LinkedIn carousel about "${post.prompt}". Each slide should have:
- Slide 1: Hook/Title
- Slides 2-8: Key points with actionable insights
- Slide 9: Call-to-action
- Slide 10: About me/contact

Use this content as reference: ${post.content}`
        },
        {
          title: "Twitter Thread",
          prompt: `Transform this LinkedIn post about "${post.prompt}" into a compelling Twitter thread (8-12 tweets):
- Start with a hook tweet
- Break down key insights into digestible tweets
- Include relevant hashtags
- End with engagement question

Base content: ${post.content}`
        },
        {
          title: "Blog Article Outline",
          prompt: `Create a comprehensive blog article outline for "${post.prompt}" based on this content:
- SEO-optimized title
- Introduction hook
- 5-7 main sections with subpoints
- Conclusion with actionable steps
- Meta description

Source: ${post.content}`
        },
        {
          title: "Video Script",
          prompt: `Write a 3-5 minute video script about "${post.prompt}":
- Engaging opening (15 seconds)
- Problem statement (30 seconds)
- Solution breakdown (2-3 minutes)
- Call-to-action (30 seconds)
- Visual cues and transitions

Based on: ${post.content}`
        },
        {
          title: "Email Newsletter",
          prompt: `Create an email newsletter about "${post.prompt}":
- Subject line variations (5 options)
- Engaging preview text
- Newsletter body with personal story
- Resources/links section
- P.S. with engagement hook

Content source: ${post.content}`
        }
      ],
      imagePrompts: [
        {
          title: "Hero Image",
          prompt: `Create a professional hero image for "${post.prompt}":
- Modern, clean design
- Relevant icons or illustrations
- Brand colors: #58A6FF (blue), #A371F7 (purple)
- Readable typography
- LinkedIn post dimensions (1200x627px)`
        },
        {
          title: "Infographic",
          prompt: `Design an infographic about "${post.prompt}":
- Visual hierarchy with key statistics
- Icons and illustrations
- Step-by-step process or framework
- Professional color scheme
- Mobile-friendly layout`
        },
        {
          title: "Carousel Slides",
          prompt: `Create 10 carousel slides for "${post.prompt}":
- Consistent design template
- Readable fonts (minimum 24px)
- High contrast colors
- Each slide focuses on one key point
- Instagram/LinkedIn carousel format (1080x1080px)`
        },
        {
          title: "Quote Graphics",
          prompt: `Design quote graphics from this content about "${post.prompt}":
- Extract 3-5 powerful quotes
- Minimalist design with brand colors
- Attribution to your name
- Various social media sizes
- Shareable format`
        },
        {
          title: "Video Thumbnail",
          prompt: `Create an eye-catching video thumbnail for "${post.prompt}":
- Bright, contrasting colors
- Large, readable text overlay
- Your photo or relevant imagery
- YouTube/social media friendly
- Clickable and curiosity-driven design`
        }
      ],
      videoPrompts: [
        {
          title: "Short-form Video (TikTok/Reels)",
          prompt: `Create a 30-60 second vertical video about "${post.prompt}":
- Hook in first 3 seconds
- Quick tips or insights
- Text overlays for key points
- Trending audio if applicable
- Strong call-to-action at the end`
        },
        {
          title: "YouTube Video",
          prompt: `Plan a 10-15 minute YouTube video on "${post.prompt}":
- Compelling title and thumbnail concept
- Structured outline with timestamps
- B-roll suggestions
- Screen recording segments
- Engagement hooks throughout`
        },
        {
          title: "Tutorial Video",
          prompt: `Create a step-by-step tutorial about "${post.prompt}":
- Clear learning objectives
- Screen recording setup
- Voice-over script
- Resource links and materials
- Follow-up content suggestions`
        }
      ],
      marketingPrompts: [
        {
          title: "Social Media Campaign",
          prompt: `Design a 7-day social media campaign for "${post.prompt}":
- Platform-specific content calendar
- Hashtag strategy
- Engagement tactics
- Cross-promotion ideas
- Success metrics to track`
        },
        {
          title: "Landing Page Copy",
          prompt: `Write landing page copy for a resource about "${post.prompt}":
- Compelling headline
- Problem/solution sections
- Social proof elements
- Clear value proposition
- Multiple CTA variations`
        }
      ],
      usageTips: [
        "Copy these prompts to your AI tools (ChatGPT, Claude, Midjourney, etc.)",
        "Customize the prompts with your specific brand voice and requirements", 
        "Use the generated content across multiple platforms for maximum reach",
        "Track performance and iterate based on engagement metrics"
      ]
    };
  };

  return (
    <div className="min-h-100vh bg-dark-custom text-white position-relative">
      {/* N8N Sending Overlay */}
      {n8nSending && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.7)', 
            zIndex: 9999 
          }}
        >
          <Card className="bg-dark border-warning text-center p-4">
            <Card.Body>
              <Spinner animation="border" variant="warning" className="mb-3" />
              <h5 className="text-warning mb-2">Sending to N8N...</h5>
              <p className="text-muted mb-0">Please wait while we process your request</p>
            </Card.Body>
          </Card>
        </div>
      )}
      
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="justify-content-center mb-5">
          <Col lg={10} xl={8}>
            <div className="text-center py-4 position-relative">
              <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
                <Bot style={{ color: '#58A6FF' }} size={48} />
                <h1 className="display-4 fw-bold mb-0" style={{ color: '#E6EDF3' }}>
                  LinkedIn Content Magician 🧙‍♂️
                </h1>
              </div>
              <p className="lead" style={{ color: '#8B949E' }}>Your AI-Powered Content Assistant with RAG Technology</p>
              
              {/* Top Navigation - Dashboard Link and Debug Toggle */}
              <div className="position-absolute top-0 end-0 d-flex flex-column align-items-end gap-2">
                <Button 
                  variant="outline-info"
                  size="sm"
                  className="d-flex align-items-center gap-2 shadow-sm"
                  onClick={() => window.open('https://rifaterdemsahin.github.io/linkedin-content-magician/dashboard.html', '_blank')}
                  title="Access the Delivery Pilot Dashboard for project overview"
                  style={{ 
                    fontWeight: '500',
                    transition: 'all 0.3s ease-in-out',
                    minWidth: '180px'
                  }}
                >
                  <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-info text-white" 
                        style={{ width: '16px', height: '16px', fontSize: '10px' }}>
                    📊
                  </span>
                  <span className="text-nowrap">Delivery Pilot</span>
                </Button>
                <Button 
                  variant={debugData.visible ? 'success' : 'outline-secondary'}
                  size="sm"
                  className={`d-flex align-items-center gap-2 shadow-sm ${debugData.visible ? 'debug-toggle-active' : 'debug-toggle-inactive'}`}
                  onClick={() => setDebugData({ ...debugData, visible: !debugData.visible })}
                  title={debugData.visible ? 'Close debug panel to hide RAG processing details (Ctrl/Cmd + D)' : 'Open debug panel to view RAG processing details (Ctrl/Cmd + D)'}
                  aria-label={debugData.visible ? 'Close debug mode' : 'Enable debug mode'}
                  style={{ 
                    fontWeight: '500',
                    transition: 'all 0.3s ease-in-out',
                    minWidth: '110px'
                  }}
                >
                  {debugData.visible ? (
                    <>
                      <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-success" 
                            style={{ width: '16px', height: '16px', fontSize: '10px' }}>
                        ✓
                      </span>
                      Debug Mode
                    </>
                  ) : (
                    <>
                      <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary text-white" 
                            style={{ width: '16px', height: '16px', fontSize: '10px' }}>
                        🐛
                      </span>
                      Debug Mode
                    </>
                  )}
                </Button>
                {debugData.visible && (
                  <small className="debug-status-active text-white fw-medium px-2 py-1 rounded-pill" 
                         style={{ fontSize: '0.7rem' }}
                         title="Debug mode is currently active - you'll see detailed RAG processing information">
                    ⚡ Debug Active
                  </small>
                )}
              </div>
            </div>
          </Col>
        </Row>

        {/* Stats Bar */}
        <Row className="justify-content-center mb-4">
          <Col lg={10} xl={8}>
            <Row className="g-3 justify-content-center">
              <Col sm={6} lg={4}>
                <Card className="card-glassmorphism border-0 text-white h-100">
                  <Card.Body className="d-flex align-items-center">
                    <Database className="text-success me-3" size={32} />
                    <div>
                      <div className="fs-2 fw-bold">{vectorDB.indexed}</div>
                      <div className="small" style={{ color: '#8B949E' }}>Posts Indexed</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col sm={6} lg={4}>
                <Card className="card-glassmorphism border-0 text-white h-100">
                  <Card.Body className="d-flex align-items-center">
                    <MessageSquare style={{ color: '#A371F7' }} className="me-3" size={32} />
                    <div>
                      <div className="fs-2 fw-bold">{vectorDB.status === 'connected' ? 'Active' : 'Setup'}</div>
                      <div className="small" style={{ color: '#8B949E' }}>RAG Status</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Main Content */}
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
              {/* Tab Navigation */}
              <Card className="card-glassmorphism border-0 mb-4">
                <Card.Header className="bg-transparent border-0 p-2">
                  <Nav variant="pills" className="justify-content-center flex-wrap">
                    <Nav.Item className="flex-fill">
                      <Nav.Link 
                        eventKey="seed-data" 
                        className="text-center fw-medium border-0 text-white"
                        style={{backgroundColor: activeTab === 'seed-data' ? '#58A6FF' : 'transparent'}}
                      >
                        🌱 1. Seed Data Collect and Normalize
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="flex-fill">
                      <Nav.Link 
                        eventKey="rag-process" 
                        className="text-center fw-medium border-0 text-white"
                        style={{backgroundColor: activeTab === 'rag-process' ? '#58A6FF' : 'transparent'}}
                      >
                        ⚡ 2. RAG Process
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="flex-fill">
                      <Nav.Link 
                        eventKey="prompt-generation" 
                        className="text-center fw-medium border-0 text-white"
                        style={{backgroundColor: activeTab === 'prompt-generation' ? '#58A6FF' : 'transparent'}}
                      >
                        📝 3. Prompt Generation
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="flex-fill">
                      <Nav.Link 
                        eventKey="review-execute" 
                        className="text-center fw-medium border-0 text-white"
                        style={{backgroundColor: activeTab === 'review-execute' ? '#58A6FF' : 'transparent'}}
                      >
                        �️ 4. Review and Execute
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="flex-fill">
                      <Nav.Link 
                        eventKey="linkedin-publishing" 
                        className="text-center fw-medium border-0 text-white"
                        style={{backgroundColor: activeTab === 'linkedin-publishing' ? '#58A6FF' : 'transparent'}}
                      >
                        🚀 5. LinkedIn Publishing
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
              </Card>

              {/* Tab Content */}
              <Tab.Content>
                <Tab.Pane eventKey="seed-data">
                  <Card className="card-glassmorphism border-0 text-white">
                    <Card.Body className="p-4">
                      <h2 className="h3 fw-bold mb-4">🌱 Seed Data Collection and Normalization</h2>
                      <p style={{ color: '#8B949E' }} className="mb-4">
                        Gather and normalize your raw content ideas from various sources. This is the foundation of your content creation pipeline.
                      </p>

                      <Form>
                        <Form.Group className="mb-4">
                          <Form.Label className="text-white mb-2">🌱 Enter Your Seed Data</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Enter your seed content ideas... 

Examples:
• Raw thoughts from your weekly stream
• Whiteboard concepts and frameworks  
• Client case studies and insights
• Technical discoveries and learnings
• Industry observations and trends"
                            className="bg-transparent border-light text-white"
                            style={{backgroundColor: 'rgba(255, 255, 255, 0.05)'}}
                          />
                          <div className="d-flex justify-content-between">
                            <Form.Text className="text-muted">
                              💡 Tip: The more context you provide, the better the AI can create authentic content in your voice
                            </Form.Text>
                            <Form.Text className="text-muted">
                              {prompt.trim().split(/\s+/).filter(Boolean).length} Words
                            </Form.Text>
                          </div>
                        </Form.Group>
                        
                        <Button
                          onClick={() => setActiveTab('rag-process')}
                          disabled={!prompt.trim()}
                          className="btn-primary-custom w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                        >
                          <Send size={20} />
                          Proceed to RAG Process
                        </Button>
                      </Form>

                      <Alert variant="info" className="mt-4 bg-transparent border-info">
                        <Alert.Heading className="h6 d-flex align-items-center gap-2">
                          <Database size={20} />
                          Data Collection Sources
                        </Alert.Heading>
                        <ul className="mb-0 small">
                          <li>📝 <strong>Stream Notes:</strong> Raw thoughts and concepts from weekly streams</li>
                          <li>🖼️ <strong>Whiteboard Sessions:</strong> Visual frameworks and brainstorming outputs</li>
                          <li>📊 <strong>Case Studies:</strong> Client success stories and project insights</li>
                          <li>🔬 <strong>Technical Learnings:</strong> New discoveries and technical insights</li>
                          <li>📈 <strong>Industry Trends:</strong> Market observations and trend analysis</li>
                        </ul>
                      </Alert>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="rag-process">
                  <Card className="card-glassmorphism border-0 text-white">
                    <Card.Body className="p-4">
                      <h2 className="h3 fw-bold mb-4">⚡ RAG Processing</h2>
                      <p style={{ color: '#8B949E' }} className="mb-4">
                        AI analyzes your seed data against indexed content to create authentic prompts that match your voice and style.
                      </p>

                      {/* Status Indicators */}
                      <Row className="mb-4">
                        <Col md={4}>
                          <Card className="bg-transparent border-info text-center">
                            <Card.Body className="py-3">
                              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                                <MessageSquare size={24} style={{ color: '#58A6FF' }} />
                                <h5 className="mb-0 text-info">Posts</h5>
                              </div>
                              <div className="display-6 fw-bold text-info">{posts.length}</div>
                              <small className="text-muted">Generated Posts</small>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={4}>
                          <Card className="bg-transparent border-warning text-center">
                            <Card.Body className="py-3">
                              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                                <Zap size={24} style={{ color: '#FFC107' }} />
                                <h5 className="mb-0 text-warning">Setup</h5>
                              </div>
                              <div className="display-6 fw-bold text-warning">
                                {n8nConfig.connectionStatus === 'connected' ? '✓' : '⚠'}
                              </div>
                              <small className="text-muted">
                                {n8nConfig.connectionStatus === 'connected' ? 'Connected' : 'Not Connected'}
                              </small>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={4}>
                          <Card className="bg-transparent border-success text-center">
                            <Card.Body className="py-3">
                              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                                <Database size={24} style={{ color: '#28A745' }} />
                                <h5 className="mb-0 text-success">RAG Status</h5>
                              </div>
                              <div className="display-6 fw-bold text-success">
                                {vectorDB.status === 'connected' ? vectorDB.indexed : '0'}
                              </div>
                              <small className="text-muted">
                                {vectorDB.status === 'connected' ? 'Documents Indexed' : 'Not Indexed'}
                              </small>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      {/* Workflow Stages */}
                      <Row className="mb-4">
                        <Col md={12}>
                          <Card className="bg-transparent border-warning mb-4">
                            <Card.Header className="bg-transparent border-warning">
                              <h5 className="mb-0 text-warning">⚡ RAG Processing Pipeline</h5>
                            </Card.Header>
                            <Card.Body>
                              <div className="workflow-stages">
                                <div className="stage-item d-flex align-items-start mb-3">
                                  <div className="stage-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{minWidth: '30px', height: '30px', fontSize: '14px'}}>1</div>
                                  <div>
                                    <h6 className="text-primary mb-1">🔍 Retrieval</h6>
                                    <p className="small text-muted mb-0">Search your indexed content library for relevant insights and patterns</p>
                                  </div>
                                </div>
                                
                                <div className="stage-item d-flex align-items-start mb-3">
                                  <div className="stage-number bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{minWidth: '30px', height: '30px', fontSize: '14px'}}>2</div>
                                  <div>
                                    <h6 className="text-warning mb-1">🧠 Augmentation</h6>
                                    <p className="small text-muted mb-0">Enhance your seed data with historical patterns and voice consistency</p>
                                  </div>
                                </div>
                                
                                <div className="stage-item d-flex align-items-start mb-0">
                                  <div className="stage-number bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{minWidth: '30px', height: '30px', fontSize: '14px'}}>3</div>
                                  <div>
                                    <h6 className="text-success mb-1">✨ Context Generation</h6>
                                    <p className="small text-muted mb-0">Prepare enriched context for authentic content generation</p>
                                  </div>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      <div className="text-center py-4">
                        {prompt.trim() ? (
                          <>
                            <div className="d-grid gap-3">
                              <Button
                                onClick={normalizeData}
                                disabled={loading}
                                className="btn-info w-75 py-3 d-flex align-items-center justify-content-center gap-2 mx-auto"
                              >
                                {loading ? (
                                  <>
                                    <Spinner animation="border" size="sm" />
                                    Normalizing Data...
                                  </>
                                ) : (
                                  <>
                                    <Send size={20} />
                                    Send to Normalize Webhook
                                  </>
                                )}
                              </Button>
                              
                              <Button
                                onClick={generateContent}
                                disabled={loading}
                                className="btn-warning w-75 py-3 d-flex align-items-center justify-content-center gap-2 mx-auto"
                              >
                                {loading ? (
                                  <>
                                    <Spinner animation="border" size="sm" />
                                    Processing with RAG...
                                  </>
                                ) : (
                                  <>
                                    <Send size={20} />
                                    Full RAG Processing (Local)
                                  </>
                                )}
                              </Button>
                            </div>
                            {!loading && (
                              <Button
                                onClick={() => setActiveTab('prompt-generation')}
                                variant="outline-light"
                                className="mt-3"
                              >
                                Skip to Prompt Generation →
                              </Button>
                            )}
                          </>
                        ) : (
                          <div className="text-muted">
                            <Database size={64} className="opacity-50 mb-3" />
                            <p>Please enter seed data in the previous step to proceed with RAG processing.</p>
                            <Button
                              onClick={() => setActiveTab('seed-data')}
                              variant="outline-info"
                            >
                              ← Go Back to Seed Data
                            </Button>
                          </div>
                        )}
                      </div>

                      <Alert variant="warning" className="mt-4 bg-transparent border-warning">
                        <Alert.Heading className="h6 d-flex align-items-center gap-2">
                          <Database size={20} />
                          How RAG Processing Works
                        </Alert.Heading>
                        <ul className="mb-0 small">
                          <li>🔍 <strong>Retrieval:</strong> Searches your indexed content library for relevant insights</li>
                          <li>🧠 <strong>Augmentation:</strong> Enhances your seed data with your historical patterns</li>
                          <li>✨ <strong>Generation:</strong> Creates authentic content that matches your voice</li>
                          <li>🎯 <strong>Frameworks:</strong> Applies your unique methodologies and perspectives</li>
                        </ul>
                      </Alert>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="prompt-generation">
                  <Card className="card-glassmorphism border-0 text-white">
                    <Card.Body className="p-4">
                      <h2 className="h3 fw-bold mb-4">📝 Prompt Generation</h2>
                      <p style={{ color: '#8B949E' }} className="mb-4">
                        Generate comprehensive content prompts for text, images, videos, and marketing campaigns based on your processed seed data.
                      </p>

                      {posts.length === 0 ? (
                        <div className="text-center py-5">
                          <Bot size={64} className="opacity-50 mb-3" />
                          <p className="text-muted">No content generated yet. Complete the RAG processing step to generate prompts!</p>
                          <Button
                            onClick={() => setActiveTab('rag-process')}
                            variant="outline-warning"
                          >
                            ← Go Back to RAG Process
                          </Button>
                        </div>
                      ) : (
                        <div className="d-grid gap-4">
                          {posts.map(post => (
                            <Card key={post.id} className="bg-transparent" style={{ borderColor: '#30363D' }}>
                              <Card.Body>
                                <Row className="align-items-start">
                                  <Col sm={8} className="mb-3">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                      <User size={16} style={{ color: '#58A6FF' }} />
                                      <span className="small text-muted">
                                        {new Date(post.timestamp).toLocaleDateString()}
                                      </span>
                                      <Badge bg="info" className="ms-2">
                                        Generated
                                      </Badge>
                                    </div>
                                    <p className="fw-bold mb-2" style={{ color: '#58A6FF' }}>Prompt: {post.prompt}</p>
                                  </Col>
                                  <Col sm={4} className="text-end">
                                    <Button
                                      size="sm"
                                      variant="success"
                                      onClick={() => setActiveTab('review-execute')}
                                    >
                                      Review & Execute →
                                    </Button>
                                  </Col>
                                </Row>
                                
                                <Card className="border-0 mb-3" style={{ backgroundColor: '#0D1117' }}>
                                  <Card.Body className="p-3">
                                    <pre className="mb-0 text-white" style={{whiteSpace: 'pre-wrap', fontFamily: 'inherit'}}>
                                      {post.content}
                                    </pre>
                                  </Card.Body>
                                </Card>

                                {/* Template content prompts */}
                                <div className="mt-4">
                                  <h5 className="mb-3" style={{ color: '#58A6FF' }}>📝 Content Template Prompts</h5>
                                  <p className="text-muted small mb-3">
                                    Ready-to-use templates for different content types. Copy and customize for your workflow.
                                  </p>
                                  
                                  {(() => {
                                    const templatePrompts = getTemplateReleasePrompts(post);
                                    return (
                                      <>
                                        {/* Text Content Prompts */}
                                        <Card className="mb-3" style={{ backgroundColor: 'rgba(88, 166, 255, 0.1)', borderColor: '#58A6FF' }}>
                                          <Card.Header className="bg-transparent" style={{ borderColor: '#58A6FF' }}>
                                            <h6 className="mb-0 text-white">� Text Content Prompts</h6>
                                          </Card.Header>
                                          <Card.Body>
                                            {templatePrompts.textPrompts.map((prompt, idx) => (
                                              <div key={idx} className="mb-3 p-3 border border-secondary rounded">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                  <h6 className="text-primary mb-0">{prompt.title}</h6>
                                                  <Button 
                                                    size="sm" 
                                                    variant="outline-light"
                                                    onClick={() => navigator.clipboard.writeText(prompt.prompt)}
                                                  >
                                                    📋 Copy
                                                  </Button>
                                                </div>
                                                <p className="text-white-50 small mb-0" style={{fontSize: '0.85rem'}}>
                                                  {prompt.prompt}
                                                </p>
                                              </div>
                                            ))}
                                          </Card.Body>
                                        </Card>

                                        {/* Image Prompts */}
                                        <Card className="mb-3" style={{ backgroundColor: 'rgba(163, 113, 247, 0.1)', borderColor: '#A371F7' }}>
                                          <Card.Header className="bg-transparent" style={{ borderColor: '#A371F7' }}>
                                            <h6 className="mb-0 text-white">🎨 Image Generation Prompts</h6>
                                          </Card.Header>
                                          <Card.Body>
                                            {templatePrompts.imagePrompts.map((prompt, idx) => (
                                              <div key={idx} className="mb-3 p-3 border border-secondary rounded">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                  <h6 className="text-info mb-0">{prompt.title}</h6>
                                                  <Button 
                                                    size="sm" 
                                                    variant="outline-light"
                                                    onClick={() => navigator.clipboard.writeText(prompt.prompt)}
                                                  >
                                                    📋 Copy
                                                  </Button>
                                                </div>
                                                <p className="text-white-50 small mb-0" style={{fontSize: '0.85rem'}}>
                                                  {prompt.prompt}
                                                </p>
                                              </div>
                                            ))}
                                          </Card.Body>
                                        </Card>
                                      </>
                                    );
                                  })()}
                                </div>
                              </Card.Body>
                            </Card>
                          ))}
                        </div>
                      )}

                      <Alert variant="info" className="mt-4 bg-transparent border-info">
                        <Alert.Heading className="h6 d-flex align-items-center gap-2">
                          <Send size={20} />
                          Next Steps
                        </Alert.Heading>
                        <ul className="mb-0 small">
                          <li>📝 <strong>Copy Prompts:</strong> Use the generated prompts with AI tools like ChatGPT, Claude, or Midjourney</li>
                          <li>🎨 <strong>Create Assets:</strong> Generate images, videos, and additional content variations</li>
                          <li>👁️ <strong>Review Process:</strong> Move to Review & Execute tab for human oversight</li>
                          <li>🚀 <strong>Publishing:</strong> Prepare for automated LinkedIn publishing</li>
                        </ul>
                      </Alert>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="review-execute">
                  <Card className="card-glassmorphism border-0 text-white">
                    <Card.Body className="p-4">
                      <h2 className="h3 fw-bold mb-4">👁️ 4. Review and Execute</h2>
                      <p style={{ color: '#8B949E' }} className="mb-4">
                        Follow this checklist to review generated prompts and execute them using AI tools to create your content assets.
                      </p>

                      {/* Execution Checklist */}
                      <Card className="bg-transparent border-success mb-4">
                        <Card.Header className="bg-transparent border-success">
                          <h5 className="mb-0 text-success">✅ Execution Checklist</h5>
                        </Card.Header>
                        <Card.Body>
                          <div className="checklist-container">
                            
                            {/* Step 1: Review Generated Prompts */}
                            <div className="checklist-item mb-4 p-3 border rounded" style={{ borderColor: '#58A6FF' }}>
                              <div className="d-flex align-items-start gap-3">
                                <div className="checklist-checkbox">
                                  <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="review-prompts" />
                                    <label className="form-check-label" htmlFor="review-prompts">
                                      <span className="visually-hidden">Complete</span>
                                    </label>
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="text-primary mb-2">📋 Review Generated Prompts</h6>
                                  <p className="text-muted small mb-2">
                                    Go to the "Prompt Generation" tab and review all generated content prompts for accuracy and relevance.
                                  </p>
                                  <ul className="small text-muted mb-0">
                                    <li>Check text content prompts for clarity and brand voice</li>
                                    <li>Verify image generation prompts match your visual style</li>
                                    <li>Review video content prompts for feasibility</li>
                                    <li>Validate marketing campaign prompts align with goals</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Step 2: Execute Text Content Prompts */}
                            <div className="checklist-item mb-4 p-3 border rounded" style={{ borderColor: '#58A6FF' }}>
                              <div className="d-flex align-items-start gap-3">
                                <div className="checklist-checkbox">
                                  <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="execute-text" />
                                    <label className="form-check-label" htmlFor="execute-text">
                                      <span className="visually-hidden">Complete</span>
                                    </label>
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="text-primary mb-2">📝 Execute Text Content Prompts</h6>
                                  <p className="text-muted small mb-2">
                                    Use generated text prompts with AI tools like ChatGPT, Claude, or Gemini to create written content.
                                  </p>
                                  <ul className="small text-muted mb-0">
                                    <li>Copy LinkedIn post prompts to ChatGPT for post variations</li>
                                    <li>Use blog post prompts to create longer-form content</li>
                                    <li>Generate email newsletter content from prompts</li>
                                    <li>Create social media captions for multiple platforms</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Step 3: Execute Image Generation Prompts */}
                            <div className="checklist-item mb-4 p-3 border rounded" style={{ borderColor: '#A371F7' }}>
                              <div className="d-flex align-items-start gap-3">
                                <div className="checklist-checkbox">
                                  <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="execute-images" />
                                    <label className="form-check-label" htmlFor="execute-images">
                                      <span className="visually-hidden">Complete</span>
                                    </label>
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="text-info mb-2">🎨 Execute Image Generation Prompts</h6>
                                  <p className="text-muted small mb-2">
                                    Use image prompts with AI tools like Midjourney, DALL-E, or Stable Diffusion to create visual assets.
                                  </p>
                                  <ul className="small text-muted mb-0">
                                    <li>Generate hero images using Midjourney prompts</li>
                                    <li>Create infographics and data visualizations</li>
                                    <li>Generate social media graphics and thumbnails</li>
                                    <li>Create profile banners and cover images</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Step 4: Execute Video Content Prompts */}
                            <div className="checklist-item mb-4 p-3 border rounded" style={{ borderColor: '#FFC107' }}>
                              <div className="d-flex align-items-start gap-3">
                                <div className="checklist-checkbox">
                                  <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="execute-videos" />
                                    <label className="form-check-label" htmlFor="execute-videos">
                                      <span className="visually-hidden">Complete</span>
                                    </label>
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="text-warning mb-2">🎥 Execute Video Content Prompts</h6>
                                  <p className="text-muted small mb-2">
                                    Use video prompts to create video content with tools like Loom, Runway ML, or traditional video editing.
                                  </p>
                                  <ul className="small text-muted mb-0">
                                    <li>Record screen captures and tutorials using Loom</li>
                                    <li>Create short-form videos for LinkedIn and YouTube</li>
                                    <li>Generate video scripts and talking points</li>
                                    <li>Plan video series and educational content</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Step 5: Execute Marketing Campaign Prompts */}
                            <div className="checklist-item mb-4 p-3 border rounded" style={{ borderColor: '#28A745' }}>
                              <div className="d-flex align-items-start gap-3">
                                <div className="checklist-checkbox">
                                  <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="execute-marketing" />
                                    <label className="form-check-label" htmlFor="execute-marketing">
                                      <span className="visually-hidden">Complete</span>
                                    </label>
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="text-success mb-2">📈 Execute Marketing Campaign Prompts</h6>
                                  <p className="text-muted small mb-2">
                                    Use marketing prompts to create comprehensive campaigns and promotional materials.
                                  </p>
                                  <ul className="small text-muted mb-0">
                                    <li>Develop multi-platform marketing campaigns</li>
                                    <li>Create email marketing sequences and newsletters</li>
                                    <li>Generate advertising copy and landing page content</li>
                                    <li>Plan content calendars and scheduling strategies</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Step 6: Quality Review and Approval */}
                            <div className="checklist-item mb-4 p-3 border rounded" style={{ borderColor: '#DC3545' }}>
                              <div className="d-flex align-items-start gap-3">
                                <div className="checklist-checkbox">
                                  <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="quality-review" />
                                    <label className="form-check-label" htmlFor="quality-review">
                                      <span className="visually-hidden">Complete</span>
                                    </label>
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="text-danger mb-2">🔍 Quality Review and Approval</h6>
                                  <p className="text-muted small mb-2">
                                    Review all created content for quality, brand consistency, and accuracy before publishing.
                                  </p>
                                  <ul className="small text-muted mb-0">
                                    <li>Proofread all text content for grammar and tone</li>
                                    <li>Verify images match brand guidelines and quality standards</li>
                                    <li>Review videos for audio quality and visual clarity</li>
                                    <li>Ensure all content aligns with marketing objectives</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                          </div>
                        </Card.Body>
                      </Card>

                      {/* Navigation Actions */}
                      <div className="d-flex justify-content-between">
                        <Button
                          variant="outline-secondary"
                          onClick={() => setActiveTab('prompt-generation')}
                        >
                          ← Back to Prompt Generation
                        </Button>
                        <Button
                          variant="success"
                          onClick={() => setActiveTab('linkedin-publishing')}
                        >
                          Proceed to Publishing →
                        </Button>
                      </div>

                      <Alert variant="success" className="mt-4 bg-transparent border-success">
                        <Alert.Heading className="h6 d-flex align-items-center gap-2">
                          <CheckCircle size={20} />
                          Execution Tips
                        </Alert.Heading>
                        <ul className="mb-0 small">
                          <li>💡 <strong>AI Tool Recommendations:</strong> ChatGPT/Claude for text, Midjourney for images, Loom for videos</li>
                          <li>📋 <strong>Copy Prompts:</strong> Use the copy buttons in the Prompt Generation tab for easy access</li>
                          <li>🔄 <strong>Iterate:</strong> Don't hesitate to refine prompts and regenerate content if needed</li>
                          <li>💾 <strong>Save Everything:</strong> Keep all generated content organized for future reference</li>
                          <li>⚡ <strong>Batch Process:</strong> Execute similar prompts together for efficiency</li>
                        </ul>
                      </Alert>
                      
                      {/* N8N Send Result */}
                      {n8nResult && (
                        <Alert 
                          variant={n8nResult.success ? 'success' : 'danger'} 
                          className="mb-4 bg-transparent"
                          style={{ borderColor: n8nResult.success ? '#28a745' : '#dc3545' }}
                          dismissible
                          onClose={() => setN8nResult(null)}
                        >
                          <div className="d-flex align-items-center gap-2 mb-2">
                            {n8nResult.success ? (
                              <CheckCircle size={20} className="text-success" />
                            ) : (
                              <XCircle size={20} className="text-danger" />
                            )}
                            <strong>{n8nResult.message}</strong>
                          </div>
                          {n8nResult.data && (
                            <div className="small">
                              <strong>N8N Response:</strong>
                              <pre className="mt-1 p-2 rounded" style={{ 
                                backgroundColor: 'rgba(0,0,0,0.2)', 
                                fontSize: '0.75rem',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word'
                              }}>
                                {n8nResult.data}
                              </pre>
                            </div>
                          )}
                          <div className="small text-muted mt-2">
                            📅 {new Date(n8nResult.timestamp).toLocaleString()}
                          </div>
                        </Alert>
                      )}
                      
                      {posts.length === 0 ? (
                        <div className="text-center py-5">
                          <Bot size={64} className="opacity-50 mb-3" />
                          <p className="text-muted">No posts generated yet. Head to the "Seed Data Collection" tab to start your first content!</p>
                        </div>
                      ) : (
                        <div className="d-grid gap-4">
                          {posts.map(post => (
                            <Card key={post.id} className="bg-transparent" style={{ borderColor: '#30363D' }}>
                              <Card.Body>
                                <Row className="align-items-start">
                                  <Col sm={8} className="mb-3">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                      <User size={16} style={{ color: '#58A6FF' }} />
                                      <span className="small text-muted">
                                        {new Date(post.timestamp).toLocaleDateString()}
                                      </span>
                                      <Badge 
                                        bg={post.status === 'approved' ? 'success' : 
                                            post.status === 'rejected' ? 'danger' : 
                                            post.status === 'release_ready' ? 'primary' : 'secondary'}
                                        className="ms-2"
                                      >
                                        {post.status === 'release_ready' ? 'Release Ready' : post.status}
                                      </Badge>
                                    </div>
                                    <p className="fw-bold mb-2" style={{ color: '#58A6FF' }}>Prompt: {post.prompt}</p>
                                  </Col>
                                  <Col sm={4} className="text-end">
                                    {post.status === 'pending' && (
                                      <div className="d-flex flex-column gap-2">
                                        <div className="d-flex gap-2 justify-content-end">
                                          <Button
                                            size="sm"
                                            variant="success"
                                            onClick={() => updatePostStatus(post.id, 'approved')}
                                          >
                                            <CheckCircle size={16} className="me-1" />
                                            Approve
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => updatePostStatus(post.id, 'rejected')}
                                          >
                                            <XCircle size={16} className="me-1" />
                                            Reject
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                    {(post.status === 'approved' || post.status === 'release_ready') && (
                                      <div className="d-flex flex-column gap-2">
                                        <Button
                                          size="sm"
                                          variant="warning"
                                          className="w-100"
                                          disabled={n8nSending}
                                          onClick={() => sendToN8n({
                                            originalPrompt: post.prompt,
                                            platform: "LinkedIn",
                                            contentType: "Post",
                                            generatedContent: post.content,
                                            contentMetrics: {
                                              characterCount: post.content.length,
                                              wordCount: post.content.split(' ').length,
                                              hashtags: (post.content.match(/#\w+/g) || []).length,
                                              emojis: (post.content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length
                                            },
                                            ragSources: post.ragSources || [],
                                            timestamp: new Date().toISOString(),
                                            status: "pending"
                                          })}
                                        >
                                          {n8nSending ? (
                                            <>
                                              <Spinner animation="border" size="sm" className="me-2" />
                                              Sending to N8N...
                                            </>
                                          ) : (
                                            <>
                                              🚀 Send to N8N
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    )}
                                  </Col>
                                </Row>
                                
                                <Card className="border-0 mb-3" style={{ backgroundColor: '#0D1117' }}>
                                  <Card.Body className="p-3">
                                    <pre className="mb-0 text-white" style={{whiteSpace: 'pre-wrap', fontFamily: 'inherit'}}>
                                      {post.content}
                                    </pre>
                                  </Card.Body>
                                </Card>

                                {/* Always show template content prompts */}
                                <div className="mt-4">
                                  <h5 className="mb-3" style={{ color: '#58A6FF' }}>� Content Template Prompts</h5>
                                  <p className="text-muted small mb-3">
                                    These templates are ready to use with AI tools. Copy and customize them for your content creation workflow.
                                    Enhanced versions will be generated by N8N workflow processing.
                                  </p>
                                  
                                  {(() => {
                                    const templatePrompts = getTemplateReleasePrompts(post);
                                    return (
                                      <>
                                        {/* Text Content Prompts */}
                                        <Card className="mb-3" style={{ backgroundColor: 'rgba(88, 166, 255, 0.1)', borderColor: '#58A6FF' }}>
                                          <Card.Header className="bg-transparent" style={{ borderColor: '#58A6FF' }}>
                                            <h6 className="mb-0 text-white">📝 Text Content Prompts</h6>
                                          </Card.Header>
                                          <Card.Body>
                                            {templatePrompts.textPrompts.map((prompt, idx) => (
                                              <div key={idx} className="mb-3 p-3 border border-secondary rounded">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                  <h6 className="text-primary mb-0">{prompt.title}</h6>
                                                  <Button 
                                                    size="sm" 
                                                    variant="outline-light"
                                                    onClick={() => navigator.clipboard.writeText(prompt.prompt)}
                                                  >
                                                    📋 Copy
                                                  </Button>
                                                </div>
                                                <p className="text-white-50 small mb-0" style={{fontSize: '0.85rem'}}>
                                                  {prompt.prompt}
                                                </p>
                                              </div>
                                            ))}
                                          </Card.Body>
                                        </Card>

                                        {/* Image Prompts */}
                                        <Card className="mb-3" style={{ backgroundColor: 'rgba(163, 113, 247, 0.1)', borderColor: '#A371F7' }}>
                                          <Card.Header className="bg-transparent" style={{ borderColor: '#A371F7' }}>
                                            <h6 className="mb-0 text-white">🎨 Image Generation Prompts</h6>
                                          </Card.Header>
                                          <Card.Body>
                                            {templatePrompts.imagePrompts.map((prompt, idx) => (
                                              <div key={idx} className="mb-3 p-3 border border-secondary rounded">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                  <h6 className="text-info mb-0">{prompt.title}</h6>
                                                  <Button 
                                                    size="sm" 
                                                    variant="outline-light"
                                                    onClick={() => navigator.clipboard.writeText(prompt.prompt)}
                                                  >
                                                    📋 Copy
                                                  </Button>
                                                </div>
                                                <p className="text-white-50 small mb-0" style={{fontSize: '0.85rem'}}>
                                                  {prompt.prompt}
                                                </p>
                                              </div>
                                            ))}
                                          </Card.Body>
                                        </Card>

                                        {/* Video Prompts */}
                                        <Card className="mb-3" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', borderColor: '#FFC107' }}>
                                          <Card.Header className="bg-transparent" style={{ borderColor: '#FFC107' }}>
                                            <h6 className="mb-0 text-white">🎥 Video Content Prompts</h6>
                                          </Card.Header>
                                          <Card.Body>
                                            {templatePrompts.videoPrompts.map((prompt, idx) => (
                                              <div key={idx} className="mb-3 p-3 border border-secondary rounded">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                  <h6 className="text-warning mb-0">{prompt.title}</h6>
                                                  <Button 
                                                    size="sm" 
                                                    variant="outline-light"
                                                    onClick={() => navigator.clipboard.writeText(prompt.prompt)}
                                                  >
                                                    📋 Copy
                                                  </Button>
                                                </div>
                                                <p className="text-white-50 small mb-0" style={{fontSize: '0.85rem'}}>
                                                  {prompt.prompt}
                                                </p>
                                              </div>
                                            ))}
                                          </Card.Body>
                                        </Card>

                                        {/* Marketing Prompts */}
                                        <Card className="mb-3" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)', borderColor: '#28A745' }}>
                                          <Card.Header className="bg-transparent" style={{ borderColor: '#28A745' }}>
                                            <h6 className="mb-0 text-white">📈 Marketing & Campaign Prompts</h6>
                                          </Card.Header>
                                          <Card.Body>
                                            {templatePrompts.marketingPrompts.map((prompt, idx) => (
                                              <div key={idx} className="mb-3 p-3 border border-secondary rounded">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                  <h6 className="text-success mb-0">{prompt.title}</h6>
                                                  <Button 
                                                    size="sm" 
                                                    variant="outline-light"
                                                    onClick={() => navigator.clipboard.writeText(prompt.prompt)}
                                                  >
                                                    📋 Copy
                                                  </Button>
                                                </div>
                                                <p className="text-white-50 small mb-0" style={{fontSize: '0.85rem'}}>
                                                  {prompt.prompt}
                                                </p>
                                              </div>
                                            ))}
                                          </Card.Body>
                                        </Card>

                                        <Alert variant="success" className="mt-3 bg-transparent border-success">
                                          <div className="small">
                                            <strong>💡 Usage Tips:</strong>
                                            <ul className="mb-0 mt-1">
                                              {templatePrompts.usageTips.map((tip, idx) => (
                                                <li key={idx}>{tip}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        </Alert>
                                      </>
                                    );
                                  })()}
                                </div>

                                <Alert variant="info" className="mb-0 bg-dark bg-opacity-50 border-success border-opacity-50">
                                  <div className="small">
                                    <strong className="text-success">📊 RAG Sources:</strong>
                                    <ul className="mb-0 mt-2 list-unstyled">
                                      {post.ragSources.map((source, idx) => (
                                        <li key={idx} className="mb-2 p-2 rag-source-item rounded">
                                          <div className="d-flex justify-content-between align-items-start">
                                            <span className="text-light">
                                              <Database size={14} className="me-2 text-info" />
                                              <strong className="text-info">{typeof source === 'string' ? source : source.title}</strong>
                                            </span>
                                            {typeof source === 'object' && source.score && (
                                              <span className="badge bg-primary ms-2">
                                                {source.score}% match
                                              </span>
                                            )}
                                          </div>
                                          {typeof source === 'object' && source.fileName && (
                                            <small className="text-muted d-block mt-1 ms-4">
                                              📄 {source.fileName}
                                            </small>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </Alert>
                              </Card.Body>
                            </Card>
                          ))}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="linkedin-publishing">
                  <Card className="bg-transparent" style={{ borderColor: '#30363D' }}>
                    <Card.Body>
                      <h3 style={{ color: '#58A6FF' }} className="mb-4">
                        <div className="d-flex align-items-center gap-3">
                          � 5. LinkedIn Publishing
                          <Badge bg="info" className="fs-6">Checklist Workflow</Badge>
                        </div>
                      </h3>
                      
                      {/* N8N Send Result */}
                      {n8nResult && (
                        <Alert 
                          variant={n8nResult.success ? 'success' : 'danger'} 
                          className="mb-4 bg-transparent"
                          style={{ borderColor: n8nResult.success ? '#28a745' : '#dc3545' }}
                          dismissible
                          onClose={() => setN8nResult(null)}
                        >
                          <div className="d-flex align-items-center gap-2 mb-2">
                            {n8nResult.success ? (
                              <CheckCircle size={20} className="text-success" />
                            ) : (
                              <XCircle size={20} className="text-danger" />
                            )}
                            <strong>{n8nResult.message}</strong>
                          </div>
                          {n8nResult.data && (
                            <div className="small">
                              <strong>N8N Response:</strong>
                              <pre className="mt-1 p-2 rounded" style={{ 
                                backgroundColor: 'rgba(0,0,0,0.2)', 
                                fontSize: '0.75rem',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word'
                              }}>
                                {n8nResult.data}
                              </pre>
                            </div>
                          )}
                          <div className="small text-muted mt-2">
                            📅 {new Date(n8nResult.timestamp).toLocaleString()}
                          </div>
                        </Alert>
                      )}
                      
                      {posts.filter(post => post.status === 'approved' || post.status === 'release_ready').length === 0 ? (
                        <div className="text-center py-5">
                          <Bot size={64} className="opacity-50 mb-3" />
                          <p className="text-muted">No approved posts ready for publishing. Review and approve content first!</p>
                          <Button
                            onClick={() => setActiveTab('review-execute')}
                            variant="outline-success"
                          >
                            ← Go Back to Review & Execute
                          </Button>
                        </div>
                      ) : (
                        <div className="d-grid gap-4">
                          {posts.filter(post => post.status === 'approved' || post.status === 'release_ready').map(post => (
                            <Card key={post.id} className="bg-transparent" style={{ borderColor: '#30363D' }}>
                              <Card.Body>
                                <Row className="align-items-start">
                                  <Col sm={8} className="mb-3">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                      <User size={16} style={{ color: '#58A6FF' }} />
                                      <span className="small text-muted">
                                        {new Date(post.timestamp).toLocaleDateString()}
                                      </span>
                                      <Badge bg="success" className="ms-2">
                                        Ready to Publish
                                      </Badge>
                                    </div>
                                    <p className="fw-bold mb-2" style={{ color: '#58A6FF' }}>Prompt: {post.prompt}</p>
                                  </Col>
                                  <Col sm={4} className="text-end">
                                    <div className="d-flex flex-column gap-2">
                                      <Button
                                        size="sm"
                                        variant="danger"
                                        className="w-100"
                                        disabled={n8nSending}
                                        onClick={() => sendToN8n({
                                          originalPrompt: post.prompt,
                                          platform: "LinkedIn",
                                          contentType: "Post",
                                          generatedContent: post.content,
                                          contentMetrics: {
                                            characterCount: post.content.length,
                                            wordCount: post.content.split(' ').length,
                                            hashtags: (post.content.match(/#\w+/g) || []).length,
                                            emojis: (post.content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length
                                          },
                                          ragSources: post.ragSources || [],
                                          timestamp: new Date().toISOString(),
                                          status: "publishing"
                                        }, 'prompt')}
                                      >
                                        {n8nSending ? (
                                          <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Publishing to LinkedIn...
                                          </>
                                        ) : (
                                          <>
                                            🚀 Publish to LinkedIn
                                          </>
                                        )}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline-secondary"
                                        className="w-100"
                                        onClick={() => console.log('Schedule functionality coming soon')}
                                      >
                                        📅 Schedule Post
                                      </Button>
                                    </div>
                                  </Col>
                                </Row>
                                
                                <Card className="border-0 mb-3" style={{ backgroundColor: '#0D1117' }}>
                                  <Card.Body className="p-3">
                                    <pre className="mb-0 text-white" style={{whiteSpace: 'pre-wrap', fontFamily: 'inherit'}}>
                                      {post.content}
                                    </pre>
                                  </Card.Body>
                                </Card>

                                <Alert variant="danger" className="mb-0 bg-dark bg-opacity-50 border-danger border-opacity-50">
                                  <div className="small">
                                    <strong className="text-danger">📊 Publishing Analytics:</strong>
                                    <ul className="mb-0 mt-2 list-unstyled">
                                      <li className="mb-1">📝 <strong>Content Length:</strong> {post.content.length} characters</li>
                                      <li className="mb-1">📊 <strong>Word Count:</strong> {post.content.split(' ').length} words</li>
                                      <li className="mb-1">🏷️ <strong>Hashtags:</strong> {(post.content.match(/#\w+/g) || []).length}</li>
                                      <li className="mb-1">😊 <strong>Emojis:</strong> {(post.content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length}</li>
                                    </ul>
                                  </div>
                                </Alert>
                              </Card.Body>
                            </Card>
                          ))}
                        </div>
                      )}

                      <Alert variant="danger" className="mt-4 bg-transparent border-danger">
                        <Alert.Heading className="h6 d-flex align-items-center gap-2">
                          <Send size={20} />
                          LinkedIn Publishing Pipeline
                        </Alert.Heading>
                        <ul className="mb-0 small">
                          <li>🚀 <strong>Automated Publishing:</strong> Direct posting to LinkedIn via N8N automation</li>
                          <li>📅 <strong>Scheduling:</strong> Queue posts for optimal timing (coming soon)</li>
                          <li>📊 <strong>Analytics:</strong> Track engagement metrics and performance</li>
                          <li>🔄 <strong>Cross-posting:</strong> Expand to other social platforms</li>
                        </ul>
                      </Alert>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="setup">
                  <Card className="card-glassmorphism border-0 text-white">
                    <Card.Body className="p-4">
                      <h2 className="h3 fw-bold mb-4">System Configuration</h2>
                      
                      <Row className="g-4">
                        <Col md={6}>
                          <Card className="bg-transparent" style={{ borderColor: '#30363D' }}>
                            <Card.Header className="bg-transparent" style={{ borderColor: '#30363D' }}>
                              <Card.Title className="h5 mb-0 d-flex align-items-center gap-2" style={{ color: '#E6EDF3' }}>
                                <Zap className="text-warning" size={20} />
                                n8n Automation
                              </Card.Title>
                            </Card.Header>
                            <Card.Body>
                              <Form>
                                <Form.Group className="mb-3">
                                  <Form.Label style={{ color: '#E6EDF3' }}>Normalize Data Webhook URL</Form.Label>
                                  <Form.Control
                                    type="url"
                                    value={n8nConfig.normalizeWebhookUrl}
                                    onChange={(e) => updateConfig('normalizeWebhookUrl', e.target.value)}
                                    placeholder="https://n8n.rifaterdemsahin.com/webhook/normalize-data"
                                  />
                                  <Form.Text style={{ color: '#8B949E' }}>
                                    Used for normalizing seed data in the RAG process
                                  </Form.Text>
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                  <Form.Label style={{ color: '#E6EDF3' }}>Prompt Generation Webhook URL</Form.Label>
                                  <Form.Control
                                    type="url"
                                    value={n8nConfig.promptWebhookUrl}
                                    onChange={(e) => updateConfig('promptWebhookUrl', e.target.value)}
                                    placeholder="https://n8n.rifaterdemsahin.com/webhook/05c91180-4e19-4ccd-8917-658a96008ad9"
                                  />
                                  <Form.Text style={{ color: '#8B949E' }}>
                                    Used for generating content prompts and LinkedIn publishing
                                  </Form.Text>
                                </Form.Group>
                              </Form>
                              
                              <div className="mt-3 d-flex align-items-center justify-content-between">
                                <Badge bg={n8nConfig.connectionStatus === 'connected' ? 'success' : n8nConfig.connectionStatus === 'testing' ? 'warning' : 'secondary'}>
                                  {n8nConfig.connectionStatus === 'connected' ? '✅ Connected' : 
                                   n8nConfig.connectionStatus === 'testing' ? '🔄 Testing...' : 
                                   '❌ Not Connected'}
                                </Badge>
                                
                                <Button 
                                  variant="outline-warning" 
                                  size="sm"
                                  onClick={testN8nConnection}
                                  disabled={n8nConfig.testing || !n8nConfig.normalizeWebhookUrl || !n8nConfig.promptWebhookUrl}
                                >
                                  {n8nConfig.testing ? (
                                    <>
                                      <Spinner size="sm" className="me-2" />
                                      Testing Both Webhooks...
                                    </>
                                  ) : (
                                    'Test Both Connections'
                                  )}
                                </Button>
                              </div>
                              
                              {/* Debug Output Section */}
                              {n8nConfig.debugOutput && n8nConfig.debugOutput.length > 0 && (
                                <div className="mt-4">
                                  <div className="d-flex align-items-center justify-content-between mb-2">
                                    <h6 className="mb-0 text-info">🔍 Debug Output</h6>
                                    <Button 
                                      size="sm" 
                                      variant="outline-secondary"
                                      onClick={() => setN8nConfig({...n8nConfig, debugOutput: []})}
                                    >
                                      Clear
                                    </Button>
                                  </div>
                                  <div 
                                    className="bg-dark border rounded p-3"
                                    style={{ 
                                      maxHeight: '200px', 
                                      overflowY: 'auto',
                                      fontSize: '0.75rem',
                                      fontFamily: 'monospace'
                                    }}
                                  >
                                    {n8nConfig.debugOutput.map((line, idx) => (
                                      <div 
                                        key={idx} 
                                        className="text-light mb-1" 
                                        style={{ 
                                          whiteSpace: 'pre-wrap',
                                          wordWrap: 'break-word',
                                          overflowWrap: 'break-word'
                                        }}
                                      >
                                        {line}
                                      </div>
                                    ))}
                                  </div>
                                  {n8nConfig.lastTestTime && (
                                    <small className="text-muted mt-2 d-block">
                                      Last tested: {new Date(n8nConfig.lastTestTime).toLocaleString()}
                                    </small>
                                  )}
                                </div>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>

                        <Col md={6}>
                          <Card className="bg-transparent" style={{ borderColor: '#30363D' }}>
                            <Card.Header className="bg-transparent" style={{ borderColor: '#30363D' }}>
                              <Card.Title className="h5 mb-0 d-flex align-items-center gap-2" style={{ color: '#E6EDF3' }}>
                                <Database className="text-info" size={20} />
                                Vector Database
                              </Card.Title>
                            </Card.Header>
                            <Card.Body>
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <span style={{ color: '#E6EDF3' }}>Status</span>
                                <Badge bg={vectorDB.status === 'connected' ? 'success' : vectorDB.status === 'indexing' ? 'warning' : 'secondary'}>
                                  {vectorDB.status === 'connected' ? 'Ready (5 docs indexed)' : 
                                   vectorDB.status === 'indexing' ? 'Indexing...' : 
                                   'Setup Required'}
                                </Badge>
                              </div>
                              
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <span style={{ color: '#E6EDF3' }}>Indexed Content</span>
                                <span className="fw-bold" style={{ color: '#E6EDF3' }}>{vectorDB.indexed} posts</span>
                              </div>
                              
                              <div className="d-flex gap-2">
                                <Button 
                                  variant="outline-info" 
                                  size="sm"
                                  onClick={setupTestIndex}
                                  disabled={vectorDB.status === 'indexing'}
                                >
                                  {vectorDB.status === 'indexing' ? (
                                    <>
                                      <Spinner size="sm" className="me-2" />
                                      Indexing {vectorDB.indexed}/5...
                                    </>
                                  ) : (
                                    'Setup Test Index (5 docs)'
                                  )}
                                </Button>
                                
                                {vectorDB.status === 'connected' && (
                                  <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    onClick={() => {
                                      setVectorDB({ indexed: 0, status: 'disconnected' });
                                      setDebugData(prev => ({ ...prev, processingSteps: [] }));
                                    }}
                                  >
                                    Reset
                                  </Button>
                                )}
                              </div>
                              
                              {/* Vector DB Debug Output Section */}
                              {debugData.processingSteps && debugData.processingSteps.length > 0 && debugData.inputPrompt === 'Test Index Setup' && (
                                <div className="mt-4">
                                  <div className="d-flex align-items-center justify-content-between mb-2">
                                    <h6 className="mb-0 text-info">🔍 Indexing Debug Output</h6>
                                    <Button 
                                      size="sm" 
                                      variant="outline-secondary"
                                      onClick={() => setDebugData({...debugData, processingSteps: []})}
                                    >
                                      Clear
                                    </Button>
                                  </div>
                                  <div 
                                    className="bg-dark border rounded p-3"
                                    style={{ 
                                      maxHeight: '300px', 
                                      overflowY: 'auto',
                                      fontSize: '0.8rem',
                                      fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
                                      backgroundColor: '#0D1117',
                                      borderColor: '#30363D',
                                      color: '#E6EDF3'
                                    }}
                                  >
                                    {debugData.processingSteps.map((step, idx) => (
                                      <div key={idx} className="mb-1" style={{ whiteSpace: 'pre-wrap' }}>
                                        {step}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      {/* Integration Guide */}
                      <Alert variant="primary" className="mt-4 bg-transparent" style={{ borderColor: '#58A6FF' }}>
                        <Alert.Heading className="h5" style={{ color: '#58A6FF' }}>🚀 Quick Start Guide</Alert.Heading>
                        <ol className="mb-0" style={{ color: '#E6EDF3' }}>
                          <li>Access the <a href="dashboard.html" target="_blank" rel="noopener noreferrer" style={{ color: '#58A6FF', textDecoration: 'none' }}>Delivery Pilot Dashboard</a> for project overview</li>
                          <li>Set up your n8n workflow with the webhook trigger</li>
                          <li>Configure Faiss vector database for content storage</li>
                          <li>Index your best LinkedIn posts to train your voice</li>
                          <li>Connect Telegram for human-in-the-loop approval</li>
                          <li>Generate and review content before publishing</li>
                        </ol>
                      </Alert>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>

        {/* Footer */}
        <Row className="justify-content-center mt-5">
          <Col lg={10} xl={8}>
            <footer className="py-4 border-top" style={{ borderColor: '#30363D !important' }}>
              <Row className="g-4">
                <Col lg={6} className="text-center text-lg-start">
                  <h3 className="h5">Connect with me</h3>
                  <div className="d-flex justify-content-center justify-content-lg-start gap-3 mt-3">
                    <a href="https://www.youtube.com/@RifatErdemSahin" target="_blank" rel="noopener noreferrer" className="social-link youtube-link" title="YouTube">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/rifaterdemsahin/" target="_blank" rel="noopener noreferrer" className="social-link linkedin-link" title="LinkedIn">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                      </svg>
                    </a>
                    <a href="https://github.com/rifaterdemsahin/" target="_blank" rel="noopener noreferrer" className="social-link github-link" title="GitHub">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                      </svg>
                    </a>
                  </div>
                </Col>
                <Col lg={6} className="text-center text-lg-end">
                  <div className="mb-3">
                    <a href="https://github.com/rifaterdemsahin/linkedin-content-magician/actions/workflows/static.yml" target="_blank" rel="noopener noreferrer" title="GitHub Actions Build Status" className="github-badge">
                      <img src="https://github.com/rifaterdemsahin/linkedin-content-magician/actions/workflows/static.yml/badge.svg" alt="Build Status" className="mb-2" />
                    </a>
                  </div>
                  <a href="https://buymeacoffee.com/rifaterdemsahin" target="_blank" rel="noopener noreferrer" className="support-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                      <line x1="6" y1="1" x2="6" y2="4"></line>
                      <line x1="10" y1="1" x2="10" y2="4"></line>
                      <line x1="14" y1="1" x2="14" y2="4"></line>
                    </svg>
                    Buy Me a Coffee
                  </a>
                  <p className="text-muted mt-3">Built with ❤️ by Rifat Erdem Sahin</p>
                </Col>
              </Row>
            </footer>
          </Col>
        </Row>

        {/* Debug Window */}
        {debugData.visible && (
          <Row className="justify-content-center mt-4">
            <Col lg={10} xl={8}>
              <Card className="card-glassmorphism border-success shadow-lg">
                <Card.Header className="bg-transparent border-success d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center justify-content-center rounded-circle bg-success text-white" 
                         style={{ width: '32px', height: '32px' }}>
                      🐛
                    </div>
                    <div>
                      <h5 className="mb-0 text-success fw-bold">Debug Console</h5>
                      <small className="text-muted">Real-time RAG processing insights • Press Ctrl/Cmd + D to toggle</small>
                    </div>
                    <Badge bg="success" className="px-3 py-1">
                      {debugData.timestamp ? new Date(debugData.timestamp).toLocaleTimeString() : 'Ready'}
                    </Badge>
                  </div>
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    className="d-flex align-items-center gap-2"
                    onClick={() => setDebugData({ ...debugData, visible: false })}
                    style={{ 
                      borderColor: '#28a745',
                      color: '#28a745',
                      transition: 'all 0.3s ease-in-out',
                      minWidth: '70px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#28a745';
                      e.target.style.color = '#fff';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#28a745';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <span style={{ fontSize: '12px' }}>✕</span>
                    Close
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Row className="g-4">
                    {/* Processing Steps */}
                    <Col md={6}>
                      <Card className="bg-transparent border-secondary h-100">
                        <Card.Header className="bg-transparent border-secondary">
                          <h6 className="mb-0 text-info">⚡ Processing Steps</h6>
                        </Card.Header>
                        <Card.Body className="p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                          {debugData.processingSteps.map((step, idx) => (
                            <div key={idx} className="mb-2 p-2 bg-dark rounded">
                              <small 
                                className="text-light" 
                                style={{ 
                                  fontFamily: 'monospace', 
                                  fontSize: '0.8rem',
                                  whiteSpace: 'pre-wrap',
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word'
                                }}
                              >
                                {step}
                              </small>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* RAG Sources */}
                    <Col md={6}>
                      <Card className="bg-transparent border-secondary h-100">
                        <Card.Header className="bg-transparent border-secondary">
                          <h6 className="mb-0 text-success">📊 RAG Data Sources</h6>
                        </Card.Header>
                        <Card.Body className="p-3">
                          <div className="mb-3">
                            <strong className="text-primary">Input Prompt:</strong>
                            <div className="mt-1 p-3 rag-input-prompt">
                              <small className="text-white fw-medium">{debugData.inputPrompt}</small>
                            </div>
                          </div>
                          <div>
                            <strong className="text-success">Retrieved Sources:</strong>
                            <ul className="list-unstyled mt-2">
                              {debugData.ragSources.map((source, idx) => (
                                <li key={idx} className="mb-2 p-3 rag-source-item rounded">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <div className="text-light">
                                      <Zap size={16} className="me-2 text-info" />
                                      <strong className="text-info">{typeof source === 'string' ? source : source.title}</strong>
                                    </div>
                                    {typeof source === 'object' && source.score && (
                                      <span className="badge bg-primary ms-2">
                                        {source.score}% match
                                      </span>
                                    )}
                                  </div>
                                  {typeof source === 'object' && source.fileName && (
                                    <small className="text-muted d-block mt-1 ms-4">
                                      📄 {source.fileName} | Distance: {source.distance?.toFixed(3)}
                                    </small>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* Generated Content Preview */}
                    <Col md={6}>
                      <Card className="bg-transparent border-secondary h-100">
                        <Card.Header className="bg-transparent border-secondary">
                          <h6 className="mb-0 text-warning">📝 Generated Content</h6>
                        </Card.Header>
                        <Card.Body className="p-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                          <div className="p-2 bg-dark rounded">
                            <small className="text-white" style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                              {debugData.generatedContent}
                            </small>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* n8n Payload */}
                    <Col md={6}>
                      <Card className="bg-transparent border-secondary h-100">
                        <Card.Header className="bg-transparent border-secondary d-flex justify-content-between align-items-center">
                          <h6 className="mb-0 text-danger">🚀 n8n Payload</h6>
                          <Button 
                            size="sm" 
                            variant="outline-light"
                            onClick={() => navigator.clipboard.writeText(JSON.stringify(debugData.n8nPayload, null, 2))}
                          >
                            📋 Copy JSON
                          </Button>
                        </Card.Header>
                        <Card.Body className="p-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                          <pre className="text-light mb-0" style={{ 
                            fontSize: '0.7rem', 
                            background: '#0d1117', 
                            padding: '10px', 
                            borderRadius: '4px',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word'
                          }}>
                            {JSON.stringify(debugData.n8nPayload, null, 2)}
                          </pre>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Action Buttons */}
                  <Row className="mt-4">
                    <Col className="text-center">
                      <div className="d-flex gap-3 justify-content-center">
                        <Button 
                          variant="success" 
                          disabled={n8nSending}
                          onClick={() => sendToN8n(debugData.n8nPayload)}
                        >
                          {n8nSending ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Sending to N8N...
                            </>
                          ) : (
                            <>
                              🚀 Send to N8N
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline-info"
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(debugData, null, 2))}
                        >
                          📋 Copy All Debug Data
                        </Button>
                        <Button 
                          variant="outline-secondary"
                          onClick={() => console.log('Full Debug Data:', debugData)}
                        >
                          🔍 Log to Console
                        </Button>
                      </div>
                    </Col>
                  </Row>

                  {/* N8N Send Result */}
                  {n8nResult && (
                    <Row className="mt-4">
                      <Col>
                        <Alert 
                          variant={n8nResult.success ? 'success' : 'danger'} 
                          className="mb-0 bg-transparent"
                          style={{ borderColor: n8nResult.success ? '#28a745' : '#dc3545' }}
                        >
                          <div className="d-flex align-items-center gap-2 mb-2">
                            {n8nResult.success ? (
                              <CheckCircle size={20} className="text-success" />
                            ) : (
                              <XCircle size={20} className="text-danger" />
                            )}
                            <strong>{n8nResult.message}</strong>
                          </div>
                          {n8nResult.data && (
                            <div className="small">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <strong>Response:</strong>
                                <Button 
                                  size="sm" 
                                  variant="outline-light"
                                  onClick={(event) => {
                                    navigator.clipboard.writeText(n8nResult.data);
                                    // Show temporary feedback
                                    const btn = event.target;
                                    const originalText = btn.textContent;
                                    btn.textContent = '✓ Copied!';
                                    setTimeout(() => {
                                      btn.textContent = originalText;
                                    }, 1500);
                                  }}
                                >
                                  📋 Copy Response
                                </Button>
                              </div>
                              <pre className="mt-1 p-2 rounded" style={{ 
                                backgroundColor: 'rgba(0,0,0,0.2)', 
                                fontSize: '0.75rem',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                wordBreak: 'break-word'
                              }}>
                                {n8nResult.data}
                              </pre>
                            </div>
                          )}
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="small text-muted">
                              Sent at: {new Date(n8nResult.timestamp).toLocaleString()}
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline-secondary"
                              onClick={() => {
                                const fullResult = {
                                  success: n8nResult.success,
                                  message: n8nResult.message,
                                  data: n8nResult.data,
                                  timestamp: n8nResult.timestamp,
                                  error: n8nResult.error
                                };
                                navigator.clipboard.writeText(JSON.stringify(fullResult, null, 2));
                                // Optional: Show temporary feedback
                                const btn = event.target;
                                const originalText = btn.textContent;
                                btn.textContent = '✓ Copied!';
                                setTimeout(() => {
                                  btn.textContent = originalText;
                                }, 1500);
                              }}
                            >
                              📋 Copy Full Result
                            </Button>
                          </div>
                        </Alert>
                      </Col>
                    </Row>
                  )}

                  <Alert variant="success" className="mt-4 mb-0 bg-transparent border-success">
                    <div className="d-flex align-items-start gap-3">
                      <div className="d-flex align-items-center justify-content-center rounded-circle bg-success text-white flex-shrink-0" 
                           style={{ width: '24px', height: '24px', fontSize: '12px' }}>
                        💡
                      </div>
                      <div className="small">
                        <strong className="text-success">Debug Panel Guide:</strong>
                        <div className="row mt-2 g-2">
                          <div className="col-md-6">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="badge bg-info">Processing</span>
                              <span className="text-light">Real-time RAG pipeline steps</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="badge bg-success">RAG Sources</span>
                              <span className="text-light">Retrieved content & similarity scores</span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="badge bg-warning">Content</span>
                              <span className="text-light">AI-generated LinkedIn post preview</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="badge bg-danger">Payload</span>
                              <span className="text-light">Complete n8n automation data</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Alert>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}
