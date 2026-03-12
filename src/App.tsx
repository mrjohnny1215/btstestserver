import { useState, useEffect, useMemo } from "react";
import { tourData, type Region, type Show } from "./data/tourData";
import { CheckoutModal } from "./components/CheckoutModal";
import { VideoBackground } from "./components/VideoBackground";

const UsdtIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#26A17B"/>
    <rect x="9" y="7" width="14" height="4" fill="white"/>
    <rect x="14" y="11" width="4" height="14" fill="white"/>
    <ellipse cx="16" cy="18" rx="10" ry="3" stroke="white" strokeWidth="2" fill="none"/>
  </svg>
);

const UsdcIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm"></div>
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/c/ca/USD_Coin_logo_%28cropped%29.png  " 
      alt="USDC" 
      className="relative w-full h-full object-contain drop-shadow-lg"
    />
  </div>
);

const LEGAL_PAGES = {
  SUPPORT: { 
    title: "Global Customer Support", 
    subtitle: "Help Center & Inquiry",
    content: "Our dedicated global support team is available 24/7 to assist with ticket verification, secure payment processing, and stadium entry protocols.\n\nShould you encounter any technical difficulties during the booking process, please verify your network stability. For immediate assistance, our automated support system, integrated within the HYBE ecosystem, provides real-time solutions to ensure a seamless experience for fans worldwide." 
  },
  RESALE: { 
    title: "Official Resale Policy", 
    subtitle: "Protecting Our Fans",
    content: "To maintain a fair and secure ticketing environment, all tickets for the 'Arirang World Tour' are exclusively digital and protected by dynamic QR code encryption.\n\nAny unauthorized resale attempts, including listings on third-party auction platforms, are strictly prohibited. Tickets identified as traded outside official channels will be immediately voided, and entry to the venue will be denied without exception or refund." 
  },
  TERMS: { 
    title: "Terms and Conditions", 
    subtitle: "Ticketing Agreement",
    content: "By proceeding with your booking, you acknowledge and agree to the BIGHIT MUSIC global terms of service. Each individual is permitted to purchase a maximum of 4 tickets per performance.\n\nThe use of automated scripts, bot technology, or any unauthorized means to secure inventory will result in the permanent termination of your account and potential legal action under international digital commerce regulations." 
  },
  PRIVACY: { 
    title: "Privacy and Security", 
    subtitle: "Data Protection Notice",
    content: "Your privacy and data security are our utmost priority. We employ industry-standard SSL encryption and decentralized data storage to safeguard your personal information.\n\nAll data collected during the booking process is utilized exclusively for ticket generation and venue safety compliance. We strictly prohibit the sale or sharing of fan data with any third-party marketing entities." 
  },
  ABOUT: { 
    title: "About Arirang World Tour", 
    subtitle: "A Historic Global Milestone",
    content: "The 'Arirang World Tour' signifies the definitive return of BTS to the global stage. Spanning five continents, this exclusive stadium residency combines cutting-edge stage production with an immersive musical narrative.\n\nManaged jointly by BIGHIT MUSIC and HYBE, this tour establishes a new benchmark for live entertainment and global fan connectivity." 
  }
};

function formatPrice(price: number) { return `$${price.toLocaleString()}`; }

function formatFullDateWithDay(dateStr: string, dayStr: string) {
  if (!dateStr || !dateStr.includes(".")) return dateStr;
  const [m, d] = dateStr.split(".");
  const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  const monthIndex = parseInt(m, 10) - 1;
  const day = parseInt(d, 10);
  const year = (m === "01" || m === "02") ? 2027 : 2026;
  return `${months[monthIndex]} ${day}, ${year} ${dayStr.toUpperCase()}`;
}

