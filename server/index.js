import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Webflow API proxy endpoint
app.all('/api/webflow/*', async (req, res) => {
  const webflowPath = req.path.replace('/api/webflow', '');
  const webflowUrl = `https://api.webflow.com${webflowPath}${
    req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''
  }`;

  try {
    // Forward the request to Webflow API
    const headers = {
      'Authorization': req.headers.authorization,
      'accept': req.headers.accept || 'application/json',
      'content-type': req.headers['content-type'] || 'application/json'
    };

    const options = {
      method: req.method,
      headers: headers
    };

    // Add body for POST, PATCH, PUT requests
    if (req.body && Object.keys(req.body).length > 0) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(webflowUrl, options);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Webflow API proxy error:', error);
    res.status(500).json({
      error: 'Proxy server error',
      message: error.message
    });
  }
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Webflow API proxy available at /api/webflow/*`);
});
