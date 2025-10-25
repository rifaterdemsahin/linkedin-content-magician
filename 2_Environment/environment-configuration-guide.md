# Environment Configuration Guide 🔧

## Overview
This guide explains how to configure environment variables for the LinkedIn Content Magician application and its integration with the Proxmox-based n8n automation environment.

## 📁 Environment Files

### File Structure
```
linkedin-content-magician/
├── .env.example          # Template with all available variables
├── .env.development      # Development environment settings  
├── .env.production       # Production environment settings
└── 2_Environment/
    └── proxmox-n8n-architecture.md  # Detailed infrastructure docs
```

### Environment Files Purpose

#### `.env.production`
- **Production webhook URL**: `https://n8n.rifaterdemsahin.com/webhook/05c91180-4e19-4ccd-8917-658a96008ad9`
- **Optimized settings**: Disabled debug mode, info-level logging
- **Performance tuned**: Production timeout and retry settings

#### `.env.development`
- **Development webhook URL**: Same as production for testing
- **Debug enabled**: Full debugging and verbose logging
- **Development optimized**: Extended timeouts for debugging

#### `.env.example`
- **Template file**: Copy and rename to create your environment files
- **Documentation**: Shows all available configuration options
- **Security**: No sensitive data, safe to commit to version control

## 🚀 Quick Setup

### 1. Copy Environment File
```bash
# For development
cp .env.example .env.development

# For production  
cp .env.example .env.production
```

### 2. Update Configuration
Edit the copied file with your specific settings:
```bash
# Update webhook URL if needed
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id

# Configure debug settings
DEBUG_MODE=true  # for development
DEBUG_MODE=false # for production
```

### 3. Vite Integration
The React app uses Vite environment variables:
```javascript
// In App.jsx
const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'fallback-url'
```

## 🔗 Production n8n Environment

### Webhook URL Structure
```
https://n8n.rifaterdemsahin.com/webhook/05c91180-4e19-4ccd-8917-658a96008ad9
│                               │        │
│                               │        └─ Unique webhook ID
│                               └─ Webhook endpoint path  
└─ Proxmox-hosted n8n subdomain
```

### Environment Benefits

#### 🏗️ **Proxmox Infrastructure**
- **Self-hosted control**: Complete infrastructure ownership
- **Cost efficiency**: No monthly SaaS fees for n8n Cloud  
- **Performance**: Dedicated resources and low latency
- **Security**: Data stays on your infrastructure

#### ⚡ **n8n Automation Platform**
- **Workflow automation**: Visual workflow builder
- **API integrations**: LinkedIn, Twitter, email, databases
- **Custom logic**: JavaScript functions and conditional flows
- **Reliability**: Robust retry mechanisms and error handling

#### 🔄 **Integration Flow**
1. **Content Magician** sends webhook request to n8n
2. **n8n workflow** processes content and applies business rules
3. **LinkedIn API** publishes content automatically
4. **Analytics tracking** monitors post performance
5. **Feedback loop** improves future content generation

## 📊 Configuration Variables

### Core Settings
| Variable | Purpose | Example |
|----------|---------|---------|
| `N8N_WEBHOOK_URL` | Production webhook endpoint | `https://n8n.rifaterdemsahin.com/webhook/...` |
| `N8N_HOST` | n8n server hostname | `n8n.rifaterdemsahin.com` |
| `N8N_WEBHOOK_ID` | Unique webhook identifier | `05c91180-4e19-4ccd-8917-658a96008ad9` |

### Application Settings
| Variable | Purpose | Values |
|----------|---------|--------|
| `APP_ENV` | Environment mode | `production`, `development` |
| `DEBUG_MODE` | Enable debug features | `true`, `false` |
| `LOG_LEVEL` | Logging verbosity | `debug`, `info`, `warn`, `error` |

### Performance Settings
| Variable | Purpose | Default |
|----------|---------|---------|
| `WEBHOOK_TIMEOUT` | Request timeout (ms) | `30000` |
| `RETRY_ATTEMPTS` | Max retry count | `3` |
| `RETRY_DELAY` | Delay between retries (ms) | `1000` |

## 🔒 Security Best Practices

### Environment File Security
```bash
# Add to .gitignore to prevent committing sensitive data
.env.development
.env.production
.env.local

# Keep .env.example for documentation (no sensitive data)
```

### Production Security
- **HTTPS only**: All webhook URLs use SSL encryption
- **Access control**: Webhook endpoints behind authentication
- **Network security**: Proxmox firewall rules restrict access
- **Regular updates**: Keep n8n and infrastructure updated

## 🛠️ Development Workflow

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.development

# 3. Start development server
npm run dev

# 4. Test webhook integration
# The app will use VITE_N8N_WEBHOOK_URL from .env.development
```

### Production Deployment
```bash
# 1. Prepare production environment
cp .env.example .env.production

# 2. Update production settings
nano .env.production

# 3. Build for production
npm run build

# 4. Deploy to production server
# Environment variables automatically loaded
```

## 🔧 Troubleshooting

### Common Issues

#### Webhook Connection Failed
```bash
# Check n8n service status
systemctl status n8n

# Test webhook endpoint
curl -X POST https://n8n.rifaterdemsahin.com/webhook/05c91180-4e19-4ccd-8917-658a96008ad9 \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

#### Environment Variables Not Loading
```javascript
// Check if Vite variables are properly prefixed
console.log(import.meta.env.VITE_N8N_WEBHOOK_URL); // ✅ Works
console.log(import.meta.env.N8N_WEBHOOK_URL);      // ❌ Won't work in browser
```

#### SSL Certificate Issues
```bash
# Check SSL certificate status
openssl s_client -connect n8n.rifaterdemsahin.com:443 -servername n8n.rifaterdemsahin.com

# Renew Let's Encrypt certificate
certbot renew --nginx
```

## 📈 Monitoring & Maintenance

### Health Checks
```bash
# n8n Health Check
curl https://n8n.rifaterdemsahin.com/healthz

# Webhook Endpoint Test
curl -X POST https://n8n.rifaterdemsahin.com/webhook/05c91180-4e19-4ccd-8917-658a96008ad9 \
  -H "Content-Type: application/json" \
  -d '{"source": "health-check", "timestamp": "'$(date -Iseconds)'"}'
```

### Performance Monitoring
- **Response times**: Monitor webhook response latency
- **Success rates**: Track successful vs failed requests  
- **Resource usage**: Monitor Proxmox VM performance
- **Error rates**: Monitor n8n workflow execution errors

## 🚀 Next Steps

1. **Copy `.env.example`** to your desired environment file
2. **Update webhook URL** if using different n8n instance
3. **Configure debug settings** based on environment needs
4. **Test webhook integration** with the Content Magician app
5. **Monitor performance** and adjust timeout settings as needed

For detailed infrastructure information, see [proxmox-n8n-architecture.md](./proxmox-n8n-architecture.md).

---

*This environment configuration enables seamless integration between the LinkedIn Content Magician and the powerful Proxmox-based n8n automation platform.*

**Last Updated**: October 25, 2025  
**Configuration Version**: 1.0