function TourStats() {
  const stats = [{ label: "SHOWS", value: "45" }, { label: "CITIES", value: "28" }, { label: "COUNTRIES", value: "14" }, { label: "CONTINENTS", value: "5" }];
  return (
    <div className="grid grid-cols-2 gap-2 px-4 md:px-6 mb-2 max-w-md mx-auto relative z-30 font-bold">
      {stats.map((s, i) => (
        <div key={i} className="p-2 md:p-3 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl text-center flex flex-col items-center justify-center shadow-2xl h-16 md:h-24">
          <span className="text-xl md:text-3xl font-black text-white mb-1">{s.value}</span>
          <span className="text-[8px] md:text-[9px] font-black text-purple-300 tracking-[0.2em] uppercase">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function HeroSection({ onScrollToDates }: { onScrollToDates: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center pt-24 sm:pt-28 md:pt-32 pb-4 md:pb-8 overflow-hidden px-4 md:px-6 z-10 text-center">
      <div className="relative z-30 max-w-md w-full flex flex-col items-center">
        <div className="mb-2 md:mb-3 px-3 md:px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
          <span className="text-white/90 font-black tracking-[0.3em] md:tracking-[0.4em] text-[9px] md:text-[11px] uppercase drop-shadow-lg">Official Booking Portal • 2026-2027</span>
        </div>
        
        <h1 className="text-[18vw] sm:text-[20vw] md:text-[14rem] font-black text-white tracking-tighter leading-[0.75] mb-1 md:mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] max-w-full">BTS</h1>
        
        <h2 className="text-[8vw] sm:text-[9vw] md:text-[5rem] font-black tracking-tighter mb-3 md:mb-6 bg-gradient-to-r from-purple-300 via-white to-emerald-300 bg-clip-text text-transparent uppercase leading-tight drop-shadow-[0_0_20px_rgba(168,85,247,0.5)] max-w-full">Arirang World Tour</h2>
        
        <div className="inline-flex items-center justify-center gap-2 md:gap-4 px-4 md:px-8 py-1.5 md:py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl mb-3 md:mb-8 hover:bg-white/20 transition-all duration-300">
          <span className="text-lg md:text-4xl font-black tracking-[0.2em] text-white drop-shadow-md">2026</span>
          <span className="text-sm md:text-xl text-white/50 font-light">~</span>
          <span className="text-lg md:text-4xl font-black tracking-[0.2em] text-white drop-shadow-md">2027</span>
        </div>

        <div className="space-y-1.5 md:space-y-3 mb-4 md:mb-10 text-center font-black uppercase tracking-widest px-2">
           <p className="text-[10px] md:text-base text-white leading-relaxed drop-shadow-md">BIGHIT MUSIC AND HYBE ARE PROUD TO ANNOUNCE THE LONG-AWAITED RETURN OF BTS.</p>
           <p className="text-[8px] md:text-sm text-white/80 leading-relaxed drop-shadow-sm">THIS COMPREHENSIVE GLOBAL STADIUM TOUR REPRESENTS A NEW CHAPTER IN THE 'ARIRANG' SERIES.</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 md:gap-4 w-full">
          <button 
            onClick={onScrollToDates} 
            className="w-full h-[50px] md:h-[60px] bg-white text-black font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_60px_rgba(255,255,255,0.6)] uppercase text-base md:text-lg tracking-[0.2em] relative overflow-hidden group flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative">Get Tickets</span>
          </button>
          
          <div className="w-full h-[45px] md:h-[60px] flex items-center justify-center gap-2 md:gap-3 rounded-full border border-emerald-500/50 bg-emerald-900/40 backdrop-blur-md hover:bg-emerald-900/60 transition-all cursor-default group shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <div className="relative flex h-2.5 w-2.5 md:h-3 md:w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
            </div>
            <span className="text-[10px] md:text-sm md:text-base font-black tracking-[0.25em] text-emerald-300 uppercase group-hover:text-emerald-200 drop-shadow-md">Inventory Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShowCard({ show, onBuy, countryCode }: { show: Show; onBuy: (show: Show) => void; countryCode: string }) {
  const isKoreaOrJapan = countryCode === "KR" || countryCode === "JP";
  const [m] = show.date.split(".");
  const monthNum = parseInt(m, 10);
  const isFutureShow = monthNum >= 10 || monthNum <= 2; 
  const isSoldOut = isKoreaOrJapan || show.soldOut;
  const randomVIPLeft = useMemo(() => Math.floor(Math.random() * (20 - 15 + 1)) + 15, []);
  
  const isStandardSoldOut = true;
  
  return (
    <div className="p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-white/10 bg-white/5 mb-3 md:mb-4 shadow-2xl backdrop-blur-sm hover:bg-white/[0.08] transition-all group">
      <div className="mb-3 md:mb-4 text-purple-300 font-black text-xs md:text-sm lg:text-xl uppercase tracking-[0.2em]">{formatFullDateWithDay(show.date, show.day)}</div>
      <div className="font-black text-lg md:text-2xl lg:text-4xl uppercase tracking-tighter mb-4 md:mb-6 text-left leading-none text-white group-hover:text-purple-200 transition-colors">{show.address.toUpperCase()}</div>
      {isFutureShow ? (
        <div className="py-4 md:py-6 px-3 md:px-4 rounded-2xl border border-white/5 bg-black/40 text-center flex flex-col items-center justify-center">
          <span className="text-white/30 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-2 italic">Official Announcement</span>
          <span className="text-white/60 text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em]">STAY TUNED: ANNOUNCEMENT PENDING</span>
        </div>
      ) : isSoldOut ? (
        <div className="flex items-center justify-between gap-3 md:gap-4">
           <div className="flex gap-4 md:gap-6 text-left">
             <div className="flex flex-col gap-1">
               <span className="text-white/30 text-[9px] md:text-[10px] uppercase tracking-widest font-black">STD</span>
               <span className="text-red-500 font-black text-xs md:text-sm line-through">{formatPrice(show.standard)}</span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-white/30 text-[9px] md:text-[10px] uppercase tracking-widest font-black">VIP</span>
               <span className="text-red-500 font-black text-xs md:text-sm line-through">{formatPrice(show.vip)}</span>
             </div>
           </div>
           <button className="px-4 md:px-6 py-2 md:py-3 rounded-2xl bg-red-900/20 text-red-500/50 border border-red-900/30 text-[10px] md:text-xs font-black uppercase cursor-not-allowed">Sold Out</button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-3 md:gap-4 text-left">
            <div className="flex flex-col gap-1">
              <span className="text-white/30 text-[9px] md:text-[10px] uppercase tracking-widest font-black">STD</span>
              <span className="text-red-500 font-black text-xs md:text-sm line-through">{formatPrice(show.standard)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-white/30 text-[9px] md:text-[10px] uppercase tracking-widest font-black">VIP</span>
              <span className="text-amber-400 font-black text-base md:text-lg">{formatPrice(show.vip)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end leading-tight text-right hidden md:flex">
              <span className="text-red-500 font-black text-[10px] md:text-xs animate-pulse">LIMITED</span>
              <span className="text-white/40 text-[9px] md:text-[10px] font-black uppercase">{randomVIPLeft} LEFT</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onBuy(show); }} className="px-4 md:px-6 py-2 md:py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] md:text-xs font-black uppercase shadow-lg hover:scale-105 active:scale-95 transition-all whitespace-nowrap">Get Tickets</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function App() {
  const [activeRegion, setActiveRegion] = useState("ALL");
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [selectedFlag, setSelectedFlag] = useState<string | null>(null);
  const [activeLegal, setActiveLegal] = useState<keyof typeof LEGAL_PAGES | null>(null);
  
  const hapticNotification = () => {};
  
  const filteredData = activeRegion === "ALL" ? tourData : tourData.filter(r => r.name === activeRegion);
  const closeLegal = () => { setActiveLegal(null); window.scrollTo(0, 0); };

  return (
    <div className="min-h-screen text-white bg-[#030014] relative overflow-x-hidden font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <VideoBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030014]/40 via-purple-900/10 to-[#030014]" />
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-purple-600/10 blur-[120px] md:blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/10 blur-[120px] md:blur-[150px] rounded-full" />
      </div>
      
      {activeLegal && (
        <div className="fixed inset-0 z-[300] bg-[#030014] overflow-y-auto animate-in fade-in duration-500">
          <nav className="sticky top-0 z-[310] bg-black/80 backdrop-blur-2xl border-b border-white/5 p-4 md:p-6 flex items-center justify-between font-bold">
            <div className="text-lg md:text-xl tracking-[0.3em] font-black italic">BTS</div>
            <button onClick={closeLegal} className="px-4 md:px-6 py-2 rounded-full border border-white/20 text-[9px] md:text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">Back to Booking</button>
          </nav>
          <div className="max-w-3xl mx-auto px-6 md:px-8 py-16 md:py-20">
            <span className="text-purple-400 text-[9px] md:text-[10px] font-black tracking-[0.4em] uppercase mb-4 block">{LEGAL_PAGES[activeLegal].subtitle}</span>
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-black tracking-tight mb-8 md:mb-12 uppercase">{LEGAL_PAGES[activeLegal].title}</h1>
            <div className="h-[1px] w-16 md:w-20 bg-purple-500/40 mb-8 md:mb-12" />
            <div className="space-y-4 md:space-y-6 mb-16 md:mb-20">
              {LEGAL_PAGES[activeLegal].content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-base md:text-lg lg:text-xl text-white/70 leading-relaxed font-medium whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="p-8 md:p-10 rounded-[32px] md:rounded-[40px] bg-white/5 border border-white/10 text-center shadow-2xl">
              <p className="text-white/20 text-[9px] md:text-[10px] uppercase tracking-widest font-black">Official Document Verified by BIGHIT MUSIC Legal Team</p>
            </div>
          </div>
        </div>
      )}

      <div className={`relative z-50 transition-all duration-700 ${activeLegal ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/40 backdrop-blur-xl border-b border-white/5 py-4 md:py-6 px-4 md:px-10 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-5">
            <span className="text-2xl md:text-3xl lg:text-4xl tracking-tighter font-black italic text-white drop-shadow-lg">BTS</span>
            <div className="w-[1px] md:w-[1.5px] h-6 md:h-8 lg:h-10 bg-white/20" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm md:text-xl lg:text-3xl tracking-[0.15em] md:tracking-[0.2em] uppercase font-black text-white drop-shadow-lg">ARIRANG WORLD TOUR</span>
              <span className="text-[9px] md:text-xl text-white/60 uppercase tracking-[0.1em] md:tracking-[0.15em] font-bold">2026 ~ 2027</span>
            </div>
          </div>
          <button onClick={() => document.getElementById("dates")?.scrollIntoView({ behavior: "smooth" })} className="px-4 md:px-8 py-2 md:py-2.5 rounded-full border border-white/10 bg-white/5 text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all font-black">Tickets</button>
        </nav>
        
        <HeroSection onScrollToDates={() => document.getElementById("dates")?.scrollIntoView({ behavior: "smooth" })} />
        
        <div className="max-w-md mx-auto w-full px-4 md:px-6 mb-3 md:mb-4 relative z-30 flex flex-col items-center">
          <span className="text-[9px] md:text-xs font-black text-indigo-300/60 uppercase tracking-[0.4em] mb-3 md:mb-4 text-center italic">Exclusive Payment Gateway</span>
          <div className="flex flex-nowrap justify-center items-center gap-2 md:gap-3 w-full">
            
            <div className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 md:py-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_25px_rgba(16,185,129,0.1)] transition-all hover:border-emerald-500/40">
              <UsdtIcon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[9px] md:text-[11px] font-black text-white tracking-widest uppercase whitespace-nowrap">USDT <span className="text-emerald-400 font-normal text-[8px] md:text-[9px]">(TRC-20)</span></span>
            </div>
            
            <div className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 md:py-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 shadow-[0_0_25px_rgba(59,130,246,0.1)] transition-all hover:border-blue-500/40">
              <UsdcIcon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[9px] md:text-[11px] font-black text-white tracking-widest uppercase whitespace-nowrap">USDC <span className="text-blue-400 font-normal text-[8px] md:text-[9px]">(Solana)</span></span>
            </div>
            
          </div>
        </div>

        <TourStats />

        <section id="dates" className="pt-2 md:pt-4 pb-0 px-3 md:px-4 max-w-6xl mx-auto">
          <div className="text-center mb-6 md:mb-8 uppercase">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-3 md:mb-4 tracking-tighter text-white drop-shadow-lg">Global Tour</h2>
            <div className="inline-flex items-center gap-3 md:gap-4 px-6 md:px-10 py-2 md:py-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-black uppercase text-[9px] md:text-[10px] tracking-[0.4em] animate-pulse">Official Ticketing Active</div>
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8 justify-center px-3 md:px-4">
            {["ALL", ...tourData.map(r => r.name)].map(region => (
              <button key={region} onClick={() => setActiveRegion(region)} className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black tracking-widest uppercase transition-all border ${activeRegion === region ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]" : "bg-white/5 text-white/40 border-white/10 hover:border-white/30"}`}>{region}</button>
            ))}
          </div>

          {filteredData.map((r, idx) => (
            <div key={idx} className="relative z-30 mb-6 md:mb-8 animate-in slide-in-from-bottom-5 duration-700">
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-black bg-gradient-to-r from-purple-300 via-white to-indigo-300 bg-clip-text text-transparent uppercase tracking-tighter mb-3 md:mb-4 px-3 md:px-4 italic leading-none drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                {r.name.includes("&") ? (
                  <>
                    {r.name.split("&")[0].trim().toUpperCase()} <br />
                    <span className="text-2xl md:text-4xl lg:text-6xl block mt-2">& {r.name.split("&")[1].trim().toUpperCase()}</span>
                  </>
                ) : (
                  r.name.toUpperCase()
                )}
              </h2>
              {r.countries.map(c => (
                <div key={c.name} className="mb-6 md:mb-8 px-3 md:px-4">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="flex gap-1.5 md:gap-2 shrink-0">{c.flag.split(',').map((url, i) => <img key={i} src={url.trim()} className="w-6 h-4 md:w-8 md:h-5 object-cover rounded shadow-lg border border-white/10" alt="flag" />)}</div>
                    <h3 className="text-lg md:text-xl lg:text-3xl font-black text-white uppercase tracking-tighter italic drop-shadow-md">{c.name === "EUROPEAN HUB" ? "EUROPE" : c.name.toUpperCase()}</h3>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-white/20 to-transparent ml-3 md:ml-4" />
                  </div>
                  <div className="flex flex-col gap-3 md:gap-4">
                    {c.shows.map((s, idx) => <ShowCard key={idx} show={s} countryCode={c.name.toUpperCase().includes("KOREA") ? "KR" : c.name.toUpperCase().includes("JAPAN") ? "JP" : "US"} onBuy={(show) => { setSelectedShow(show); setSelectedFlag(c.flag); }} />)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </section>
        
        <footer className="py-6 md:py-8 px-6 md:px-10 border-t border-white/5 bg-black/80 relative z-30 text-center">
          <div className="max-w-5xl mx-auto flex flex-col items-center">
            <div className="text-3xl md:text-4xl tracking-tighter mb-3 md:mb-4 opacity-90 font-black italic text-white drop-shadow-lg">BTS</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8 text-[9px] md:text-[11px] tracking-[0.4em] uppercase text-white/60">
              <div className="flex flex-col gap-4 md:gap-5"><span className="text-white font-black border-b border-white/10 pb-1.5 md:pb-2 w-fit mx-auto md:mx-0">TICKETING</span><button onClick={() => setActiveLegal('SUPPORT')} className="hover:text-purple-400 transition-all text-center md:text-left">Support</button><button onClick={() => setActiveLegal('RESALE')} className="hover:text-purple-400 transition-all text-center md:text-left">Resale Policy</button></div>
              <div className="flex flex-col gap-4 md:gap-5"><span className="text-white font-black border-b border-white/10 pb-1.5 md:pb-2 w-fit mx-auto md:mx-0">LEGAL</span><button onClick={() => setActiveLegal('TERMS')} className="hover:text-purple-400 transition-all text-center md:text-left">Terms of Use</button><button onClick={() => setActiveLegal('PRIVACY')} className="hover:text-purple-400 transition-all text-center md:text-left">Privacy Policy</button></div>
              <div className="flex flex-col gap-4 md:gap-5"><span className="text-white font-black border-b border-white/10 pb-1.5 md:pb-2 w-fit mx-auto md:mx-0">HYBE</span><button onClick={() => setActiveLegal('ABOUT')} className="hover:text-purple-400 transition-all text-center md:text-left">About Us</button></div>
            </div>
            <div className="space-y-3 md:space-y-4 text-[8px] md:text-[10px] text-white/40 tracking-[0.3em] uppercase border-t border-white/5 pt-3 md:pt-4"><p>© 2026 BIGHIT MUSIC • HYBE. ALL RIGHTS RESERVED.</p></div>
          </div>
        </footer>
      </div>
      {selectedShow && <CheckoutModal show={selectedShow} countryFlag={selectedFlag || undefined} onClose={() => setSelectedShow(null)} hapticNotification={hapticNotification} />}
    </div>
  );
}