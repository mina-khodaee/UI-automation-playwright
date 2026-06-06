const http = require('http');

// Let's check the actual rendered content of the home page
// by looking at the RSC data embedded in the HTML
http.get('http://localhost:3000/home/', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    // Find the RSC payload
    const matches = d.match(/self\.__next_f\.push\(\[[^\]]+\],\s*"([^"]+)"\)/g);
    if (matches) {
      console.log('Found', matches.length, 'RSC chunks');
      // Check the last chunk
      const last = matches[matches.length - 1];
      console.log('Last RSC chunk (truncated):', last.substring(0, 300));
    } else {
      console.log('No RSC chunks found (checking other patterns)');
      // Try alternative patterns
      const altMatches = d.match(/self\.__next_f[^;]+/g);
      if (altMatches) {
        console.log('Found', altMatches.length, 'alternative RSC references');
        altMatches.forEach((m, i) => console.log(`${i}:`, m.substring(0, 200)));
      } else {
        console.log('No RSC data found at all');
        // Print last 2000 chars for debugging
        console.log('Last 2000 chars:', d.substring(d.length - 2000));
      }
    }
  });
}).on('error', e => console.log('Error:', e.message));
