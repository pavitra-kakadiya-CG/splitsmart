// server.js
// Local Development Server (Zero-Dependency Node.js Server)
// Dispatches /api/* calls to serverless handlers and serves static frontend

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Simple .env file reader
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of envLines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx > -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
    console.log('✓ Loaded environment variables from .env');
  }
} catch (e) {
  console.warn('Could not read .env:', e.message);
}

const PORT = process.env.PORT || 3000;

// API Route Handlers
const routes = {
  '/api/config': require('./api/config'),
  '/api/create-order': require('./api/create-order'),
  '/api/capture-order': require('./api/capture-order'),
  '/api/payouts': require('./api/payouts'),
  '/api/scan-receipt': require('./api/scan-receipt'),
  '/api/settle-agent': require('./api/settle-agent'),
  '/api/state': require('./api/state')
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // 1. API Routes
  if (routes[pathname]) {
    // Helper wrappers to mimic express/vercel req and res
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        req.body = body ? JSON.parse(body) : {};
      } catch (e) {
        req.body = {};
      }
      req.query = parsedUrl.query;

      res.status = function(code) {
        this.statusCode = code;
        return this;
      };
      res.json = function(data) {
        this.setHeader('Content-Type', 'application/json');
        this.end(JSON.stringify(data));
        return this;
      };

      try {
        await routes[pathname](req, res);
      } catch (err) {
        console.error(`Error in route ${pathname}:`, err);
        if (!res.writableEnded) {
          res.status(500).json({ error: err.message || 'Internal Server Error' });
        }
      }
    });
    return;
  }

  // 2. Static File Serving
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'index.html');
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

let currentPort = Number(PORT);

function startServer(portToTry) {
  server.listen(portToTry, '127.0.0.1', () => {
    console.log(`\n======================================================`);
    console.log(`⚡ SplitSmart Local Server running at http://127.0.0.1:${portToTry}`);
    console.log(`✓ API Endpoints active:`);
    console.log(`  - POST /api/create-order  (PayPal Orders v2)`);
    console.log(`  - POST /api/capture-order (PayPal Order Capture)`);
    console.log(`  - POST /api/payouts       (PayPal Payouts API)`);
    console.log(`  - POST /api/scan-receipt  (Gemini Multimodal OCR)`);
    console.log(`  - POST /api/settle-agent  (Min-Cash-Flow Agent)`);
    console.log(`  - GET/POST /api/state     (Persistent Ledger)`);
    console.log(`======================================================\n`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    currentPort++;
    console.warn(`⚠️  Port in use, automatically trying http://127.0.0.1:${currentPort}...`);
    startServer(currentPort);
  } else {
    console.error('Server error:', err);
  }
});

startServer(currentPort);
