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
  
  // Log redirect for analytics
  console.log(`🔄 Server 301 Redirect: ${req.url} -> ${redirectUrl}`);
  console.log(`📊 Request Info:`, {
    method: req.method,
    userAgent: req.headers['user-agent'],
    referrer: req.headers.referer || 'Direct',
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    timestamp: new Date().toISOString()
  });
  
  // Set 301 redirect headers
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
