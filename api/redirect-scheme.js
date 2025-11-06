// Vercel API Route for K Bank Scheme Redirect
// File: /api/redirect-scheme.js

export default function handler(req, res) {
  // Target K Bank scheme URL
  const schemeUrl = 'kbank.kplus://resume';
  
  // Log access for analytics
  console.log(`� K Bank Scheme Page Access: ${req.url}`);
  console.log(`📊 Request Info:`, {
    method: req.method,
    userAgent: req.headers['user-agent'],
    referrer: req.headers.referer || 'Direct',
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    timestamp: new Date().toISOString()
  });
  
  // Return 200 OK with HTML page
  res.status(200);
  
  // Standard headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Handle different HTTP methods
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.end();
    return;
  }
  
  // Send HTML response with JavaScript redirect only
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>เปิดแอป K Bank</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <style>
    body { 
      font-family: Arial, sans-serif; 
      text-align: center; 
      padding: 50px 20px; 
      background: linear-gradient(135deg, #1e3c72, #2a5298);
      color: white;
      min-height: 100vh;
      margin: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .container { 
      background: rgba(255, 255, 255, 0.1); 
      padding: 40px; 
      border-radius: 20px; 
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      max-width: 400px; 
    }
    .icon { font-size: 4rem; margin-bottom: 20px; }
    .title { margin-bottom: 15px; font-size: 1.8rem; font-weight: 600; }
    .message { margin-bottom: 25px; line-height: 1.6; opacity: 0.9; }
    .manual-link { 
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      color: white; 
      padding: 15px 30px; 
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50px; 
      text-decoration: none; 
      margin: 10px 0;
      transition: all 0.3s ease;
      font-weight: 600;
    }
    .manual-link:hover { 
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }
    .countdown { 
      font-size: 1.2rem; 
      margin-top: 20px; 
      opacity: 0.8; 
    }
  </style>
  <script>
    // Client-side redirect only - no server redirect
    console.log('🚀 Attempting to open K Bank app via scheme URL');
    
    // Immediate redirect
    window.location.href = '${schemeUrl}';
    
    // Countdown for user feedback
    let countdown = 3;
    function updateCountdown() {
      const countdownElement = document.getElementById('countdown');
      if (countdownElement) {
        countdownElement.textContent = countdown;
        countdown--;
        if (countdown >= 0) {
          setTimeout(updateCountdown, 1000);
        } else {
          countdownElement.textContent = '0';
        }
      }
    }
    
    // Start countdown when page loads
    document.addEventListener('DOMContentLoaded', function() {
      updateCountdown();
      
      // Log for debugging
      console.log('K Bank scheme redirect page loaded');
      console.log('Scheme URL:', '${schemeUrl}');
      console.log('User Agent:', navigator.userAgent);
    });
  </script>
</head>
<body>
  <div class="container">
    <div class="icon">🏦</div>
    <h2 class="title">เปิดแอป K Bank</h2>
    <p class="message">
      กำลังเปิดแอป K Bank...<br>
      หากแอปไม่เปิดโดยอัตโนมัติ ให้คลิกปุ่มด้านล่าง
    </p>
    
    <a href="${schemeUrl}" class="manual-link">
      🏦 เปิดแอป K Bank
    </a>
    
    <div class="countdown">
      หน้านี้จะปิดใน <span id="countdown">3</span> วินาที
    </div>
  </div>
</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
}
