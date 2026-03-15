import http from 'http';

const venueSections = {
  "Raymond James Stadium": [
    { name: "Section 101", price: 550 }, { name: "Section 102", price: 550 },
    { name: "Section 103", price: 500 }, { name: "Section 104", price: 500 },
    { name: "Section 105", price: 450 }, { name: "Section 106", price: 450 },
    { name: "Section 107", price: 400 }, { name: "Section 108", price: 400 },
    { name: "Section 201", price: 320 }, { name: "Section 202", price: 320 }
  ],
  "Sun Bowl Stadium": [
    { name: "Section 101", price: 420 }, { name: "Section 102", price: 420 },
    { name: "Section 103", price: 380 }, { name: "Section 104", price: 380 },
    { name: "Section 105", price: 320 }, { name: "Section 106", price: 320 }
  ],
  "AT&T Stadium": [
    { name: "Club 100", price: 650 }, { name: "Club 101", price: 650 },
    { name: "Club 102", price: 600 }, { name: "Club 103", price: 600 },
    { name: "Section 101", price: 550 }, { name: "Section 102", price: 550 },
    { name: "Section 103", price: 500 }, { name: "Section 104", price: 500 },
    { name: "Section 105", price: 450 }, { name: "Section 106", price: 450 },
    { name: "Section 201", price: 380 }, { name: "Section 202", price: 380 },
    { name: "Section 203", price: 320 }, { name: "Section 204", price: 320 }
  ],
  "Stanford Stadium": [
    { name: "Section 101", price: 520 }, { name: "Section 102", price: 520 },
    { name: "Section 103", price: 480 }, { name: "Section 104", price: 480 },
    { name: "Section 105", price: 420 }, { name: "Section 106", price: 420 },
    { name: "Section 201", price: 340 }, { name: "Section 202", price: 340 }
  ],
  "Allegiant Stadium": [
    { name: "Section 101", price: 600 }, { name: "Section 102", price: 600 },
    { name: "Section 103", price: 550 }, { name: "Section 104", price: 550 },
    { name: "Section 105", price: 500 }, { name: "Section 106", price: 500 },
    { name: "Section 201", price: 420 }, { name: "Section 202", price: 420 },
    { name: "Section 203", price: 350 }, { name: "Section 204", price: 350 }
  ],
  "SoFi Stadium": [
    { name: "Section 101", price: 800 }, { name: "Section 102", price: 800 },
    { name: "Section 103", price: 700 }, { name: "Section 104", price: 700 },
    { name: "Section 105", price: 600 }, { name: "Section 106", price: 600 },
    { name: "Section 201", price: 500 }, { name: "Section 202", price: 500 },
    { name: "Section 203", price: 400 }, { name: "Section 204", price: 400 },
    { name: "Section 301", price: 320 }, { name: "Section 302", price: 320 }
  ],
  "MetLife Stadium": [
    { name: "Section 101", price: 700 }, { name: "Section 102", price: 700 },
    { name: "Section 103", price: 600 }, { name: "Section 104", price: 600 },
    { name: "Section 105", price: 500 }, { name: "Section 106", price: 500 },
    { name: "Section 201", price: 400 }, { name: "Section 202", price: 400 },
    { name: "Section 203", price: 350 }, { name: "Section 204", price: 350 }
  ],
  "Gillette Stadium": [
    { name: "Section 101", price: 520 }, { name: "Section 102", price: 520 },
    { name: "Section 103", price: 480 }, { name: "Section 104", price: 480 },
    { name: "Section 105", price: 420 }, { name: "Section 106", price: 420 },
    { name: "Section 201", price: 350 }, { name: "Section 202", price: 350 }
  ],
  "M&T Bank Stadium": [
    { name: "Section 101", price: 480 }, { name: "Section 102", price: 480 },
    { name: "Section 103", price: 420 }, { name: "Section 104", price: 420 },
    { name: "Section 105", price: 380 }, { name: "Section 106", price: 380 },
    { name: "Section 201", price: 320 }, { name: "Section 202", price: 320 }
  ],
  "Soldier Field": [
    { name: "Section 101", price: 650 }, { name: "Section 102", price: 650 },
    { name: "Section 103", price: 580 }, { name: "Section 104", price: 580 },
    { name: "Section 105", price: 500 }, { name: "Section 106", price: 500 },
    { name: "Section 201", price: 400 }, { name: "Section 202", price: 400 }
  ],
  "Rogers Centre": [
    { name: "Section 101", price: 600 }, { name: "Section 102", price: 600 },
    { name: "Section 103", price: 520 }, { name: "Section 104", price: 520 },
    { name: "Section 105", price: 450 }, { name: "Section 106", price: 450 },
    { name: "Section 201", price: 350 }, { name: "Section 202", price: 350 }
  ],
  "Estadio GNP Seguros": [
    { name: "Sección 101", price: 500 }, { name: "Sección 102", price: 500 },
    { name: "Sección 103", price: 450 }, { name: "Sección 104", price: 450 },
    { name: "Sección 105", price: 400 }, { name: "Sección 106", price: 400 }
  ]
};

