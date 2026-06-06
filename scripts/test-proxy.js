const http = require('http');

const p = (url) => new Promise(r => {
  http.get(url, res => {
    let d = [];
    res.on('data', c => d.push(c));
    res.on('end', () => {
      const html = Buffer.concat(d).toString();
      r({ url, status: res.statusCode, size: html.length, snippet: html.substring(0, 300) });
    });
  }).on('error', e => r({ url, error: e.message }));
});

Promise.all([
  p('http://localhost:3000/home/'),
  p('http://localhost:3000/logo/logo-dejban.jpg'),
  p('http://localhost:3000/@vite/client'),
]).then(results => {
  results.forEach(r => {
    console.log(`\n${r.url}`);
    console.log(`  Status: ${r.status || 'ERR'}`);
    if (r.snippet) console.log(`  Size: ${r.size}b\n  Snippet: ${r.snippet}`);
    if (r.error) console.log(`  Error: ${r.error}`);
  });
});
