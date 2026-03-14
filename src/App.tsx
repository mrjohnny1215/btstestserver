import { useState } from "react";
import { tourData, type Region, type Show } from "./data/tourData";
import { CheckoutModal } from "./components/CheckoutModal";

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
      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider mb-0.5 text-black">
        {monthName} {dayNum}, {year} <span className="font-black">{shortDay}</span>
      </span>
    </div>
  );
}

function TourStats() {
  const stats = [
    { label: "CITIES", value: "28" }, 
    { label: "COUNTRIES", value: "14" }
  ];
  const cardBg = "bg-white border-gray-200 shadow-lg";
  const textColor = "text-black";
  const labelColor = "text-purple-600";

  return (
    <div className="grid grid-cols-2 gap-3 px-4 md:px-6 mb-6 max-w-4xl mx-auto relative z-30 w-full">
      {stats.map((s, i) => (
        <div key={i} className={`p-4 rounded-2xl backdrop-blur-xl text-center flex flex-col items-center justify-center transition-colors duration-300 ${cardBg}`}>
          <span className={`text-3xl md:text-4xl font-black mb-1 ${textColor}`}>{s.value}</span>
          <span className={`text-[10px] md:text-xs font-black tracking-[0.2em] uppercase ${labelColor}`}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function HeroSection({ onScrollToDates }: { onScrollToDates: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center pt-24 sm:pt-28 md:pt-32 pb-8 overflow-hidden px-4 md:px-6 z-10 text-center w-full">
      <div className="relative z-30 max-w-md w-full flex flex-col items-center">
        <h1 className="text-[15vw] sm:text-[18vw] md:text-[12rem] font-black tracking-tighter leading-[0.75] mb-2 max-w-full text-black drop-shadow-sm">BTS</h1>
        <h2 className="text-[7vw] sm:text-[8vw] md:text-[4rem] font-black tracking-tighter mb-3 uppercase leading-tight max-w-full text-black">ARIRANG WORLD TOUR</h2>
        <div className="text-base sm:text-2xl md:text-3xl font-black tracking-[0.2em] drop-shadow-md mb-4 md:mb-8 text-black">2026 <span className="mx-2">~</span> 2027</div>
        
        <div className="w-full mb-6 p-3 rounded-2xl border border-emerald-200 bg-emerald-50 flex flex-col items-center justify-center gap-2 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
              💎 Crypto Payment Only 💎
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-100">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/01/USDT_Logo.png" alt="USDT" className="w-4 h-4" />
              <span className="text-[10px] font-bold text-gray-800">USDT</span>
            </div>
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-100">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/USD_Coin_logo_%28cropped%29.png" alt="USDC" className="w-4 h-4" />
              <span className="text-[10px] font-bold text-gray-800">USDC</span>
            </div>
          </div>
          <p className="text-[9px] sm:text-[10px] font-bold leading-tight text-center max-w-[95%] text-emerald-600/80">
            We accept ONLY Tether (TRC-20) & USD Coin (Solana).<br/>No credit cards or fiat currency.
          </p>
        </div>

        <div className="space-y-2 md:space-y-3 mb-6 md:mb-10 text-center font-black uppercase tracking-widest px-2 w-full">
           <p className="text-[10px] sm:text-sm leading-relaxed drop-shadow-sm text-gray-600">SECURE YOUR SEATS THROUGH THE TRUSTED THIRD-PARTY MARKETPLACE.</p>
           <p className="text-[8px] sm:text-xs leading-relaxed drop-shadow-sm text-gray-500">100% VERIFIED TICKETS • INSTANT DIGITAL DELIVERY • BUYER PROTECTION GUARANTEE.</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 md:gap-4 w-full">
          <button 
            onClick={onScrollToDates} 
            className="w-full h-[50px] sm:h-[60px] text-white font-black rounded-full hover:scale-105 active:scale-95 transition-all uppercase text-base sm:text-lg tracking-[0.2em] relative overflow-hidden group flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_10px_20px_rgba(147,51,234,0.3)] touch-manipulation"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative">Find Tickets</span>
          </button>
          <div className="w-full h-[50px] sm:h-[60px] flex items-center justify-center gap-2 sm:gap-3 rounded-full border backdrop-blur-md transition-all cursor-default group border-emerald-500/30 bg-emerald-50 shadow-[0_4px_10px_rgba(16,185,129,0.1)]">
            <div className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
            </div>
            <span className="text-[10px] sm:text-sm font-black tracking-[0.25em] uppercase drop-shadow-md text-emerald-700">INVENTORY VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShowCard({ show, onBuy }: { show: Show; onBuy: (show: Show) => void }) {
  const isStandardAvailable = show.standardSeats > 0;
  const isVipAvailable = show.vipSeats > 0 && !show.soldOut;
  
  const isStayTuned = show.isTBA || show.standard === 0;

  const cardBg = "bg-white border-gray-100 hover:border-purple-300 hover:bg-white shadow-md hover:shadow-xl";
  const cityColor = "text-black";
  const venueColor = "text-gray-500";

  const getCityDisplayName = () => {
    const city = show.city.toUpperCase();
    const addressParts = show.address.split(", ");
    
    if (addressParts.length > 1) {
      const suffix = addressParts[addressParts.length - 1].trim();
      return `${city}, ${suffix}`;
    }
    return city;
  };

  return (
    <div className={`group p-4 sm:p-5 md:p-6 rounded-3xl border transition-all duration-300 backdrop-blur-sm relative overflow-hidden ${cardBg}`}>
      
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex-1 min-w-0">
          {formatFullDate(show.date, show.day)}
          <h3 className={`text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tight mt-1 truncate transition-colors duration-300 ${cityColor}`}>
            {getCityDisplayName()}
          </h3>
          
          {!isStayTuned && (
            <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wide mt-0.5 sm:hidden truncate transition-colors duration-300 ${venueColor}`}>
               {show.venue}
            </p>
          )}
        </div>

        {/* ✅ [수정 시작] 가격 영역 레이아웃 및 스타일 변경 */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-10 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
          
          {isStayTuned ? (
            <div className="flex flex-col items-center justify-center py-2 w-full sm:w-auto">
               <span className="text-xl sm:text-2xl md:text-3xl font-black text-black uppercase tracking-widest drop-shadow-sm text-center">
                 STAY TUNED
               </span>
            </div>
          ) : (
            <>
              {/* STANDARD 섹션 */}
              <div className="flex flex-col items-start sm:items-end">
                {/* ✅ [수정 3] 폰트 크기 증가 (text-[10px] -> text-xs) */}
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider mb-1 text-gray-900">STANDARD</span>
                {isStandardAvailable ? (
                  // ✅ [수정 1] 가격 뒤에 물결표 (~) 추가
                  <span className="text-base sm:text-xl font-black drop-shadow-sm text-emerald-600 leading-none">
                    {formatPrice(show.standard)}~
                  </span>
                ) : (
                  <span className="text-base sm:text-xl font-black text-red-500 tracking-tight leading-none">
                    SOLD OUT
                  </span>
                )}
              </div>

              {/* VIP 섹션 */}
              <div className="flex flex-col items-center sm:items-end">
                {/* ✅ [수정 3] 폰트 크기 증가 */}
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider mb-1 text-gray-900 text-center sm:text-right">VIP</span>
                {/* ✅ [수정 2] UNAVAILABLE 을 중앙에 배치 (세로 정렬) */}
                {isVipAvailable ? (
                  <span className="text-base sm:text-xl font-black drop-shadow-sm text-amber-600 leading-none">
                    {formatPrice(show.vip)}~
                  </span>
                ) : (
                  <span className="text-sm sm:text-xl font-black text-red-500 uppercase tracking-tight leading-none text-center sm:text-right">
                    UNAVAILABLE
                  </span>
                )}
              </div>
            </>
          )}
          {/* ✅ [수정 끝] */}

          <div className="shrink-0">
            {!isStayTuned ? (
              <button 
                onClick={() => onBuy(show)} 
                disabled={!isStandardAvailable}
                className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-full font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.15em] transition-all shadow-lg flex items-center gap-1 sm:gap-2 whitespace-nowrap touch-manipulation ${
                  isStandardAvailable 
                    ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white hover:shadow-[0_10px_20px_rgba(79,70,229,0.4)] active:scale-95" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                }`}
              >
                GET TICKETS
                {isStandardAvailable && (
                   <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                )}
              </button>
            ) : (
              <div className="w-0"></div> 
            )}
          </div>
        </div>
      </div>
      
      {!isStayTuned && (
        <div className="hidden sm:block mt-3 pt-3 border-t border-gray-100">
           <p className="text-[10px] font-bold uppercase tracking-wide truncate text-gray-500">{show.venue}</p>
        </div>
      )}
    </div>
  );
}

export function App() {
  const [activeRegion, setActiveRegion] = useState("ALL");
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  
  const filteredData = activeRegion === "ALL" ? tourData : tourData.filter(r => r.name === activeRegion);

  const bgClass = "bg-[#f8f9fa] selection:bg-purple-200 selection:text-purple-900";
  const navClass = "bg-white/80 border-gray-200";
  const navTextClass = "text-black"; 
  const navSubTextClass = "text-gray-500";
  const navButtonClass = "border-gray-200 bg-gray-100 text-black hover:bg-black hover:text-white";
  const regionBtnActiveClass = "bg-black text-white border-black shadow-[0_4px_15px_rgba(0,0,0,0.3)]";
  const regionBtnInactiveClass = "bg-white text-black border-gray-200 hover:border-black hover:text-black hover:bg-gray-50";
  const footerBgClass = "bg-white/50 border-gray-200";
  const footerTextClass = "text-gray-500";
  const footerSubTextClass = "text-gray-400";

  return (
    <div className={`min-h-screen relative overflow-x-hidden font-sans transition-colors duration-500 ${bgClass}`}>
      <div className="relative z-50">
        <nav className={`fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b py-4 sm:py-6 px-4 md:px-10 flex justify-between items-center transition-colors duration-500 ${navClass} safe-top`}>
          <div className="flex items-center gap-3 md:gap-5">
            <div className="flex flex-col leading-tight">
              <span className={`text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-tighter font-black italic drop-shadow-lg transition-colors duration-300 ${navTextClass}`}>GLOBAL STAGE</span>
              <span className={`text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-bold transition-colors duration-300 ${navSubTextClass}`}>Ticket Exchange</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => document.getElementById("dates")?.scrollIntoView({ behavior: "smooth" })} className={`px-3 sm:px-4 md:px-8 py-2 sm:py-2.5 rounded-full text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-black transition-all duration-300 touch-manipulation ${navButtonClass}`}>
              Tickets
            </button>
          </div>
        </nav>
        
        <HeroSection onScrollToDates={() => document.getElementById("dates")?.scrollIntoView({ behavior: "smooth" })} />
        <TourStats />

        <section id="dates" className="pt-4 sm:pt-8 md:pt-12 pb-12 px-4 md:px-6 max-w-5xl mx-auto relative z-30 w-full">
          <div className="text-center mb-8 md:mb-12 uppercase">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tighter text-black">Global Listings</h2>
            <div className="w-24 h-1 mx-auto rounded-full bg-black"></div>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 md:mb-12 justify-center">
            {["ALL", ...tourData.map(r => r.name)].map(region => (
              <button 
                key={region} 
                onClick={() => setActiveRegion(region)} 
                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-widest uppercase transition-all border backdrop-blur-md duration-300 touch-manipulation ${
                  activeRegion === region ? regionBtnActiveClass : regionBtnInactiveClass
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {filteredData.map((r, idx) => (
              <div key={idx} className="relative z-30 animate-in slide-in-from-bottom-8 duration-700 fade-in">
                <div className="flex items-center gap-3 mb-4 sm:mb-6 sticky top-16 sm:top-20 z-20 py-2 backdrop-blur-md -mx-4 px-4 sm:-mx-6 sm:px-6 border-b sm:border-none sm:static sm:bg-transparent sm:p-0 sm:m-0 bg-[#f8f9fa]/90 border-gray-200">
                   <span className="text-2xl sm:text-3xl md:text-4xl drop-shadow-lg">{r.emoji}</span>
                   <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tighter text-black">{r.name}</h2>
                </div>
                
                <div className="space-y-4 sm:space-y-5 pl-0 sm:pl-4">
                  {r.countries.map(c => (
                    <div key={c.name} className="space-y-4 sm:space-y-5">
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
        
        <footer className={`py-12 px-6 border-t backdrop-blur-lg relative z-30 text-center transition-colors duration-500 ${footerBgClass}`}>
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="text-xl sm:text-2xl md:text-3xl tracking-tighter mb-8 font-black italic flex items-center gap-2 text-black">
              <span className="text-black">GLOBAL</span> STAGE TICKETS
            </div>
            
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-8 text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.3em] uppercase ${footerTextClass}`}>
              <div className="flex flex-col gap-4">
                <span className="font-bold border-b pb-2 w-fit mx-auto border-gray-200 text-black">TICKETING</span>
                <button className="hover:text-purple-600 transition-all">Support Center</button>
                <button className="hover:text-purple-600 transition-all">Resale Policy</button>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-bold border-b pb-2 w-fit mx-auto border-gray-200 text-black">LEGAL</span>
                <button className="hover:text-purple-600 transition-all">Terms of Use</button>
                <button className="hover:text-purple-600 transition-all">Privacy Policy</button>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-bold border-b pb-2 w-fit mx-auto border-gray-200 text-black">PARTNERS</span>
                <button className="hover:text-purple-600 transition-all">About Us</button>
              </div>
            </div>
            
            <div className="space-y-2 text-[7px] sm:text-[8px] md:text-[9px] tracking-[0.2em] uppercase text-gray-400">
              <p className="font-bold text-gray-600">© 2026 GLOBAL STAGE TICKETS. ALL RIGHTS RESERVED.</p>
              <p>Professional Ticket Resale Marketplace. Not affiliated with BIGHIT MUSIC or HYBE.</p>
            </div>
          </div>
        </footer>
      </div>
      {selectedShow && <CheckoutModal show={selectedShow} onClose={() => setSelectedShow(null)} />}
    </div>
  );
}