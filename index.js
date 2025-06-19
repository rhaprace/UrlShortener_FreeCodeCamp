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

app.post('/api/shorturl', express.urlencoded({ extended: false }), function(req, res) {
  const url = req.body.url;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  // Here you would typically process the URL, e.g., save it to a database
  // For this example, we'll just return a mock response
  res.json({ original_url: url, short_url: Math.floor(Math.random() * 1000) });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
