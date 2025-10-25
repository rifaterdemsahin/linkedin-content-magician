                <Tab.Pane eventKey="linkedin-publishing">
                  <Card className="bg-transparent" style={{ borderColor: '#30363D' }}>
                    <Card.Body>
                      <h3 style={{ color: '#58A6FF' }} className="mb-4">
                        <div className="d-flex align-items-center gap-3">
                          📱 5. LinkedIn Publishing
                          <Badge bg="info" className="fs-6">Checklist Workflow</Badge>
                        </div>
                      </h3>
                      
                      <Alert variant="info" className="mb-4 bg-transparent" style={{ borderColor: '#58A6FF' }}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className="fs-5">📋</span>
                          <strong>Publishing Checklist</strong>
                        </div>
                        <p className="mb-0 small">
                          Follow these steps to publish your content across LinkedIn, YouTube, and Email platforms. 
                          Check off each item as you complete it.
                        </p>
                      </Alert>

                      {/* LinkedIn Publishing Checklist */}
                      <div className="checklist-container">
                        
                        {/* Step 1: LinkedIn Platform */}
                        <Card className="mb-4 border-primary bg-transparent">
                          <Card.Header className="bg-transparent border-primary">
                            <h5 className="mb-0 text-primary">
                              <span className="me-2">💼</span>
                              LinkedIn Publishing
                            </h5>
                          </Card.Header>
                          <Card.Body>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="linkedin-login" />
                              <label className="form-check-label" htmlFor="linkedin-login">
                                <strong>Login to LinkedIn:</strong> Access your LinkedIn account and navigate to the home feed
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="linkedin-copy-content" />
                              <label className="form-check-label" htmlFor="linkedin-copy-content">
                                <strong>Copy Generated Content:</strong> From the Review & Execute tab, copy your approved LinkedIn post content
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="linkedin-create-post" />
                              <label className="form-check-label" htmlFor="linkedin-create-post">
                                <strong>Create New Post:</strong> Click "Start a post" and paste your content
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="linkedin-add-images" />
                              <label className="form-check-label" htmlFor="linkedin-add-images">
                                <strong>Add Visuals:</strong> Upload relevant images, infographics, or carousel slides if available
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="linkedin-hashtags" />
                              <label className="form-check-label" htmlFor="linkedin-hashtags">
                                <strong>Optimize Hashtags:</strong> Ensure 3-5 relevant hashtags are included (LinkedIn best practice)
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="linkedin-schedule" />
                              <label className="form-check-label" htmlFor="linkedin-schedule">
                                <strong>Schedule or Publish:</strong> Either publish immediately or schedule for optimal posting time
                              </label>
                            </div>
                            <Alert variant="success" className="mt-3 bg-transparent border-success">
                              <small>
                                <strong>💡 LinkedIn Tips:</strong> Best posting times are Tuesday-Thursday, 9-10 AM. 
                                Engage with comments within the first hour for better reach.
                              </small>
                            </Alert>
                          </Card.Body>
                        </Card>

                        {/* Step 2: YouTube Platform */}
                        <Card className="mb-4 border-danger bg-transparent">
                          <Card.Header className="bg-transparent border-danger">
                            <h5 className="mb-0 text-danger">
                              <span className="me-2">📺</span>
                              YouTube Publishing
                            </h5>
                          </Card.Header>
                          <Card.Body>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="youtube-studio" />
                              <label className="form-check-label" htmlFor="youtube-studio">
                                <strong>Access YouTube Studio:</strong> Login to YouTube and go to YouTube Studio dashboard
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="youtube-video-content" />
                              <label className="form-check-label" htmlFor="youtube-video-content">
                                <strong>Create Video Content:</strong> Use video prompts from Review & Execute tab to create video script/content
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="youtube-thumbnail" />
                              <label className="form-check-label" htmlFor="youtube-thumbnail">
                                <strong>Design Thumbnail:</strong> Create an eye-catching thumbnail using image prompts from generated content
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="youtube-upload" />
                              <label className="form-check-label" htmlFor="youtube-upload">
                                <strong>Upload Video:</strong> Upload your video file and add the generated title and description
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="youtube-tags" />
                              <label className="form-check-label" htmlFor="youtube-tags">
                                <strong>Add Tags:</strong> Include relevant tags and categories for better discoverability
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="youtube-publish" />
                              <label className="form-check-label" htmlFor="youtube-publish">
                                <strong>Publish Video:</strong> Set visibility (public/unlisted) and publish or schedule the video
                              </label>
                            </div>
                            <Alert variant="danger" className="mt-3 bg-transparent border-danger">
                              <small>
                                <strong>🎬 YouTube Tips:</strong> Upload 1080p+ video quality, add captions for accessibility, 
                                and include end screens to promote other videos.
                              </small>
                            </Alert>
                          </Card.Body>
                        </Card>

                        {/* Step 3: Email Marketing */}
                        <Card className="mb-4 border-warning bg-transparent">
                          <Card.Header className="bg-transparent border-warning">
                            <h5 className="mb-0 text-warning">
                              <span className="me-2">📧</span>
                              Email Newsletter Publishing
                            </h5>
                          </Card.Header>
                          <Card.Body>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="email-platform" />
                              <label className="form-check-label" htmlFor="email-platform">
                                <strong>Access Email Platform:</strong> Login to your email marketing tool (Mailchimp, ConvertKit, etc.)
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="email-newsletter-content" />
                              <label className="form-check-label" htmlFor="email-newsletter-content">
                                <strong>Use Newsletter Prompts:</strong> Copy email newsletter content from the generated marketing prompts
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="email-subject-line" />
                              <label className="form-check-label" htmlFor="email-subject-line">
                                <strong>Craft Subject Line:</strong> Test and select the best subject line from generated options
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="email-template" />
                              <label className="form-check-label" htmlFor="email-template">
                                <strong>Format Newsletter:</strong> Apply your email template and format the content for readability
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="email-test" />
                              <label className="form-check-label" htmlFor="email-test">
                                <strong>Send Test Email:</strong> Send a test email to yourself to check formatting and links
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="email-send" />
                              <label className="form-check-label" htmlFor="email-send">
                                <strong>Send to Subscribers:</strong> Schedule or send the newsletter to your email list
                              </label>
                            </div>
                            <Alert variant="warning" className="mt-3 bg-transparent border-warning">
                              <small>
                                <strong>📬 Email Tips:</strong> Best sending times are Tuesday-Thursday, 10 AM or 2 PM. 
                                Keep subject lines under 50 characters for mobile optimization.
                              </small>
                            </Alert>
                          </Card.Body>
                        </Card>

                        {/* Cross-Platform Promotion */}
                        <Card className="mb-4 border-success bg-transparent">
                          <Card.Header className="bg-transparent border-success">
                            <h5 className="mb-0 text-success">
                              <span className="me-2">🔄</span>
                              Cross-Platform Promotion
                            </h5>
                          </Card.Header>
                          <Card.Body>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="cross-promote-linkedin" />
                              <label className="form-check-label" htmlFor="cross-promote-linkedin">
                                <strong>Share YouTube on LinkedIn:</strong> Create a LinkedIn post promoting your YouTube video
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="cross-promote-email" />
                              <label className="form-check-label" htmlFor="cross-promote-email">
                                <strong>Include Video in Newsletter:</strong> Add YouTube video link to your email newsletter
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="cross-promote-stories" />
                              <label className="form-check-label" htmlFor="cross-promote-stories">
                                <strong>Create Stories Content:</strong> Use generated content for Instagram/LinkedIn stories
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="cross-promote-community" />
                              <label className="form-check-label" htmlFor="cross-promote-community">
                                <strong>Share in Communities:</strong> Post relevant content in LinkedIn groups or professional communities
                              </label>
                            </div>
                          </Card.Body>
                        </Card>

                        {/* Analytics & Follow-up */}
                        <Card className="mb-4 border-info bg-transparent">
                          <Card.Header className="bg-transparent border-info">
                            <h5 className="mb-0 text-info">
                              <span className="me-2">📊</span>
                              Analytics & Follow-up
                            </h5>
                          </Card.Header>
                          <Card.Body>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="analytics-setup" />
                              <label className="form-check-label" htmlFor="analytics-setup">
                                <strong>Monitor Initial Performance:</strong> Check engagement in first 2-4 hours across all platforms
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="analytics-engage" />
                              <label className="form-check-label" htmlFor="analytics-engage">
                                <strong>Engage with Audience:</strong> Respond to comments and messages promptly
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="analytics-track" />
                              <label className="form-check-label" htmlFor="analytics-track">
                                <strong>Track Performance:</strong> Record metrics for future content optimization
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="analytics-followup" />
                              <label className="form-check-label" htmlFor="analytics-followup">
                                <strong>Plan Follow-up Content:</strong> Based on engagement, plan related content for next cycle
                              </label>
                            </div>
                          </Card.Body>
                        </Card>

                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <Button
                          variant="outline-secondary"
                          onClick={() => setActiveTab('review-execute')}
                        >
                          ← Back to Review & Execute
                        </Button>
                        <Button
                          variant="outline-success"
                          onClick={() => setActiveTab('seed-data')}
                        >
                          🔄 Start New Content Cycle
                        </Button>
                      </div>

                      <Alert variant="success" className="mt-4 bg-transparent border-success">
                        <Alert.Heading className="h6 d-flex align-items-center gap-2">
                          <CheckCircle size={20} />
                          Publishing Success Tips
                        </Alert.Heading>
                        <ul className="mb-0 small">
                          <li>🕐 <strong>Timing:</strong> Post when your audience is most active</li>
                          <li>💬 <strong>Engagement:</strong> Respond to comments within 1-2 hours</li>
                          <li>📈 <strong>Analytics:</strong> Track performance to optimize future content</li>
                          <li>🔄 <strong>Consistency:</strong> Maintain regular posting schedule across platforms</li>
                          <li>🎯 <strong>Cross-promotion:</strong> Leverage each platform to promote content on others</li>
                        </ul>
                      </Alert>
                    </Card.Body>
                  </Card>
                </Tab.Pane>