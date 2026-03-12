import { useState } from "react";
import { type Show } from "../data/tourData";
import { PaymentPage } from "./PaymentPage";
import emailjs from '@emailjs/browser';

function formatPrice(price: number) {
  return `$${price.toLocaleString()}`;
}

function formatFullDateTime(dateStr: string, day: string) {
  if (!dateStr || !dateStr.includes(".")) return dateStr;
  const [m, d] = dateStr.split(".");
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const monthIndex = parseInt(m, 10) - 1;
  const monthName = months[monthIndex];
  const dayNum = parseInt(d, 10);
  const year = (m === "01" || m === "02") ? 2027 : 2026;
  const shortDay = day.substring(0, 3).toUpperCase();
  const time = "8:00 PM"; 
  
  return `${shortDay} • ${monthName} ${dayNum}, ${year} • ${time}`;
}

function getArtistImage(show: Show) {
  return show.imageUrl?.trim() || "https://i.scdn.co/image/ab6761610000e5eb5704a64f34fe29ff73ab56bb  ";
}

function UsdtIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/0/01/USDT_Logo.png  " 
      alt="USDT" 
      className={className}
    />
  );
}

function UsdcIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/c/ca/USD_Coin_logo_%28cropped%29.png  " 
      alt="USDC" 
      className={className}
    />
  );
}

interface CheckoutModalProps {
  show: Show;
  onClose: () => void;
  hapticNotification?: (type?: 'success' | 'error' | 'warning') => void;
}