const northAmericaCities = [
  { city: 'Tampa', countryCode: 'FL', venues: ['Raymond James Stadium'] },
  { city: 'El Paso', countryCode: 'TX', venues: ['Sun Bowl Stadium'] },
  { city: 'Arlington', countryCode: 'TX', venues: ['AT&T Stadium'] },
  { city: 'Stanford', countryCode: 'CA', venues: ['Stanford Stadium'] },
  { city: 'Las Vegas', countryCode: 'NV', venues: ['Allegiant Stadium'] },
  { city: 'Los Angeles', countryCode: 'CA', venues: ['SoFi Stadium'] },
  { city: 'East Rutherford', countryCode: 'NJ', venues: ['MetLife Stadium'] },
  { city: 'Foxborough', countryCode: 'MA', venues: ['Gillette Stadium'] },
  { city: 'Baltimore', countryCode: 'MD', venues: ['M&T Bank Stadium'] },
  { city: 'Chicago', countryCode: 'IL', venues: ['Soldier Field'] },
  { city: 'Toronto', countryCode: 'ON', venues: ['Rogers Centre'] },
  { city: 'Mexico City', countryCode: 'MX', venues: ['Estadio GNP Seguros'] }
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomCrypto() {
  return Math.random() > 0.5 ? 'USDT' : 'USDC';
}

let realTransactions = [];

function addRealTransaction(txData) {
  realTransactions.push({
    ...txData,
    timestamp: Date.now()
  });
}

function generateRandomTransactions(count = 15) {
  const transactions = [];
  const now = Date.now();
  const venues = Object.keys(venueSections);
  
  for (let i = 0; i < count; i++) {
    const venue = venues[Math.floor(Math.random() * venues.length)];
    const sections = venueSections[venue];
    
    if (!sections || sections.length === 0) continue;
    
    const section = sections[Math.floor(Math.random() * sections.length)];
    const tickets = getRandomInt(2, 4);
    const totalPrice = section.price * tickets;
    const crypto = getRandomCrypto();
    
    const minutesAgo = getRandomInt(5, 2880);
    const timestamp = now - (minutesAgo * 60 * 1000);
    
    const date = new Date(timestamp);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateStr = `${months[date.getMonth()]} ${date.getDate()}`;
    
    let cityInfo = { city: venue.split(' ')[0], countryCode: 'US' };
    for (const c of northAmericaCities) {
      if (c.venues[0] === venue) {
        cityInfo = { city: c.city, countryCode: c.countryCode };
        break;
      }
    }
    
    transactions.push({
      city: cityInfo.city,
      countryCode: cityInfo.countryCode,
      venue: venue,
      date: dateStr,
      section: section.name,
      price: `$${totalPrice.toLocaleString()}`,
      tickets: tickets,
      crypto: crypto,
      timestamp: timestamp
    });
  }
  
  return transactions;
}

function getTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 120) return `1m`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 7200) return `1h`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === '/api/deposits' && req.method === 'GET') {
    const randomTx = generateRandomTransactions(15 - realTransactions.length);
    const allTx = [...realTransactions, ...randomTx]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 15);
    
    const result = allTx.map(tx => ({
      ...tx,
      timeAgo: getTimeAgo(tx.timestamp)
    }));
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  }
  
  else if (req.url === '/api/add-transaction' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const txData = JSON.parse(body);
        addRealTransaction(txData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  }
  
  else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const port = 3001;
server.listen(port, () => {
  console.log(`✅ API Server running: http://localhost:${port}/api/deposits`);
});