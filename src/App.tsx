import { useState, useEffect } from "react";
import { tourData, type Region, type Show } from "./data/tourData";
import { CheckoutModal } from "./components/CheckoutModal";
import { activeVenuesConfig } from "./data/seatingConfig";

const IPINFO_TOKEN = '015baa47974dcd';

async function getUserContinent(): Promise<string> {
  try {
    const response = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`);
    const data = await response.json();
    
    const countryToContinent: Record<string, string> = {
      'US': 'NORTH AMERICA',
      'CA': 'NORTH AMERICA',
      'MX': 'NORTH AMERICA',
      'BR': 'LATIN AMERICA',
      'AR': 'LATIN AMERICA',
      'CO': 'LATIN AMERICA',
      'CL': 'LATIN AMERICA',
      'PE': 'LATIN AMERICA',
      'GB': 'EUROPE',
      'FR': 'EUROPE',
      'DE': 'EUROPE',
      'IT': 'EUROPE',
      'ES': 'EUROPE',
      'KR': 'ASIA PACIFIC',
      'JP': 'ASIA PACIFIC',
      'CN': 'ASIA PACIFIC',
      'TW': 'ASIA PACIFIC',
      'HK': 'ASIA PACIFIC',
      'SG': 'ASIA PACIFIC',
      'TH': 'ASIA PACIFIC',
      'VN': 'ASIA PACIFIC',
      'PH': 'ASIA PACIFIC',
      'ID': 'ASIA PACIFIC',
      'MY': 'ASIA PACIFIC',
      'AU': 'ASIA PACIFIC',
      'NZ': 'ASIA PACIFIC',
    };

    return countryToContinent[data.country] || 'NORTH AMERICA';
  } catch (error) {
    console.error('Failed to get location:', error);
    return 'NORTH AMERICA';
  }
}

const uniqueCities = new Set<string>();
tourData.forEach(region => 
  region.countries.forEach(country => 
    country.shows.forEach(show => 
      uniqueCities.add(show.city)
    )
  )
);
const CITY_COUNT = uniqueCities.size;

const uniqueCountries = new Set<string>();
tourData.forEach(region => 
  region.countries.forEach(country => 
    country.shows.forEach(show => {
      const addressParts = show.address.split(', ');
      const countryCode = addressParts[addressParts.length - 1];
      uniqueCountries.add(countryCode);
    })
  )
);
const COUNTRY_COUNT = uniqueCountries.size;

function formatPrice(price: number) {
  return `$${price.toLocaleString()}`;
}

function formatFullDate(dateStr: string, day: string) {
  if (!dateStr || !dateStr.includes(".")) return dateStr;
  const [m, d] = dateStr.split(".");
  const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  const monthIndex = parseInt(m, 10) - 1;
  const monthName = months[monthIndex];
  const dayNum = parseInt(d, 10);
  const year = (m === "01" || m === "02") ? 2027 : 2026;
  const shortDay = day.substring(0, 3).toUpperCase();

  return (
    <div className="flex flex-col leading-tight whitespace-nowrap">
      <span className="text-xs sm:text-sm font-black uppercase tracking-wider mb-0.5 text-gray-900">
        {monthName} {dayNum}, {year} <span className="font-black">{shortDay}</span>
      </span>
    </div>
  );
}

function HeroSection({ onRecentClick }: { onRecentClick: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center pt-20 sm:pt-24 md:pt-28 pb-4 overflow-hidden px-4 md:px-6 z-10 text-center w-full bg-white">
      <div className="relative z-30 max-w-2xl w-full flex flex-col items-center">
        <h1 className="text-[10vw] sm:text-[12vw] md:text-[8rem] font-black tracking-tighter leading-[0.75] mb-2 max-w-full text-gray-900">BTS</h1>
        <h2 className="text-[4vw] sm:text-[5vw] md:text-[3rem] font-black tracking-tighter mb-2 uppercase leading-tight max-w-full text-gray-900">ARIRANG WORLD TOUR</h2>
        <div className="text-sm sm:text-lg md:text-xl font-black tracking-[0.2em] mb-4 text-gray-900">2026 <span className="mx-2">~</span> 2027</div>
        
        <p className="text-xs sm:text-sm text-gray-600 mb-4 max-w-lg mx-auto leading-relaxed">
          The legendary group returns to 36 cities across 14 countries.<br className="hidden sm:block" />
          Experience the historic 'ARIRANG' World Tour.
        </p>
        
        <div className="flex flex-col items-center justify-center gap-2 w-full max-w-md mx-auto mb-4">
          <div className="w-full h-[44px] sm:h-[48px] flex items-center justify-center gap-2 sm:gap-3 rounded-lg border border-gray-300 bg-white shadow-sm">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 rounded-full"></div>
            <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase text-gray-700">INVENTORY VERIFIED</span>
          </div>
          
          <button 
            onClick={onRecentClick}
            className="w-full h-[44px] sm:h-[48px] flex items-center justify-center gap-2 sm:gap-3 rounded-lg border border-gray-300 bg-white shadow-sm hover:border-[#026CDF] transition-all"
          >
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-blue-500 rounded-full"></div>
            <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase text-gray-700">RECENT PURCHASES</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto mb-2">
          <div className="h-[44px] sm:h-[48px] flex items-center justify-center rounded-lg border border-gray-300 bg-white shadow-sm">
            <span className="text-sm sm:text-base font-black tracking-[0.1em] text-gray-900">{CITY_COUNT} CITIES</span>
          </div>
          <div className="h-[44px] sm:h-[48px] flex items-center justify-center rounded-lg border border-gray-300 bg-white shadow-sm">
            <span className="text-sm sm:text-base font-black tracking-[0.1em] text-gray-900">{COUNTRY_COUNT} COUNTRIES</span>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto mt-2">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-500 mb-2 text-center">PAYMENT</p>
            <div className="flex flex-col items-center justify-center gap-2 mb-3">
              <div className="flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/01/USDT_Logo.png" alt="USDT" className="w-5 h-5" />
                <span className="text-xs font-black text-gray-700">USDT (TRC-20)</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/USD_Coin_logo_%28cropped%29.png" alt="USDC" className="w-5 h-5" />
                <span className="text-xs font-black text-gray-700">USDC (Solana)</span>
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-500 text-center border-t border-gray-200 pt-2 leading-relaxed">
              Cryptocurrency payments only.<br />
              No credit cards or fiat currency accepted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShowCard({ show, onBuy }: { show: Show; onBuy: (show: Show) => void }) {
  const isStandardAvailable = show.standardSeats > 0 && !show.isTBA;
  const isVipAvailable = show.vipSeats > 0 && !show.soldOut && !show.isTBA;
  const isStayTuned = Boolean(show.isTBA);

  const getCityDisplayName = () => {
    const city = show.city.toUpperCase();
    const addressParts = show.address.split(", ");
    if (addressParts.length > 1) {
      const suffix = addressParts[addressParts.length - 1].trim();
      return `${city}, ${suffix}`;
    }
    return city;
  };

  const isKoreaJapan = show.city === "Goyang" || show.city === "Busan" || show.city === "Tokyo" || show.city === "Osaka" || show.city === "Nagoya";
  const isNorthAmericaEurope = ["Tampa", "El Paso", "Arlington", "Stanford", "Las Vegas", "Los Angeles", "East Rutherford", "Foxborough", "Baltimore", "Chicago", "Toronto", "Mexico City", "Madrid", "Brussels", "Munich", "Paris", "London"].includes(show.city);

  if (isStayTuned) {
    return (
      <div className="group p-3 sm:p-4 rounded-xl transition-all duration-300 w-full bg-white border border-gray-200 opacity-75">
        <div className="flex flex-col items-center justify-center w-full text-center">
          <h3 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-tight text-black mb-1">
            {getCityDisplayName()}
          </h3>
          <span className="text-[9px] sm:text-[10px] font-black text-black uppercase tracking-wider px-1.5 py-0.5 bg-white rounded">
            STAY TUNED
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="group p-3 sm:p-4 md:p-5 rounded-xl transition-all duration-300 w-full bg-white border border-gray-200 hover:border-[#026CDF] hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3 w-full">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-900">
            {formatFullDate(show.date, show.day)}
          </p>
          <h3 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tight mt-0.5 text-gray-900">
            {getCityDisplayName()}
          </h3>
          <p className="text-xs sm:text-sm font-black uppercase tracking-wide text-gray-500">
            {show.venue}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between gap-2 w-full sm:w-auto sm:gap-4 md:gap-6 sm:justify-end">
          <div className="flex flex-row items-center gap-3 sm:gap-4 md:gap-6 flex-1 sm:flex-none">
            <div className="flex flex-col items-start sm:items-end min-w-[60px] sm:min-w-[85px]">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-600 text-center w-full">
                <span className="sm:hidden">STD</span>
                <span className="hidden sm:inline">STANDARD</span>
              </span>
              {isKoreaJapan ? (
                <span className="text-sm sm:text-base md:text-lg font-black text-red-500 leading-none text-center w-full text-[10px] sm:text-xs">
                  SOLD OUT
                </span>
              ) : isStandardAvailable ? (
                <span className="text-sm sm:text-base md:text-lg font-black text-gray-900 leading-none">
                  FROM {formatPrice(show.standard)}
                </span>
              ) : (
                <span className="text-sm sm:text-base md:text-lg font-black text-red-500 leading-none text-center w-full text-[10px] sm:text-xs">
                  SOLD
                </span>
              )}
            </div>

            <div className="flex flex-col items-center sm:items-end min-w-[50px] sm:min-w-[75px]">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-600 text-center w-full">VIP</span>
              {isKoreaJapan || isNorthAmericaEurope || !isVipAvailable ? (
                <span className="text-sm sm:text-base md:text-lg font-black text-red-500 leading-none text-center w-full text-[10px] sm:text-xs">
                  UNAVAILABLE
                </span>
              ) : (
                <span className="text-sm sm:text-base md:text-lg font-black text-gray-900 leading-none">
                  {formatPrice(show.vip)}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <button 
              onClick={() => onBuy(show)} 
              disabled={!isStandardAvailable || isKoreaJapan}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-lg font-black text-xs sm:text-sm uppercase tracking-[0.15em] transition-all flex items-center justify-center whitespace-nowrap touch-manipulation ${
                isStandardAvailable && !isKoreaJapan
                  ? "bg-[#026CDF] text-white hover:bg-[#0047B3] active:scale-95 shadow-sm" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
              }`}
            >
              <span className="sm:hidden text-[9px]">Tickets</span>
              <span className="hidden sm:inline">Tickets</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentPurchasesSection({ show }: { show: boolean }) {
  const [purchases, setPurchases] = useState<Array<{
    city: string;
    countryCode: string;
    venue: string;
    date: string;
    section: string;
    price: string;
    tickets: number;
    crypto: 'USDT' | 'USDC';
    timestamp: number;
    timeAgo: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 120) return `1m`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 7200) return `1h`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/deposits');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setPurchases(data);
      setError(null);
    } catch (err) {
      console.error('API 호출 실패:', err);
      setError('Failed to load recent purchases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!show) return;

    fetchPurchases();

    const interval = setInterval(fetchPurchases, 5 * 60 * 1000);
    const timeUpdateInterval = setInterval(() => {
      setPurchases(prev => 
        prev.map(p => ({
          ...p,
          timeAgo: getTimeAgo(p.timestamp)
        }))
      );
    }, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(timeUpdateInterval);
    };
  }, [show]);

  if (!show) return null;

  return (
    <section id="recent-purchases" className="py-4 px-4 md:px-6 max-w-6xl mx-auto relative z-30 w-full">
      <div className="text-center mb-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 tracking-tighter text-gray-900">
          RECENT PURCHASES
        </h2>
        <div className="w-12 h-0.5 mx-auto rounded-full bg-[#026CDF]"></div>
        <p className="text-xs text-gray-500 mt-1">Live updates every 5m</p>
      </div>
      
      {loading && purchases.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">Loading recent purchases...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      ) : (
        <div className="space-y-1">
          {purchases.map((purchase, idx) => (
            <div key={idx}>
              <div className="flex items-start justify-between py-2">
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-1 flex-wrap mb-0.5">
                    <span className="text-sm font-black uppercase tracking-wide text-gray-900">{purchase.city}, {purchase.countryCode}</span>
                    <span className="text-[9px] font-black text-gray-400">•</span>
                    <span className="text-[9px] font-black text-gray-400">{purchase.date}</span>
                    <span className="text-[9px] font-black text-gray-400">•</span>
                    <span className="text-[9px] font-black text-gray-400">{purchase.timeAgo}</span>
                  </div>
                  <p className="text-xs font-black text-gray-600">
                    {purchase.venue} {purchase.section} • {purchase.tickets} tickets
                  </p>
                </div>
                <div className="text-right flex flex-col items-end min-w-[75px]">
                  <span className="text-base font-black text-gray-900">{purchase.price}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {purchase.crypto === 'USDT' ? (
                      <>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/01/USDT_Logo.png" alt="USDT" className="w-2.5 h-2.5" />
                        <span className="text-[7px] font-black text-gray-500">USDT</span>
                      </>
                    ) : (
                      <>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/USD_Coin_logo_%28cropped%29.png" alt="USDC" className="w-2.5 h-2.5" />
                        <span className="text-[7px] font-black text-gray-500">USDC</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {idx < purchases.length - 1 && <div className="border-t border-gray-100 my-1"></div>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function SecurityBadges() {
  return (
    <div className="flex items-center justify-center gap-4 mt-8 mb-4">
      <div className="flex items-center gap-1 text-gray-600">
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="text-xs font-black">SSL Secured</span>
      </div>
      <div className="w-px h-4 bg-gray-300"></div>
      <div className="flex items-center gap-1 text-gray-600">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="text-xs font-black">Verified</span>
      </div>
      <div className="w-px h-4 bg-gray-300"></div>
      <div className="flex items-center gap-1 text-gray-600">
        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs font-black">24/7 Support</span>
      </div>
    </div>
  );
}

function InfoModal({ isOpen, onClose, title, content }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  content: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed font-black">{content}</p>
        <button 
          onClick={onClose}
          className="mt-6 w-full py-2.5 bg-[#026CDF] text-white font-black text-sm uppercase tracking-wider rounded-lg hover:bg-[#0047B3] transition-all"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}

export function App() {
  const [activeRegion, setActiveRegion] = useState("ALL");
  const [userContinent, setUserContinent] = useState("NORTH AMERICA");
  const [regionOrder, setRegionOrder] = useState<string[]>([]);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [showRecent, setShowRecent] = useState(false);
  const [modalInfo, setModalInfo] = useState<{ title: string; content: string; isOpen: boolean }>({
    title: '',
    content: '',
    isOpen: false
  });

  useEffect(() => {
    getUserContinent().then(continent => {
      setUserContinent(continent);
      
      const allRegions = ["ALL", ...tourData.map(r => r.name)];
      const sorted = [...allRegions].sort((a, b) => {
        if (a === "ALL") return -1;
        if (b === "ALL") return 1;
        if (a === continent) return -1;
        if (b === continent) return 1;
        return 0;
      });
      setRegionOrder(sorted);
    });
  }, []);

  const filteredData = activeRegion === "ALL" ? tourData : tourData.filter(r => r.name === activeRegion);

  const footerContents = {
    'Help Center': 'Our dedicated support team is available 24/7 to assist you with any questions about ticket purchases, account management, or technical issues. We\'re here to ensure your ticketing experience is seamless and enjoyable.',
    'Contact Support': 'Reach out to our customer support team via email at support@globalstage.com. We typically respond within 24 hours. For urgent matters, please include "URGENT" in your subject line.',
    'Order Status': 'Track your order status in real-time. Once your purchase is confirmed, you\'ll receive a confirmation email with your order details and e-tickets. Orders typically process within 10-15 minutes.',
    'About Us': 'GLOBAL STAGE is the premier ticket exchange platform for BTS concerts worldwide. We provide a secure, verified marketplace for fans to buy and sell authentic tickets with confidence.',
    'Become a Partner': 'Interested in partnering with GLOBAL STAGE? We\'re always looking for venues, promoters, and ticket sellers to join our network. Contact our partnerships team at partners@globalstage.com.',
    'Accessibility': 'GLOBAL STAGE is committed to providing an accessible platform for all users. Our website complies with WCAG 2.1 guidelines. For accessibility assistance, please contact our support team.',
    'Terms of Service': 'By using GLOBAL STAGE, you agree to our terms of service. All ticket sales are final unless otherwise specified. Tickets are verified and guaranteed authentic through our secure marketplace.',
    'Privacy Policy': 'We take your privacy seriously. Your personal information is encrypted and never shared with third parties without your consent. We use industry-standard security measures to protect your data.',
    'Cookie Policy': 'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By continuing to use our site, you consent to our use of cookies in accordance with our policy.'
  };

  const openModal = (title: string) => {
    setModalInfo({
      title,
      content: footerContents[title as keyof typeof footerContents] || 'Information not available.',
      isOpen: true
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <InfoModal 
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo({ ...modalInfo, isOpen: false })}
        title={modalInfo.title}
        content={modalInfo.content}
      />
      
      <div className="relative z-50">
        <nav className="fixed top-0 left-0 right-0 z-[100] py-3 sm:py-4 px-4 md:px-10 flex justify-between items-center bg-white border-b border-gray-200">
          <div className="flex items-center gap-3 md:gap-5">
            <div className="flex flex-col leading-tight">
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl tracking-tighter font-black italic text-gray-900">GLOBAL STAGE</span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black text-gray-500">Ticket Exchange</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => document.getElementById("dates")?.scrollIntoView({ behavior: "smooth" })} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#026CDF] text-white hover:bg-[#0047B3] rounded-lg text-[10px] sm:text-xs tracking-[0.3em] uppercase font-black transition-all touch-manipulation">
              TICKETS
            </button>
          </div>
        </nav>
        
        <HeroSection onRecentClick={() => setShowRecent(!showRecent)} />
        <RecentPurchasesSection show={showRecent} />

        <section id="dates" className="pt-4 sm:pt-8 md:pt-12 pb-16 px-4 md:px-6 max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tighter text-gray-900">GLOBAL LISTINGS</h2>
            <div className="w-20 h-1 mx-auto rounded-full bg-[#026CDF]"></div>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-10 md:mb-14 justify-center">
            {regionOrder.map(region => (
              <button 
                key={region} 
                onClick={() => setActiveRegion(region)} 
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-black tracking-widest uppercase transition-all border duration-300 touch-manipulation ${
                  activeRegion === region 
                    ? "bg-[#026CDF] text-white border-[#026CDF]" 
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#026CDF] hover:text-[#026CDF]"
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="space-y-6 sm:space-y-8">
            {filteredData.map((r, idx) => (
              <div key={idx} className="animate-in slide-in-from-bottom-8 duration-700 fade-in">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                   <span className="text-2xl sm:text-3xl md:text-4xl text-gray-700">📍</span>
                   <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tighter text-gray-900">{r.name}</h2>
                </div>
                
                <div className="space-y-4 sm:space-y-5">
                  {r.countries.map(c => (
                    <div key={c.name} className="space-y-4">
                      {c.shows.map((s, sIdx) => (
                        <ShowCard key={sIdx} show={s} onBuy={setSelectedShow} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <footer className="py-12 px-6 border-t bg-gray-900 text-white border-gray-800 text-center">
          <div className="max-w-6xl mx-auto">
            <div className="text-xl sm:text-2xl md:text-3xl tracking-tighter mb-8 font-black italic">GLOBAL STAGE TICKETS</div>
            
            <SecurityBadges />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-10 text-xs sm:text-sm tracking-[0.3em] uppercase text-gray-400">
              <div className="flex flex-col gap-4">
                <span className="font-black border-b pb-2 w-fit mx-auto border-gray-700 text-white">SUPPORT</span>
                <button onClick={() => openModal('Help Center')} className="hover:text-white transition-colors text-xs font-black">Help Center</button>
                <button onClick={() => openModal('Contact Support')} className="hover:text-white transition-colors text-xs font-black">Contact Support</button>
                <button onClick={() => openModal('Order Status')} className="hover:text-white transition-colors text-xs font-black">Order Status</button>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-black border-b pb-2 w-fit mx-auto border-gray-700 text-white">COMPANY</span>
                <button onClick={() => openModal('About Us')} className="hover:text-white transition-colors text-xs font-black">About Us</button>
                <button onClick={() => openModal('Become a Partner')} className="hover:text-white transition-colors text-xs font-black">Become a Partner</button>
                <button onClick={() => openModal('Accessibility')} className="hover:text-white transition-colors text-xs font-black">Accessibility</button>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-black border-b pb-2 w-fit mx-auto border-gray-700 text-white">POLICIES</span>
                <button onClick={() => openModal('Terms of Service')} className="hover:text-white transition-colors text-xs font-black">Terms of Service</button>
                <button onClick={() => openModal('Privacy Policy')} className="hover:text-white transition-colors text-xs font-black">Privacy Policy</button>
                <button onClick={() => openModal('Cookie Policy')} className="hover:text-white transition-colors text-xs font-black">Cookie Policy</button>
              </div>
            </div>
            
            <div className="mb-4 text-gray-400 text-xs font-black">
              <p>support@globalstage.com</p>
            </div>
            
            <div className="space-y-2 text-xs tracking-[0.2em] uppercase text-gray-500 font-black">
              <p className="font-black text-gray-400">© 2026 GLOBAL STAGE TICKETS. ALL RIGHTS RESERVED.</p>
              <p>Professional Ticket Resale Marketplace.</p>
            </div>
          </div>
        </footer>
      </div>
      {selectedShow && <CheckoutModal show={selectedShow} onClose={() => setSelectedShow(null)} />}
    </div>
  );
}