export function CheckoutModal({ show, onClose, hapticNotification }: CheckoutModalProps) {
  const [step, setStep] = useState<"select" | "info" | "payment" | "confirmed" | "details">("select");
  const [standardQuantity, setStandardQuantity] = useState(0);
  const [vipQuantity, setVipQuantity] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [crypto, setCrypto] = useState<"USDT" | "USDC">("USDT");
  const [orderNumber, setOrderNumber] = useState("");
  const [confirmedTxId, setConfirmedTxId] = useState("");

  const standardSoldOut = show.standardSeats === 0;
  const vipSoldOut = show.vipSeats === 0; 

  const totalQuantity = standardQuantity + vipQuantity;
  const totalPrice = (show.standard * standardQuantity) + (show.vip * vipQuantity);
  const MAX_TICKETS = 4;

  const selectedTicketType = vipQuantity > 0 ? "vip" : (standardQuantity > 0 ? "standard" : "none");

  const totalUSDT = totalPrice; 
  const totalUSDC = totalPrice;

  const isEmailValid = /^[a-zA-Z0-9._%+-]+@(gmail\.com|icloud\.com|me\.com|mac\.com)$/i.test(email);
  const showEmailError = email.length > 0 && !isEmailValid;

  const handleConfirmed = async (txHash: string) => {
    const newOrderNumber = `${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000000)}`;
    setOrderNumber(newOrderNumber);
    setConfirmedTxId(txHash);

    const voucherNum = `BTS-ARIRANG-${Math.random().toString(36).toUpperCase().substring(2, 7)}`;
    
    let ticketDetailsStr = "";
    if (vipQuantity > 0) ticketDetailsStr += `VIP Package x ${vipQuantity}`;
    if (standardQuantity > 0) {
        if (ticketDetailsStr) ticketDetailsStr += ", ";
        ticketDetailsStr += `Standard x ${standardQuantity}`;
    }

    const templateParams = {
      user_name: name,
      USER_NAME: name,
      user_email: email,      
      email: email,           
      CITY_NAME: show.city,           
      SHOW_DATE: formatFullDateTime(show.date, show.day), 
      VENUE_NAME: show.venue,
      voucher_number: voucherNum,
      total_price: formatPrice(totalPrice),
      ticket_details: ticketDetailsStr,
      tx_hash: txHash,
      order_number: newOrderNumber
    };

    try {
      const response = await emailjs.send(
        'service_pebyhvi',
        'bts',
        templateParams, 
        'dntv_YRXxCnVR0vmk'
      );
      
      console.log('이메일 전송 성공:', response);
      if (response.status === 200) {
        hapticNotification?.('success');
      }
    } catch (error) {
      console.error("이메일 발송 실패:", error);
    }
    
    setStep("confirmed");
  };

  const handleQuantityChange = (type: 'standard' | 'vip', change: number) => {
    if (type === 'standard') {
        const newQuantity = standardQuantity + change;
        if (newQuantity >= 0 && (newQuantity + vipQuantity) <= MAX_TICKETS) {
            setStandardQuantity(newQuantity);
        }
    } else if (type === 'vip') {
        const newQuantity = vipQuantity + change;
        if (newQuantity >= 0 && (standardQuantity + newQuantity) <= MAX_TICKETS) {
            setVipQuantity(newQuantity);
        }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center animate-in fade-in duration-300 font-sans" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div
        className="relative w-full sm:max-w-md bg-white sm:rounded-3xl shadow-2xl h-full sm:h-[90vh] overflow-visible flex flex-col text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {step !== "details" && (
            <div className="flex items-center p-3 bg-[#050505] border-b border-gray-800 sticky top-0 z-10 shadow-lg text-white" style={{ flexShrink: 0 }}>
                <img 
                    src={getArtistImage(show)} 
                    alt="BTS World Tour" 
                    className="w-14 h-14 object-cover rounded-xl mr-3 border border-white/10" 
                    style={{ flexShrink: 0, objectPosition: 'center' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
                <div className="flex-1 min-w-0">
                    <h2 className="text-xs font-black leading-tight mb-0.5 tracking-tighter uppercase truncate">{show.city.toUpperCase()}</h2>
                    <p className="text-[9px] text-gray-400 mb-0.5 font-bold tracking-wide uppercase truncate">{formatFullDateTime(show.date, show.day)}</p>
                    <p className="text-[8px] text-gray-500 font-bold tracking-wide uppercase truncate">{show.venue}</p>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white p-2" style={{ flexShrink: 0 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50" style={{ minHeight: 0 }}>
            {step === "select" && (
                <div className="space-y-2 p-3">
                    <h3 className="text-base font-black text-gray-900 tracking-tighter uppercase mb-2">Select Tickets</h3>
                    <div className="p-2 rounded-xl border border-gray-200 bg-white flex items-center gap-2 shadow-sm">
                        <div className="flex gap-1.5">
                          <UsdtIcon />
                          <UsdcIcon />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-900 uppercase mb-0.5">Exclusive Gateway</p>
                            <p className="text-[8px] font-bold text-gray-500">Payments accepted <span className="text-red-600 underline">ONLY</span> in USDT & USDC (Solana).</p>
                        </div>
                    </div>
                    <ul className="space-y-2">
                        <li className={`p-3 rounded-xl border transition-all ${standardSoldOut ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="flex justify-between items-center">
                                <div className="flex-1 pr-2">
                                    <h4 className={`text-xs font-black uppercase mb-1 ${standardSoldOut ? 'text-gray-400' : 'text-gray-900'}`}>Standard Ticket</h4>
                                    {standardSoldOut ? (
                                        <span className="text-red-400 font-black uppercase text-xs">Sold Out</span>
                                    ) : (
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-base font-black text-gray-900">{formatPrice(show.standard)}</span>
                                        </div>
                                    )}
                                </div>
                                {!standardSoldOut && (
                                    <div className="flex items-center border-2 border-gray-100 rounded-lg bg-white">
                                        <button onClick={() => handleQuantityChange('standard', -1)} disabled={standardQuantity === 0} className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-30">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                        </button>
                                        <span className="px-2 font-black text-sm min-w-[2rem] text-center text-gray-900">{standardQuantity}</span>
                                        <button onClick={() => handleQuantityChange('standard', 1)} disabled={totalQuantity >= MAX_TICKETS} className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-30">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                        <li className={`p-1 rounded-2xl transition-all ${vipSoldOut ? 'bg-gray-100 border-gray-200' : 'bg-gradient-to-br from-amber-300 via-amber-100 to-white border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] relative overflow-hidden'}`}>
                            <div className="flex justify-between items-start relative z-10 p-2 bg-white/60 backdrop-blur-sm rounded-xl border border-amber-200/50">
                                <div className="flex-1 pr-2">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <svg className="w-3 h-3 text-amber-500 fill-current" viewBox="0 0 24 24"><path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" /></svg>
                                        <h4 className={`text-xs font-black uppercase ${vipSoldOut ? 'text-gray-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400'}`}>VIP Package</h4>
                                        <span className={`text-white text-[7px] px-1.5 py-0.5 rounded font-black uppercase ${vipSoldOut ? 'bg-gray-400' : 'bg-gradient-to-r from-amber-500 to-amber-300 shadow-sm'}`}>Premium</span>
                                    </div>
                                    {!vipSoldOut && (
                                        <div className="mt-0.5 space-y-0.5">
                                            <div className="flex items-center gap-1">
                                                <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                                                <p className="text-[8px] font-bold text-amber-700/80 uppercase tracking-wide">Best Seats</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                                                <p className="text-[8px] font-bold text-amber-700/80 uppercase tracking-wide">Soundcheck</p>
                                            </div>
                                        </div>
                                    )}
                                    {vipSoldOut ? (
                                        <span className="text-red-400 font-black uppercase text-xs">Sold Out</span>
                                    ) : (
                                        <div className="flex items-baseline gap-1 mt-1">
                                            <span className="text-base font-black text-gray-900">{formatPrice(show.vip)}</span>
                                        </div>
                                    )}
                                </div>
                                {!vipSoldOut && (
                                    <div className="flex items-center border-2 border-amber-200 rounded-lg bg-white shadow-sm">
                                        <button onClick={() => handleQuantityChange('vip', -1)} disabled={vipQuantity === 0} className="p-2 text-amber-500 hover:text-amber-700 disabled:opacity-30">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                        </button>
                                        <span className="px-2 font-black text-sm min-w-[2rem] text-center text-gray-900">{vipQuantity}</span>
                                        <button onClick={() => handleQuantityChange('vip', 1)} disabled={totalQuantity >= MAX_TICKETS} className="p-2 text-amber-500 hover:text-amber-700 disabled:opacity-30">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    </ul>
                </div>
            )}

            {step === "info" && (
                <div className="space-y-2 p-3 pb-2">
                    <div className="flex items-center justify-between mb-2">
                        <button onClick={() => setStep("select")} className="text-gray-400 hover:text-gray-900 font-bold uppercase tracking-widest text-[9px] flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back
                        </button>
                        <h3 className="text-base font-black uppercase text-gray-900">Checkout</h3>
                    </div>

                    <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
                        <h4 className="font-black text-[9px] uppercase text-gray-800 mb-2">Select Currency</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setCrypto("USDT")} className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${crypto === "USDT" ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
                                <UsdtIcon className="w-4 h-4 mb-0.5" />
                                <div className="text-base font-black text-green-800">{totalUSDT.toLocaleString()}</div>
                                <div className="text-[7px] font-bold text-green-600/70 mt-0.5">1 USDT = $1.00</div>
                            </button>
                            <button onClick={() => setCrypto("USDC")} className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${crypto === "USDC" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
                                <UsdcIcon className="w-4 h-4 mb-0.5" />
                                <div className="text-base font-black text-blue-800">{totalUSDC.toLocaleString()}</div>
                                <div className="text-[7px] font-bold text-blue-600/70 mt-0.5">1 USDC = $1.00 (Solana)</div>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm space-y-2">
                        <h4 className="font-black text-[9px] uppercase text-gray-800">Delivery Information</h4>
                        <div>
                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Full Legal Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 font-bold text-gray-900 text-sm focus:outline-none focus:border-gray-900" />
                        </div>
                        <div>
                            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value.trim())} placeholder="name@gmail.com" className={`w-full px-3 py-2 rounded-xl border-2 font-bold text-gray-900 text-sm focus:outline-none ${showEmailError ? 'border-red-400' : 'border-gray-200 focus:border-gray-900'}`} />
                        </div>
                    </div>

                    <div className="bg-[#050505] text-white p-3 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl -mr-4 -mt-4"></div>
                        <h4 className="font-black text-[9px] uppercase text-gray-400 mb-2 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            Order Summary
                        </h4>
                        <div className="space-y-2 relative z-10">
                            <div className="flex justify-between items-start">
                                <span className="text-gray-400 font-bold uppercase text-[8px] tracking-wider">Tickets</span>
                                <span className="font-black text-white text-right text-sm">{selectedTicketType.toUpperCase()} x {totalQuantity}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-gray-400 font-bold uppercase text-[8px] tracking-wider">Venue</span>
                                <span className="font-bold text-white text-right text-sm line-clamp-2 break-words max-w-[60%]">{show.venue}</span>
                            </div>
                            <div className="h-px bg-white/10 my-1.5"></div>
                            <div className="flex justify-between items-end">
                                <span className="text-gray-400 font-bold uppercase text-[8px] tracking-wider">Total Amount</span>
                                <span className="font-black text-xl text-[#26A17B]">{formatPrice(totalPrice)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-gray-400 py-0.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <span className="text-[8px] font-bold uppercase tracking-widest">256-Bit Secure Checkout</span>
                    </div>
                </div>
            )}

            {step === "payment" && <PaymentPage orderInfo={{ email, name, totalPrice, show, ticketType: selectedTicketType, quantity: totalQuantity, crypto }} onBack={() => setStep("info")} onConfirmed={handleConfirmed} />}

            {step === "confirmed" && (
                <div className="p-3 text-left animate-in fade-in duration-500 flex flex-col justify-start">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#26A17B] text-white shadow-lg flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg font-black text-gray-900 tracking-tighter uppercase leading-none truncate">You're going!</h2>
                            <p className="text-gray-500 font-bold text-[9px] uppercase tracking-widest mt-0.5">Order # {orderNumber}</p>
                            <p className="text-gray-900 font-black text-xs mt-0.5 truncate">{name}</p>
                        </div>
                    </div>
                    <div className="border border-gray-200 bg-white rounded-2xl p-3 mb-3 shadow-sm">
                        <h3 className="font-black text-sm text-gray-900 uppercase tracking-tight mb-1 truncate">{show.venue}</h3>
                        <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-3">{formatFullDateTime(show.date, show.day)}</p>
                        <div className="pt-3 border-t border-gray-100">
                            <span className="font-black text-gray-900 uppercase tracking-wide text-sm">{selectedTicketType} TICKET x {totalQuantity}</span>
                        </div>
                    </div>
                    <div className="bg-gray-100/50 p-3 rounded-2xl border border-gray-200 mb-4">
                        <h4 className="font-black text-xs text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                            Check your email
                        </h4>
                        <p className="text-xs font-bold text-gray-500">Tickets dispatched to <strong className="text-gray-900 font-black border-b border-gray-300">{email}</strong></p>
                    </div>
                    <button onClick={() => setStep("details")} className="w-full py-3 rounded-xl bg-[#050505] text-white font-black text-xs tracking-[0.2em] uppercase hover:bg-gray-800 transition-all shadow-xl active:scale-95">View Order Details</button>
                </div>
            )}

            {step === "details" && (
                <div className="bg-gray-50 min-h-full flex flex-col relative">
                    <div className="flex items-center justify-between p-3 bg-white border-b border-gray-100 sticky top-0 z-20" style={{ flexShrink: 0 }}>
                        <button onClick={() => setStep("confirmed")} className="text-gray-400 hover:text-gray-900 font-black uppercase tracking-widest text-[9px] flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            BACK
                        </button>
                        <h3 className="text-[9px] font-black tracking-[0.2em] uppercase text-gray-400">OFFICIAL RECORD</h3>
                    </div>

                    <div className="flex-1 p-3 space-y-3 pb-20">
                        <div className="bg-[#050505] rounded-2xl p-3 text-white shadow-lg relative overflow-hidden">
                            <div className="flex items-center gap-3">
                                <img 
                                    src={getArtistImage(show)} 
                                    alt="BTS" 
                                    className="w-16 h-16 object-cover rounded-xl shadow-md border border-white/10" 
                                    style={{ flexShrink: 0, objectPosition: 'center' }}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[#26A17B] mb-1 block">Reservation Confirmed</span>
                                    <h2 className="text-base font-black uppercase tracking-tighter mb-0.5 leading-none truncate">{show.city}</h2>
                                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-wide truncate">{formatFullDateTime(show.date, show.day)}</p>
                                    <p className="text-[8px] text-gray-500 font-bold mt-0.5 uppercase truncate">{show.venue}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-[#26A17B] via-[#D4AF37] to-[#26A17B]"></div>
                            
                            <div className="p-3">
                                <div className="mb-3 pb-3 border-b border-dashed border-gray-200">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Ticket Holder</p>
                                    <p className="text-sm font-black text-gray-900 tracking-tight uppercase truncate">{name}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative bg-[#FFFDF5] p-3 rounded-2xl shadow-sm border-2 border-amber-400">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <svg className="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                                            <p className="text-[7px] font-black text-amber-600 uppercase tracking-widest">Type</p>
                                        </div>
                                        <p className="text-base font-black text-amber-600 uppercase tracking-tighter italic">{selectedTicketType}</p>
                                    </div>
                                    
                                    <div className="relative bg-gray-50 p-3 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                            <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Qty</p>
                                        </div>
                                        <p className="text-base font-black text-gray-900 tracking-tighter">{totalQuantity}<span className="text-xs text-gray-400 ml-1 font-bold">PCS</span></p>
                                    </div>
                                    
                                    <div className="relative bg-green-50 p-3 rounded-2xl shadow-sm border border-green-100 col-span-2">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <p className="text-[7px] font-black text-green-600/70 uppercase tracking-widest">Total Paid</p>
                                        </div>
                                        <p className="text-lg font-black text-[#26A17B] tracking-tighter">{formatPrice(totalPrice)}</p>
                                    </div>
                                    
                                    <div className={`relative p-3 rounded-2xl shadow-sm border-2 col-span-2 ${crypto === 'USDT' ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-blue-500'}`}>
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <svg className={`w-3 h-3 ${crypto === 'USDT' ? 'text-green-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                            <p className={`text-[7px] font-black uppercase tracking-widest ${crypto === 'USDT' ? 'text-green-600/70' : 'text-blue-600/70'}`}>Method</p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full shadow-sm ${crypto === "USDT" ? "bg-green-500" : "bg-blue-500"}`}></span>
                                            <p className="text-sm font-black text-gray-900">{crypto} {crypto === "USDC" && <span className="text-gray-500 text-xs font-bold">(Solana)</span>}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 px-3 py-2 border-t border-gray-100">
                                <p className="text-[7px] font-black text-gray-400 uppercase mb-1.5 flex items-center gap-1">
                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    TxID (Blockchain Receipt)
                                </p>
                                <div className="bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 shadow-inner overflow-x-auto">
                                    <p className="text-[8px] font-mono font-bold text-gray-600 break-all">{confirmedTxId}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden relative">
                            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>
                            
                            <div className="p-3 flex flex-col items-center text-center">
                                <div className="mb-2">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Mobile Ticket</p>
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Admission Pass</h3>
                                </div>

                                <div className="relative p-1.5 bg-white rounded-xl border-2 border-gray-900 shadow-inner mb-2">
                                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=  ${orderNumber}`} className="w-32 h-32 mix-blend-multiply block" />
                                </div>

                                <div className="w-full border-t border-dashed border-gray-200 pt-2.5 mb-2">
                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Ticket Holder</p>
                                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight truncate">{name}</p>
                                </div>

                                <div className="mb-2">
                                    <p className="text-lg font-mono font-black text-gray-900 tracking-[0.3em]">{orderNumber}</p>
                                </div>

                                <div className="bg-gray-50 w-full p-2 rounded-lg">
                                    <p className="text-[7px] font-bold text-gray-500 leading-tight">
                                        ⚠️ Mobile use only. No screenshots.<br/>Present QR code at gate.
                                    </p>
                                </div>
                            </div>
                            
                            
                            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>
                        </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-3 bg-white border-t border-gray-100 z-20" style={{ flexShrink: 0 }}>
                        <button onClick={onClose} className="w-full py-3 rounded-xl bg-[#050505] text-white font-black text-xs tracking-[0.2em] uppercase shadow-xl active:scale-95 transition-all">Close Official Ticket</button>
                    </div>
                </div>
            )}
        </div>

        {(step === "select" || step === "info") && (
            <div className="p-3 border-t border-gray-200 bg-white sticky bottom-0 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]" style={{ flexShrink: 0 }}>
                <div className="flex justify-between items-end mb-1.5">
                    <span className="font-black text-black text-base uppercase tracking-widest">Total ({totalQuantity})</span>
                    <span className="font-black text-xl tracking-tighter text-black leading-none">{formatPrice(totalPrice)}</span>
                </div>
                <button onClick={() => { if (step === "select") setStep("info"); else if (step === "info") setStep("payment"); }} disabled={totalQuantity === 0 || (step === "info" && (!email || !name || !isEmailValid))} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] bg-[length:200%_auto] hover:bg-right text-gray-900 font-black text-xs uppercase tracking-[0.2em] transition-all disabled:bg-none disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none shadow-[0_8px_25px_rgba(212,175,55,0.4)] active:scale-95 flex items-center justify-center gap-2">
                    {step === "select" ? "Next Step" : <><svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>Proceed to Payment</>}
                </button>
            </div>
        )}
      </div>
    </div>
  );
}