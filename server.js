const https = require('https');
const http = require('http');

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2tT4t8-3HJm3ZJizy6DBYFWW7fl9xQ_Id8CNAQAWPv-OpptfbWo6YcSNaZ-3C7tuB8jmkMnqnXZPe/pub?gid=1823444379&single=true&output=csv';

function fetchFollow(url, redirects, callback) {
  if (redirects > 10) return callback(new Error('Too many redirects'));
  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      return fetchFollow(res.headers.location, redirects + 1, callback);
    }
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => callback(null, data));
  }).on('error', callback);
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.url === '/data') {
    fetchFollow(CSV_URL, 0, (err, data) => {
      if (err) { res.writeHead(500); res.end('Error: ' + err.message); return; }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(data);
    });
  } else {
    res.writeHead(200);
    res.end('BTC Predictor Proxy OK');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Proxy running on port ' + PORT));
