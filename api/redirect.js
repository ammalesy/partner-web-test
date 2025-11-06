// Vercel API Route for Server-side 301 Redirect
// File: /api/redirect.js

export default function handler(req, res) {
  // Target URL
  const targetUrl = 'https://www.kasikornbank.com/th/kplus/deeplinkkplus/?nextAction=transferwithkplus&tokenId=PTFMETTRF01FDB906BFC24F46D0808754DC44E76717TRF';
  
  // Get query parameters for dynamic redirects (optional)
  const { url, token, action } = req.query;
  
  // Build dynamic URL if parameters provided
  let redirectUrl = targetUrl;
  if (url) {
    redirectUrl = decodeURIComponent(url);
  } else if (token || action) {
    const urlObj = new URL(targetUrl);
    if (token) urlObj.searchParams.set('tokenId', token);
    if (action) urlObj.searchParams.set('nextAction', action);
    redirectUrl = urlObj.toString();
  }

  // Detect Huawei Browser
  const userAgent = req.headers['user-agent'] || '';
  const isHuaweiBrowser = /huawei|hms|harmonyos/i.test(userAgent) || 
                         /huaweibrowser/i.test(userAgent);
  
  // Check if it's a mobile device that should open app
  const isMobile = /android|iphone|ipad|mobile/i.test(userAgent);
  
  // Log redirect for analytics
  console.log(`🔄 Server 301 Redirect: ${req.url} -> ${redirectUrl}`);
  console.log(`📊 Request Info:`, {
    method: req.method,
    userAgent: req.headers['user-agent'],
    referrer: req.headers.referer || 'Direct',
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    isHuaweiBrowser: isHuaweiBrowser,
    isMobile: isMobile,
    timestamp: new Date().toISOString()
  });

  // Special handling for Huawei Browser and Universal Links
  if (isHuaweiBrowser && isMobile) {
    // For Huawei Browser, use JavaScript redirect instead of HTTP redirect
    // This helps Universal Links work better
    console.log('🔧 Using Huawei Browser compatible redirect');
    
    res.status(200); // Use 200 instead of 301 for Huawei
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('X-Redirect-By', 'Partner Portal Server (Huawei Compatible)');
    res.setHeader('X-Redirect-Type', 'JavaScript-Redirect');
    res.setHeader('X-Browser-Type', 'Huawei Browser');
    
    const huaweiHtml = `<!DOCTYPE html>
<html>
<head>
  <title>กำลังเปิดแอป K PLUS...</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 50px 20px; background: #f5f5f5; }
    .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 400px; margin: 0 auto; }
    .icon { font-size: 3rem; margin-bottom: 20px; }
    .title { color: #333; margin-bottom: 15px; }
    .message { color: #666; margin-bottom: 20px; }
    .manual-btn { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 25px; font-size: 16px; cursor: pointer; text-decoration: none; display: inline-block; }
    .manual-btn:hover { background: #0056b3; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">🏦</div>
    <h2 class="title">กำลังเปิดแอป K PLUS</h2>
    <p class="message">กำลังพยายามเปิดแอป K PLUS บน Huawei Browser...</p>
    <a href="${redirectUrl}" class="manual-btn" id="manual-link">เปิด K PLUS ด้วยตนเอง</a>
  </div>
  
  <script>
    // Multiple redirect strategies for Huawei Browser
    const targetUrl = '${redirectUrl}';
    
    // Strategy 1: Immediate location change
    setTimeout(() => {
      try {
        window.location.href = targetUrl;
      } catch (e) {
        console.log('Direct redirect failed:', e);
      }
    }, 100);
    
    // Strategy 2: User click simulation
    setTimeout(() => {
      try {
        const link = document.createElement('a');
        link.href = targetUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // Create and dispatch click event
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        link.dispatchEvent(clickEvent);
        
        // Cleanup
        setTimeout(() => document.body.removeChild(link), 100);
      } catch (e) {
        console.log('Click simulation failed:', e);
      }
    }, 500);
    
    // Strategy 3: Manual button enhancement
    document.getElementById('manual-link').addEventListener('click', function(e) {
      e.preventDefault();
      
      // Try multiple methods
      try {
        // Method 1: Direct navigation
        window.location.href = targetUrl;
        
        // Method 2: Window open (fallback)
        setTimeout(() => {
          window.open(targetUrl, '_self');
        }, 100);
        
        // Method 3: Create hidden iframe (sometimes helps with app links)
        setTimeout(() => {
          const iframe = document.createElement('iframe');
          iframe.src = targetUrl;
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
          
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
            // Final fallback: try location again
            window.location.href = targetUrl;
          }, 1000);
        }, 200);
        
      } catch (e) {
        console.error('All redirect methods failed:', e);
        alert('ไม่สามารถเปิดแอป K PLUS ได้ กรุณาเปิดแอปด้วยตนเอง');
      }
    });
    
    // Log for debugging
    console.log('Huawei Browser redirect page loaded');
    console.log('Target URL:', targetUrl);
    console.log('User Agent:', navigator.userAgent);
  </script>
</body>
</html>`;
    
    res.end(huaweiHtml);
    return;
  }
  
  // Standard HTTP 301 redirect for other browsers
  res.status(301);
  
  // Security headers
  res.setHeader('Location', redirectUrl);
  res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
  res.setHeader('X-Redirect-By', 'Partner Portal Server');
  res.setHeader('X-Redirect-Type', '301-Permanent');
  res.setHeader('X-Redirect-Target', redirectUrl);
  
  // CORS headers (if needed)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  
  // Optional: Set redirect reason header
  res.setHeader('X-Redirect-Reason', 'Resource moved permanently');
  
  // Handle different HTTP methods
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Send minimal HTML response (some clients need it)
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>301 Moved Permanently</title>
  <meta charset="utf-8">
  <meta name="robots" content="noindex">
</head>
<body>
  <h1>301 Moved Permanently</h1>
  <p>The document has moved <a href="${redirectUrl}">here</a>.</p>
</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
}
