const https = require('https');
const http = require('http');

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2tT4t8-3HJm3ZJizy6DBYFWW7fl9xQ_Id8CNAQAWPv-OpptfbWo6YcSNaZ-3C7tuB8jmkMnqnXZPe/pub?gid=1823444379&single=true&output=csv';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/plain');

  if (req.url === '/data') {
    https.get(CSV_URL, (r) => {
      let data = '';
      r.on('data', chunk => data += chunk);
      r.on('end', () => { res.writeHead(200); res.end(data); });
    }).on('error', (e) => { res.writeHead(500); res.end('Error: ' + e.message); });
  } else {
    res.writeHead(200);
    res.end('BTC Predictor Proxy OK');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Proxy running on port ' + PORT));
