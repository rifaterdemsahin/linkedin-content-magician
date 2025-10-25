import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Tab, Card, Button, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { Send, Bot, User, Database, Zap, MessageSquare, CheckCircle, XCircle, Loader } from 'lucide-react';

export default function LinkedInContentMagician() {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('generate');
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
    webhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n.rifaterdemsahin.com/webhook/05c91180-4e19-4ccd-8917-658a96008ad9',
    connectionStatus: 'disconnected',
    testing: false,
    debugOutput: []
  });
  const [vectorDB, setVectorDB] = useState({
    indexed: 0,
    status: 'disconnected'
  });

  useEffect(() => {
    loadFromStorage();
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
    
    // Simulate RAG data retrieval
    const ragSources = [
      'Previous LinkedIn post about automation',
      'Video transcript from tech talk',
      'Article draft on AI implementation',
      'Whiteboard notes from strategy session',
      'Client feedback on similar topics'
    ];
    
    debugSteps.push(`🔍 [${new Date().toLocaleTimeString()}] RAG retrieval completed`);
    debugSteps.push(`📊 Found ${ragSources.length} relevant sources`);
    
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
      debugSteps.push(`🚀 Ready to send to n8n webhook: ${n8nConfig.webhookUrl}`);
      
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
      setActiveTab('review');
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

  const testN8nConnection = async () => {
    const debugLog = [];
    const timestamp = new Date().toISOString();
    
    debugLog.push(`🔍 [${new Date().toLocaleTimeString()}] Starting connection test...`);
    debugLog.push(`📡 Target URL: ${n8nConfig.webhookUrl}`);
    
    setN8nConfig({ 
      ...n8nConfig, 
      testing: true, 
      debugOutput: debugLog,
      connectionStatus: 'testing'
    });
    
    try {
      debugLog.push(`🚀 [${new Date().toLocaleTimeString()}] Sending POST request...`);
      
      const requestPayload = {
        test: true,
        message: 'Connection test from LinkedIn Content Magician',
        timestamp: timestamp,
        source: 'LinkedIn Content Magician UI',
        debugMode: true
      };
      
      debugLog.push(`📦 Request payload: ${JSON.stringify(requestPayload, null, 2)}`);
      
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'LinkedIn-Content-Magician/1.0.0',
          'X-Debug-Request': 'true'
        },
        body: JSON.stringify(requestPayload)
      };
      
      debugLog.push(`🔧 Request headers: ${JSON.stringify(requestOptions.headers, null, 2)}`);
      
      const startTime = performance.now();
      const response = await fetch(n8nConfig.webhookUrl, requestOptions);
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      debugLog.push(`⏱️ Response time: ${responseTime}ms`);
      debugLog.push(`📊 Status Code: ${response.status} ${response.statusText}`);
      debugLog.push(`🌐 Response headers: ${JSON.stringify(Object.fromEntries(response.headers), null, 2)}`);
      
      let responseText = '';
      try {
        responseText = await response.text();
        debugLog.push(`📄 Response body: ${responseText || '(empty)'}`);
      } catch (textError) {
        debugLog.push(`❌ Failed to read response body: ${textError.message}`);
      }

      if (response.ok) {
        debugLog.push(`✅ [${new Date().toLocaleTimeString()}] Connection successful!`);
        const updated = { 
          ...n8nConfig, 
          connectionStatus: 'connected', 
          testing: false,
          debugOutput: debugLog,
          lastTestTime: timestamp,
          lastResponseTime: responseTime
        };
        setN8nConfig(updated);
        await saveToStorage('config', updated);
      } else {
        debugLog.push(`❌ [${new Date().toLocaleTimeString()}] HTTP Error: ${response.status}`);
        if (response.status === 404) {
          debugLog.push(`🔍 404 Error: Webhook endpoint not found. Please check the URL.`);
        } else if (response.status === 500) {
          debugLog.push(`🔍 500 Error: Server error. Check n8n workflow configuration.`);
        } else if (response.status === 403) {
          debugLog.push(`🔍 403 Error: Forbidden. Check webhook permissions.`);
        }
        
        setN8nConfig({ 
          ...n8nConfig, 
          connectionStatus: 'failed', 
          testing: false,
          debugOutput: debugLog,
          lastError: `HTTP ${response.status}: ${response.statusText}`,
          lastTestTime: timestamp
        });
      }
    } catch (error) {
      debugLog.push(`💥 [${new Date().toLocaleTimeString()}] Network Error: ${error.message}`);
      debugLog.push(`🔍 Error type: ${error.name}`);
      debugLog.push(`📍 Error stack: ${error.stack}`);
      
      // More specific error analysis
      if (error.message.includes('Failed to fetch')) {
        debugLog.push(`🌐 Network issue: Unable to reach the server. Check internet connection and URL.`);
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

  const generateReleasePrompts = async (post) => {
    const releasePrompts = {
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
      ]
    };

    const updatedPost = {
      ...post,
      releasePrompts,
      status: 'release_ready'
    };

    const updatedPosts = posts.map(p => 
      p.id === post.id ? updatedPost : p
    );
    setPosts(updatedPosts);
    await saveToStorage('posts', updatedPosts);
  };

  return (
    <div className="min-h-100vh bg-dark-custom text-white">
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
              
              {/* Debug Toggle Button */}
              <Button 
                variant="outline-warning" 
                size="sm"
                className="position-absolute top-0 end-0"
                onClick={() => setDebugData({ ...debugData, visible: !debugData.visible })}
                style={{ opacity: 0.7 }}
              >
                🐛 Debug {debugData.visible ? 'ON' : 'OFF'}
              </Button>
            </div>
          </Col>
        </Row>

        {/* Stats Bar */}
        <Row className="justify-content-center mb-4">
          <Col lg={10} xl={8}>
            <Row className="g-3">
              <Col sm={6} lg={3}>
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
              
              <Col sm={6} lg={3}>
                <Card className="card-glassmorphism border-0 text-white h-100">
                  <Card.Body className="d-flex align-items-center">
                    <Zap className="text-warning me-3" size={32} />
                    <div>
                      <div className="fs-2 fw-bold">{posts.length}</div>
                      <div className="small" style={{ color: '#8B949E' }}>Generated Posts</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col sm={6} lg={3}>
                <Card className="card-glassmorphism border-0 text-white h-100">
                  <Card.Body className="d-flex align-items-center">
                    <CheckCircle className="text-info me-3" size={32} />
                    <div>
                      <div className="fs-2 fw-bold">{posts.filter(p => p.status === 'approved').length}</div>
                      <div className="small" style={{ color: '#8B949E' }}>Approved</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col sm={6} lg={3}>
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
                        eventKey="generate" 
                        className="text-center fw-medium border-0 text-white"
                        style={{backgroundColor: activeTab === 'generate' ? '#58A6FF' : 'transparent'}}
                      >
                        📊 Generate Prompts
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="flex-fill">
                      <Nav.Link 
                        eventKey="review" 
                        className="text-center fw-medium border-0 text-white"
                        style={{backgroundColor: activeTab === 'review' ? '#58A6FF' : 'transparent'}}
                      >
                        🚀 Review & Release
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="flex-fill">
                      <Nav.Link 
                        eventKey="setup" 
                        className="text-center fw-medium border-0 text-white"
                        style={{backgroundColor: activeTab === 'setup' ? '#58A6FF' : 'transparent'}}
                      >
                        Setup
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
              </Card>

              {/* Tab Content */}
              <Tab.Content>
                <Tab.Pane eventKey="generate">
                  <Card className="card-glassmorphism border-0 text-white">
                    <Card.Body className="p-4">
                      <h2 className="h3 fw-bold mb-4">Generate Content Prompts</h2>
                      <p style={{ color: '#8B949E' }} className="mb-4">
                        Transform your seed ideas into comprehensive content strategies. Follow our 5-stage process from idea to LinkedIn post.
                      </p>

                      {/* Workflow Stages */}
                      <Row className="mb-4">
                        <Col md={12}>
                          <Card className="bg-transparent border-info mb-4">
                            <Card.Header className="bg-transparent border-info">
                              <h5 className="mb-0 text-info">🚀 Content Creation Workflow</h5>
                            </Card.Header>
                            <Card.Body>
                              <div className="workflow-stages">
                                <div className="stage-item d-flex align-items-start mb-3">
                                  <div className="stage-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{minWidth: '30px', height: '30px', fontSize: '14px'}}>1</div>
                                  <div>
                                    <h6 className="text-primary mb-1">📊 Seed Data Collection</h6>
                                    <p className="small text-muted mb-0">Gather ideas from your weekly streams, whiteboards, and brainstorming sessions</p>
                                  </div>
                                </div>
                                
                                <div className="stage-item d-flex align-items-start mb-3">
                                  <div className="stage-number bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{minWidth: '30px', height: '30px', fontSize: '14px'}}>2</div>
                                  <div>
                                    <h6 className="text-warning mb-1">⚡ RAG Processing</h6>
                                    <p className="small text-muted mb-0">AI analyzes your seed data against indexed content to create authentic prompts</p>
                                  </div>
                                </div>
                                
                                <div className="stage-item d-flex align-items-start mb-3">
                                  <div className="stage-number bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{minWidth: '30px', height: '30px', fontSize: '14px'}}>3</div>
                                  <div>
                                    <h6 className="text-info mb-1">📝 Prompt Generation</h6>
                                    <p className="small text-muted mb-0">System creates multiple content prompts for text, images, videos, and campaigns</p>
                                  </div>
                                </div>
                                
                                <div className="stage-item d-flex align-items-start mb-3">
                                  <div className="stage-number bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{minWidth: '30px', height: '30px', fontSize: '14px'}}>4</div>
                                  <div>
                                    <h6 className="text-success mb-1">👁️ Review & Execute</h6>
                                    <p className="small text-muted mb-0">Human-in-the-loop review, customization, and execution of generated prompts</p>
                                  </div>
                                </div>
                                
                                <div className="stage-item d-flex align-items-start mb-0">
                                  <div className="stage-number bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{minWidth: '30px', height: '30px', fontSize: '14px'}}>5</div>
                                  <div>
                                    <h6 className="text-danger mb-1">🚀 LinkedIn Publishing</h6>
                                    <p className="small text-muted mb-0">Automated posting to LinkedIn with analytics tracking</p>
                                  </div>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                      
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
                          <Form.Text className="text-muted">
                            💡 Tip: The more context you provide, the better the AI can create authentic content in your voice
                          </Form.Text>
                        </Form.Group>
                        
                        <Button
                          onClick={generateContent}
                          disabled={loading || !prompt.trim()}
                          className="btn-primary-custom w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                        >
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" />
                              Processing with RAG...
                            </>
                          ) : (
                            <>
                              <Send size={20} />
                              Generate Content Prompts
                            </>
                          )}
                        </Button>
                      </Form>

                      <Alert variant="primary" className="mt-4 bg-transparent border-primary">
                        <Alert.Heading className="h6 d-flex align-items-center gap-2">
                          <Database size={20} />
                          How Our RAG System Works
                        </Alert.Heading>
                        <ul className="mb-0 small">
                          <li>🔍 <strong>Retrieval:</strong> Searches your indexed content library for relevant insights</li>
                          <li>🧠 <strong>Augmentation:</strong> Enhances your seed data with your historical patterns</li>
                          <li>✨ <strong>Generation:</strong> Creates authentic content that matches your voice</li>
                          <li>🎯 <strong>Frameworks:</strong> Applies your unique methodologies and perspectives</li>
                        </ul>
                      </Alert>

                      <Alert variant="success" className="mt-3 bg-transparent border-success">
                        <Alert.Heading className="h6 d-flex align-items-center gap-2">
                          <CheckCircle size={20} />
                          What Happens Next?
                        </Alert.Heading>
                        <ol className="mb-0 small">
                          <li>Initial LinkedIn post is generated from your seed data</li>
                          <li>Go to "Review & Prepare Release" tab to review the content</li>
                          <li>Click "Generate Release Prompts" for comprehensive content suite</li>
                          <li>Use prompts with AI tools (ChatGPT, Midjourney, etc.) to create assets</li>
                          <li>Deploy across multiple platforms with automated publishing</li>
                        </ol>
                      </Alert>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="review">
                  <Card className="card-glassmorphism border-0 text-white">
                    <Card.Body className="p-4">
                      <h2 className="h3 fw-bold mb-4">Review & Prepare Release</h2>
                      <p style={{ color: '#8B949E' }} className="mb-4">
                        Generate comprehensive content and assets for your final release. Get prompts for text, images, videos, and marketing materials.
                      </p>
                      
                      {posts.length === 0 ? (
                        <div className="text-center py-5">
                          <Bot size={64} className="opacity-50 mb-3" />
                          <p className="text-muted">No posts generated yet. Head to the "Generate Prompts" tab to create your first content!</p>
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
                                        <Button
                                          size="sm"
                                          variant="outline-primary"
                                          className="w-100"
                                          onClick={() => generateReleasePrompts(post)}
                                        >
                                          📝 Generate Release Prompts
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

                                {post.releasePrompts && (
                                  <div className="mt-4">
                                    <h5 className="mb-3" style={{ color: '#58A6FF' }}>🚀 Release Prompts Generated</h5>
                                    
                                    {/* Text Content Prompts */}
                                    <Card className="mb-3" style={{ backgroundColor: 'rgba(88, 166, 255, 0.1)', borderColor: '#58A6FF' }}>
                                      <Card.Header className="bg-transparent" style={{ borderColor: '#58A6FF' }}>
                                        <h6 className="mb-0 text-white">📝 Text Content Prompts</h6>
                                      </Card.Header>
                                      <Card.Body>
                                        {post.releasePrompts.textPrompts.map((prompt, idx) => (
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
                                        {post.releasePrompts.imagePrompts.map((prompt, idx) => (
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
                                        {post.releasePrompts.videoPrompts.map((prompt, idx) => (
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
                                        {post.releasePrompts.marketingPrompts.map((prompt, idx) => (
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
                                          <li>Copy these prompts to your AI tools (ChatGPT, Claude, Midjourney, etc.)</li>
                                          <li>Customize the prompts with your specific brand voice and requirements</li>
                                          <li>Use the generated content across multiple platforms for maximum reach</li>
                                          <li>Track performance and iterate based on engagement metrics</li>
                                        </ul>
                                      </div>
                                    </Alert>
                                  </div>
                                )}

                                <Alert variant="info" className="mb-0 bg-dark bg-opacity-50 border-success border-opacity-50">
                                  <div className="small">
                                    <strong className="text-success">📊 RAG Sources:</strong>
                                    <ul className="mb-0 mt-2 list-unstyled">
                                      {post.ragSources.map((source, idx) => (
                                        <li key={idx} className="mb-2 p-2 rag-source-item rounded">
                                          <span className="text-light">
                                            <Database size={14} className="me-2 text-info" />
                                            <strong className="text-info">{source}</strong>
                                          </span>
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
                                  <Form.Label style={{ color: '#E6EDF3' }}>Webhook URL</Form.Label>
                                  <Form.Control
                                    type="url"
                                    value={n8nConfig.webhookUrl}
                                    onChange={(e) => updateConfig('webhookUrl', e.target.value)}
                                    placeholder="https://your-n8n.com/webhook/..."
                                  />
                                  <Form.Text style={{ color: '#8B949E' }}>
                                    Connect to your n8n workflow for automated publishing
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
                                  disabled={n8nConfig.testing || !n8nConfig.webhookUrl}
                                >
                                  {n8nConfig.testing ? (
                                    <>
                                      <Spinner size="sm" className="me-2" />
                                      Testing...
                                    </>
                                  ) : (
                                    'Test Connection'
                                  )}
                                </Button>
                              </div>
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
                                <Badge bg={vectorDB.status === 'connected' ? 'success' : 'warning'}>
                                  {vectorDB.status === 'connected' ? 'Connected' : 'Disconnected'}
                                </Badge>
                              </div>
                              
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <span style={{ color: '#E6EDF3' }}>Indexed Content</span>
                                <span className="fw-bold" style={{ color: '#E6EDF3' }}>{vectorDB.indexed} posts</span>
                              </div>
                              
                              <Button 
                                variant="outline-info" 
                                size="sm"
                                onClick={() => indexContent('Manual index test')}
                                disabled={vectorDB.status === 'indexing'}
                              >
                                {vectorDB.status === 'indexing' ? (
                                  <>
                                    <Spinner size="sm" className="me-2" />
                                    Indexing...
                                  </>
                                ) : (
                                  'Test Connection'
                                )}
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      {/* Integration Guide */}
                      <Alert variant="primary" className="mt-4 bg-transparent" style={{ borderColor: '#58A6FF' }}>
                        <Alert.Heading className="h5" style={{ color: '#58A6FF' }}>🚀 Quick Start Guide</Alert.Heading>
                        <ol className="mb-0" style={{ color: '#E6EDF3' }}>
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
              <Card className="card-glassmorphism border-warning">
                <Card.Header className="bg-transparent border-warning d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <Zap className="text-warning" size={20} />
                    <h5 className="mb-0 text-warning">🐛 Debug Window</h5>
                    <Badge bg="warning" text="dark">
                      {debugData.timestamp ? new Date(debugData.timestamp).toLocaleTimeString() : ''}
                    </Badge>
                  </div>
                  <Button 
                    variant="outline-warning" 
                    size="sm"
                    onClick={() => setDebugData({ ...debugData, visible: false })}
                  >
                    ✕ Close
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
                              <small className="text-light" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
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
                                  <div className="text-light">
                                    <Zap size={16} className="me-2 text-info" />
                                    <strong className="text-info">{source}</strong>
                                  </div>
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
                          <pre className="text-light mb-0" style={{ fontSize: '0.7rem', background: '#0d1117', padding: '10px', borderRadius: '4px' }}>
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
                          onClick={() => {
                            console.log('Sending to n8n:', debugData.n8nPayload);
                            // Here you would normally send to n8n
                            alert('Debug: Would send payload to n8n webhook');
                          }}
                        >
                          🚀 Send to n8n
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

                  <Alert variant="info" className="mt-4 mb-0 bg-transparent border-info">
                    <div className="small">
                      <strong>🛠️ Debug Information:</strong>
                      <ul className="mb-0 mt-1">
                        <li><strong>Processing:</strong> Shows each step of the RAG pipeline</li>
                        <li><strong>RAG Sources:</strong> Displays retrieved content sources and input</li>
                        <li><strong>Generated Content:</strong> Preview of the AI-generated LinkedIn post</li>
                        <li><strong>n8n Payload:</strong> Complete data structure sent to automation workflow</li>
                      </ul>
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