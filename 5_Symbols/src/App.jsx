import React, { useState, useEffect } from 'react';
import { Send, Bot, User, Database, Zap, MessageSquare, CheckCircle, XCircle, Loader } from 'lucide-react';

export default function LinkedInContentMagician() {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('generate');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [n8nConfig, setN8nConfig] = useState({
    webhookUrl: '',
    apiKey: ''
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
    
    // Simulate content generation with RAG
    setTimeout(async () => {
      const newPost = {
        id: Date.now(),
        content: generateRAGContent(prompt),
        prompt: prompt,
        status: 'pending',
        timestamp: new Date().toISOString(),
        voiceScore: Math.floor(Math.random() * 20) + 80
      };
      
      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      await saveToStorage('posts', updatedPosts);
      
      setPrompt('');
      setLoading(false);
      setActiveTab('review');
    }, 2000);
  };

  const generateRAGContent = (userPrompt) => {
    const templates = [
      `🚀 ${userPrompt}\n\nHere's what I've learned after years in this space:\n\nThe key isn't just using AI—it's using it strategically. Most people are still treating it like a fancy search engine.\n\nBut the real power comes from:\n→ Building custom systems\n→ Training on your unique voice\n→ Keeping humans in the loop\n\nThis changes everything.\n\nWhat's your biggest challenge with AI-assisted content? Drop a comment below. 👇`,
      
      `Let me share something that completely changed my perspective on ${userPrompt}...\n\nI used to spend 10+ hours a week on content creation. Now? Less than 2.\n\nThe difference? A RAG system that actually understands my voice.\n\nHere's the framework:\n\n1. Store your best content in a vector database\n2. Use semantic search to find relevant insights\n3. Generate content that maintains YOUR style\n4. Review and refine with one tap\n\nAuthenticity at scale isn't a myth. It's just a better system.\n\nWho else is building custom AI solutions? Let's connect. 🤝`,
      
      `Quick question about ${userPrompt}:\n\nWhy are we still choosing between learning new skills and building our brand?\n\nThat's a false choice.\n\nI built a system that handles content creation while I focus on what matters:\n→ Deep learning\n→ Skill building\n→ Real connections\n\nThe secret? RAG + automation + human oversight.\n\nYour voice stays authentic. Your time stays protected.\n\nInterested in the technical breakdown? Comment "GUIDE" and I'll share the architecture. 🔧`
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

  const updateConfig = async (field, value) => {
    const updated = { ...n8nConfig, [field]: value };
    setN8nConfig(updated);
    await saveToStorage('config', updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              LinkedIn Content Magician 🧙‍♂️
            </h1>
          </div>
          <p className="text-gray-300 text-lg">Your AI-Powered Content Assistant with RAG Technology</p>
        </header>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold">{vectorDB.indexed}</div>
                <div className="text-sm text-gray-300">Posts Indexed</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold">{posts.length}</div>
                <div className="text-sm text-gray-300">Generated Posts</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold">{posts.filter(p => p.status === 'approved').length}</div>
                <div className="text-sm text-gray-300">Approved</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold">{vectorDB.status === 'connected' ? 'Active' : 'Setup'}</div>
                <div className="text-sm text-gray-300">RAG Status</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-lg">
          {['generate', 'review', 'setup'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:bg-white/10'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6">
          {activeTab === 'generate' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Generate New Content</h2>
              <p className="text-gray-300 mb-6">
                Enter a topic or idea from your whiteboard from your weekly stream, and the RAG system will generate authentic content in your voice.
              </p>
              
              <div className="space-y-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your content topic... (e.g., 'AI automation in marketing' or 'Building custom RAG systems')"
                  className="w-full h-32 bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
                
                <button
                  onClick={generateContent}
                  disabled={loading || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Generating with RAG...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Generate Content
                    </>
                  )}
                </button>
              </div>

              <div className="mt-8 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  How RAG Works
                </h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>→ Searches your indexed content for relevant insights</li>
                  <li>→ Analyzes your writing style and voice patterns</li>
                  <li>→ Generates content that maintains your authenticity</li>
                  <li>→ Includes your unique frameworks and perspectives</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Review & Approve</h2>
              <p className="text-gray-300 mb-6">
                Review AI-generated content before publishing. Human-in-the-loop keeps you in control.
              </p>
              
              {posts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No posts generated yet. Head to the Generate tab to create your first post!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map(post => (
                    <div key={post.id} className="bg-white/5 border border-white/20 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-400" />
                          <span className="text-sm text-gray-300">
                            {new Date(post.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${post.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : post.status === 'approved' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                          {post.status}
                        </div>
                      </div>
                      
                      <div className="mb-3 p-3 bg-black/20 rounded-lg text-sm text-gray-400 italic">
                        Prompt: {post.prompt}
                      </div>
                      
                      <div className="mb-4 text-gray-200 whitespace-pre-wrap">{post.content}</div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          Voice Match: <span className="text-green-400 font-semibold">{post.voiceScore}%</span>
                        </div>
                        
                        {post.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updatePostStatus(post.id, 'rejected')}
                              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg flex items-center gap-2 transition-all"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                            <button
                              onClick={() => updatePostStatus(post.id, 'approved')}
                              className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg flex items-center gap-2 transition-all"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve & Publish
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'setup' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">System Setup</h2>
              
              {/* n8n Configuration */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  n8n Automation
                </h3>
                <input
                  type="text"
                  value={n8nConfig.webhookUrl}
                  onChange={(e) => updateConfig('webhookUrl', e.target.value)}
                  placeholder="n8n Webhook URL"
                  className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
                <input
                  type="password"
                  value={n8nConfig.apiKey}
                  onChange={(e) => updateConfig('apiKey', e.target.value)}
                  placeholder="API Key (optional)"
                  className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Vector Database */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Database className="w-6 h-6 text-green-400" />
                  Faiss Vector Database
                </h3>
                <div className="p-4 bg-white/5 border border-white/20 rounded-lg">
                  <p className="text-sm text-gray-300 mb-3">
                    Index your authentic content to train the RAG system on your unique voice.
                  </p>
                  <textarea
                    placeholder="Paste your LinkedIn posts here (one per paragraph)"
                    className="w-full h-32 bg-black/20 border border-white/10 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 mb-3"
                  />
                  <button
                    onClick={() => indexContent('sample')}
                    className="w-full bg-green-500 hover:bg-green-600 py-2 px-4 rounded-lg font-medium transition-all"
                  >
                    Index Content
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${vectorDB.status === 'connected' ? 'bg-green-400' : 'bg-gray-400'}`} />
                  <span className="text-gray-300">
                    Status: {vectorDB.status} | {vectorDB.indexed} posts indexed
                  </span>
                </div>
              </div>

              {/* Integration Guide */}
              <div className="p-4 bg-purple-500/20 border border-purple-400/30 rounded-lg">
                <h3 className="font-semibold mb-3">🚀 Quick Start Guide</h3>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                  <li>Set up your n8n workflow with the webhook trigger</li>
                  <li>Configure Faiss vector database for content storage</li>
                  <li>Index your best LinkedIn posts to train your voice</li>
                  <li>Connect Telegram for human-in-the-loop approval</li>
                  <li>Generate and review content before publishing</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-white/20 text-gray-300">
          <div className="row gy-4">
            <div className="col-lg-6 text-center text-lg-start">
              <h3>Connect with me</h3>
              <div className="social-links d-flex justify-content-center justify-content-lg-start gap-4 mt-3">
                <a href="https://www.youtube.com/@RifatErdemSahin" target="_blank" className="social-link youtube-link" title="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/rifaterdemsahin/" target="_blank" className="social-link linkedin-link" title="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                  </svg>
                </a>
                <a href="https://github.com/rifaterdemsahin/" target="_blank" className="social-link github-link" title="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div className="col-lg-6 text-center text-lg-end">
              <a href="https://buymeacoffee.com/rifaterdemsahin" target="_blank" className="support-btn coffee-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
                Buy Me a Coffee
              </a>
              <p className="footer-text mt-3">Built with ❤️ by Rifat Erdem Sahin</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
