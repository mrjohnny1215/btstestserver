// api/utils/helpers.js
export function getTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 120) return `1m`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 7200) return `1h`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

export function getRandomCity() {
  const cities = [
    { city: 'Tampa', countryCode: 'FL', venue: 'Raymond James Stadium' },
    { city: 'Las Vegas', countryCode: 'NV', venue: 'Allegiant Stadium' },
    { city: 'Los Angeles', countryCode: 'CA', venue: 'SoFi Stadium' },
    { city: 'Chicago', countryCode: 'IL', venue: 'Soldier Field' },
    { city: 'Miami', countryCode: 'FL', venue: 'Hard Rock Stadium' },
    { city: 'Dallas', countryCode: 'TX', venue: 'AT&T Stadium' },
    { city: 'New York', countryCode: 'NY', venue: 'MetLife Stadium' }
  ];
  return cities[Math.floor(Math.random() * cities.length)];
}

export function getRandomSection() {
  const sections = [
    'Section 100', 'Section 200', 'Section 300', 'Section 400',
    'Floor A', 'Floor B', 'Floor C', 'Club Level'
  ];
  return sections[Math.floor(Math.random() * sections.length)];
}

export function getRandomPrice() {
  return (Math.floor(Math.random() * 1500) + 800) * (Math.floor(Math.random() * 3) + 2);
}

export function getRandomCrypto() {
  return Math.random() > 0.5 ? 'USDT' : 'USDC';
}