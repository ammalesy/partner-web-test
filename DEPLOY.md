# Partner Web Portal - Server Redirects

โปรเจค Partner Web Portal พร้อมระบบ Server-side 301 Redirects สำหรับ Vercel

## 🚀 Quick Deploy to Vercel

### 1. Install Dependencies
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy Project
```bash
vercel
```

### 4. Test Redirects
หลังจาก deploy เสร็จ ให้ทดสอบ redirect endpoints:
- `https://your-project.vercel.app/test-redirect` - Vercel config redirect
- `https://your-project.vercel.app/api/redirect` - API route redirect

## 📁 File Structure

```
project/
├── vercel.json          # Vercel configuration
├── api/
│   └── redirect.js      # API endpoint for redirects
├── index.html           # Main portal page
├── test-redirect.html   # Redirect test page
├── styles.css          # Styles
├── deeplink-manager.js # JavaScript functionality
└── package.json        # Project configuration
```

## ⚙️ Configuration Files

### vercel.json
- กำหนด redirects และ headers
- ตั้งค่า 301 permanent redirects
- Cache control headers

### api/redirect.js
- Serverless function สำหรับ dynamic redirects
- รองรับ query parameters
- Analytics logging

## 🔗 Redirect Endpoints

1. **Static Redirect** (`/test-redirect`)
   - ใช้ vercel.json configuration
   - HTTP 301 permanent redirect
   - Cache 1 ปี

2. **Dynamic Redirect** (`/api/redirect`)
   - Serverless function
   - รองรับ parameters: `?url=`, `?token=`, `?action=`
   - Real-time analytics

## 📊 Analytics & Monitoring

Redirects จะ log ข้อมูลต่อไปนี้:
- Source URL
- Target URL  
- User Agent
- Referrer
- IP Address
- Timestamp

## 🧪 Local Development

```bash
# Start development server
npm run dev

# Test redirects locally
curl -I http://localhost:3000/test-redirect
curl -I http://localhost:3000/api/redirect
```

## 🌐 Production Deployment

```bash
# Deploy to production
npm run deploy

# Or use Vercel CLI
vercel --prod
```

## 🔧 Custom Configuration

### Adding New Redirects
Edit `vercel.json`:
```json
{
  "redirects": [
    {
      "source": "/your-path",
      "destination": "https://your-target.com",
      "statusCode": 301
    }
  ]
}
```

### API Route Parameters
Use `/api/redirect` with query parameters:
- `?url=https://example.com` - Custom redirect URL
- `?token=abc123` - Token parameter
- `?action=transfer` - Action parameter

## 📈 SEO Benefits

- **Real HTTP 301**: Search engines receive proper status codes
- **Link Juice Transfer**: SEO authority passes through redirects  
- **Browser Caching**: Reduces server load
- **Analytics Friendly**: Proper tracking of redirects

## 🛠️ Troubleshooting

### Redirects Not Working
1. ตรวจสอบ `vercel.json` syntax
2. Redeploy project: `vercel --prod`
3. Check browser cache (force refresh)
4. Test with curl: `curl -I https://your-domain.com/test-redirect`

### API Route Issues
1. Check function logs in Vercel dashboard
2. Verify Node.js version compatibility
3. Test locally with `vercel dev`

## 📞 Support

สำหรับปัญหาการใช้งาน กรุณาติดต่อทีมพัฒนา
