require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urls = [];
let urlCounter = 1;

function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;
  if (!isValidUrl(url)) {
    return res.json({ error: 'invalid url' });
  }
  const existingUrl = urls.find(entry => entry.original_url === url);
  if (existingUrl) {
    return res.json({
      original_url: existingUrl.original_url,
      short_url: existingUrl.short_url
    });
  }
  const shortUrl = urlCounter++;
  const urlEntry = {
    original_url: url,
    short_url: shortUrl
  };
  
  urls.push(urlEntry);
  
  res.json({
    original_url: url,
    short_url: shortUrl
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;
  const shortUrlId = parseInt(shortUrl);
  
  const urlEntry = urls.find(entry => entry.short_url === shortUrlId);
  
  if (urlEntry) {
    res.redirect(urlEntry.original_url);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
