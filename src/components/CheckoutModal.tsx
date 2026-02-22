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
    return show.imageUrl || "https://i.scdn.co/image/ab6761610000e5eb5704a64f34fe29ff73ab56bb  ";
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
  const [crypto, setCrypto] = useState<"USDT" | "TRX">("USDT");
  const [orderNumber, setOrderNumber] = useState("");
  const [confirmedTxId, setConfirmedTxId] = useState("");

  const standardSoldOut = show.standardSeats === 0;
  const vipSoldOut = show.vipSeats === 0; 

  const totalQuantity = standardQuantity + vipQuantity;
  const totalPrice = (show.standard * standardQuantity) + (show.vip * vipQuantity);
  const MAX_TICKETS = 4;

  const selectedTicketType = vipQuantity > 0 ? "vip" : (standardQuantity > 0 ? "standard" : "none");

  const totalUSDT = totalPrice; 
  const totalTRX = totalPrice * 6;

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
        className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl h-[95vh] sm:h-[90vh] overflow-hidden flex flex-col text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {step !== "details" && (
            <div className="flex items-start p-6 bg-[#050505] border-b border-gray-800 sticky top-0 z-10 shadow-lg text-white shrink-0">
                <img src={getArtistImage(show)} alt="BTS World Tour" className="w-20 h-20 object-cover rounded-xl shadow-2xl mr-4 border border-white/10" />
                <div className="flex-1 mt-1">
                    <h2 className="text-lg sm:text-xl font-black leading-tight mb-1 tracking-tighter uppercase">BTS WORLD TOUR 'ARIRANG' IN {show.city.toUpperCase()}</h2>
                    <p className="text-xs text-gray-400 mb-1 font-bold tracking-wide uppercase">{formatFullDateTime(show.date, show.day)}</p>
                    <p className="text-[10px] text-gray-500 font-bold tracking-wide uppercase">{show.venue}</p>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white p-2 -mr-2 -mt-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50">
            {step === "select" && (
                // ✅ 수정: space-y-4 -> space-y-2 (전체 간격 축소)
                <div className="space-y-2 p-6">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-2">Select Tickets</h3>
                    {/* ✅ 수정: mb-6 -> mb-2 */}
                    <div className="p-4 rounded-xl border border-gray-200 bg-white flex items-center gap-4 shadow-sm mb-2">
                        <div className="flex gap-1.5 shrink-0"><img src="https://cryptologos.cc/logos/tether-usdt-logo.png  " alt="USDT" className="w-6 h-6" /><img src="https://cryptologos.cc/logos/tron-trx-logo.png  " alt="TRX" className="w-6 h-6" /></div>
                        <div><p className="text-xs font-black text-gray-900 uppercase mb-0.5">Exclusive Gateway</p><p className="text-[10px] font-bold text-gray-500">Payments accepted <span className="text-red-600 underline">ONLY</span> in USDT & TRX.</p></div>
                    </div>
                    <ul className="space-y-3">
                        <li className={`p-4 rounded-xl border transition-all ${standardSoldOut ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="flex justify-between items-center">
                                <div className="flex-1 pr-4">
                                    <h4 className={`text-base font-black uppercase mb-1 ${standardSoldOut ? 'text-gray-400' : 'text-gray-900'}`}>Standard Ticket</h4>
                                    {standardSoldOut ? <span className="text-red-400 font-black uppercase text-xs">Sold Out</span> : <div className="flex items-baseline gap-1"><span className="text-xl font-black text-gray-900">{formatPrice(show.standard)}</span></div>}
                                </div>
                                {!standardSoldOut && (
                                    <div className="flex items-center border-2 border-gray-100 rounded-lg bg-white">
                                        <button onClick={() => handleQuantityChange('standard', -1)} disabled={standardQuantity === 0} className="p-3 text-gray-400 hover:text-gray-900 disabled:opacity-30"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg></button>
                                        <span className="px-3 font-black text-lg min-w-[2.5rem] text-center text-gray-900">{standardQuantity}</span>
                                        <button onClick={() => handleQuantityChange('standard', 1)} disabled={totalQuantity >= MAX_TICKETS} className="p-3 text-gray-400 hover:text-gray-900 disabled:opacity-30"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg></button>
                                    </div>
                                )}
                            </div>
                        </li>
                        <li className={`p-1 rounded-2xl transition-all ${vipSoldOut ? 'bg-gray-100 border-gray-200' : 'bg-gradient-to-br from-amber-300 via-amber-100 to-white border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] relative overflow-hidden'}`}>
                            { !vipSoldOut && (
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                            )}
                            <div className="flex justify-between items-start relative z-10 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-amber-200/50">
                                <div className="flex-1 pr-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 24 24"><path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" /></svg>
                                        <h4 className={`text-base font-black uppercase ${vipSoldOut ? 'text-gray-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400'}`}>VIP Package</h4>
                                        <span className={`text-white text-[8px] px-2 py-0.5 rounded font-black uppercase ${vipSoldOut ? 'bg-gray-400' : 'bg-gradient-to-r from-amber-500 to-amber-300 shadow-sm'}`}>Premium</span>
                                    </div>
                                    {!vipSoldOut && (
                                        // ✅ 수정: mt-2 -> mt-1, space-y-1 유지
                                        <div className="mt-1 space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                                                <p className="text-[10px] font-bold text-amber-700/80 uppercase tracking-wide">Best Seats (First 10 Rows)</p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                                                <p className="text-[10px] font-bold text-amber-700/80 uppercase tracking-wide">Soundcheck Access</p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                                                <p className="text-[10px] font-bold text-amber-700/80 uppercase tracking-wide">Exclusive Merchandise</p>
                                            </div>
                                        </div>
                                    )}
                                    {/* ✅ 수정: mt-2 -> mt-1 */}
                                    {vipSoldOut ? <span className="text-red-400 font-black uppercase text-xs">Sold Out</span> : <div className="flex items-baseline gap-1 mt-1"><span className="text-xl font-black text-gray-900">{formatPrice(show.vip)}</span></div>}
                                </div>
                                {!vipSoldOut && (
                                    <div className="flex items-center border-2 border-amber-200 rounded-lg bg-white shadow-sm mt-1">
                                        <button onClick={() => handleQuantityChange('vip', -1)} disabled={vipQuantity === 0} className="p-3 text-amber-500 hover:text-amber-700 disabled:opacity-30"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg></button>
                                        <span className="px-3 font-black text-lg min-w-[2.5rem] text-center text-gray-900">{vipQuantity}</span>
                                        <button onClick={() => handleQuantityChange('vip', 1)} disabled={totalQuantity >= MAX_TICKETS} className="p-3 text-amber-500 hover:text-amber-700 disabled:opacity-30"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg></button>
                                    </div>
                                )}
                            </div>
                        </li>
                    </ul>
                </div>
            )}

            {step === "info" && (
                <div className="space-y-4 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <button onClick={() => setStep("select")} className="text-gray-400 hover:text-gray-900 font-bold uppercase tracking-widest text-xs flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back
                        </button>
                        <h3 className="text-xl font-black uppercase text-gray-900">Checkout</h3>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                        <h4 className="font-black text-xs uppercase text-gray-800 mb-3">Select Currency</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setCrypto("USDT")} className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${crypto === "USDT" ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
                                <img src="https://cryptologos.cc/logos/tether-usdt-logo.png  " className="w-5 h-5 mb-1" />
                                <div className="text-lg font-black text-green-800">{totalUSDT.toLocaleString()}</div>
                                <div className="text-[9px] font-bold text-green-600/70 mt-1">1 USDT = $1.00</div>
                            </button>
                            <button onClick={() => setCrypto("TRX")} className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${crypto === "TRX" ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"}`}>
                                <img src="https://cryptologos.cc/logos/tron-trx-logo.png  " className="w-5 h-5 mb-1" />
                                <div className="text-lg font-black text-red-800">{totalTRX.toLocaleString()}</div>
                                <div className="text-[9px] font-bold text-red-600/70 mt-1">1 TRX ≈ $0.16</div>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                        <h4 className="font-black text-xs uppercase text-gray-800">Delivery Information</h4>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Legal Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-900 text-base focus:outline-none focus:border-gray-900" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value.trim())} placeholder="name@gmail.com" className={`w-full px-4 py-3 rounded-xl border-2 font-bold text-gray-900 text-base focus:outline-none ${showEmailError ? 'border-red-400' : 'border-gray-200 focus:border-gray-900'}`} />
                        </div>
                    </div>

                    <div className="bg-[#050505] text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-xl -mr-5 -mt-5"></div>
                        <h4 className="font-black text-xs uppercase text-gray-400 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            Order Summary
                        </h4>
                        <div className="space-y-3 relative z-10">
                            <div className="flex justify-between items-start">
                                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mt-1">Tickets</span>
                                <span className="font-black text-white text-right">{selectedTicketType.toUpperCase()} x {totalQuantity}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mt-1">Venue</span>
                                <span className="font-bold text-white text-right line-clamp-2 break-words max-w-[60%]">
                                    {show.venue}
                                </span>
                            </div>
                            <div className="h-px bg-white/10 my-2"></div>
                            <div className="flex justify-between items-end">
                                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Total Amount</span>
                                <span className="font-black text-2xl text-[#26A17B]">{formatPrice(totalPrice)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-gray-400 py-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <span className="text-[10px] font-bold uppercase tracking-widest">256-Bit Secure Checkout</span>
                    </div>
                </div>
            )}

            {step === "payment" && <PaymentPage orderInfo={{ email, name, totalPrice, show, ticketType: selectedTicketType, quantity: totalQuantity, crypto: crypto }} onBack={() => setStep("info")} onConfirmed={handleConfirmed} />}

            {step === "confirmed" && (
                <div className="p-6 text-left animate-in fade-in duration-500 flex flex-col justify-start">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#26A17B] text-white shadow-lg shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">You're going!</h2>
                            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Order # {orderNumber}</p>
                            <p className="text-gray-900 font-black text-base mt-0.5">{name}</p>
                        </div>
                    </div>
                    <div className="border border-gray-200 bg-white rounded-2xl p-5 mb-6 shadow-sm">
                        <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight mb-1">{show.venue}</h3>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">{formatFullDateTime(show.date, show.day)}</p>
                        <div className="pt-4 border-t border-gray-100 flex flex-col gap-1">
                            <span className="font-black text-gray-900 uppercase tracking-wide text-lg">{selectedTicketType} TICKET <span className="text-gray-400 ml-1">x {totalQuantity}</span></span>
                        </div>
                    </div>
                    <div className="bg-gray-100/50 p-5 rounded-2xl border border-gray-200 mb-8">
                        <h4 className="font-black text-sm text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                            Check your email
                        </h4>
                        <p className="text-sm font-bold text-gray-500 leading-relaxed">Tickets dispatched to <strong className="text-gray-900 font-black border-b border-gray-300 pb-0.5">{email}</strong>.</p>
                    </div>
                    <button onClick={() => setStep("details")} className="w-full py-4 rounded-2xl bg-[#050505] text-white font-black text-sm tracking-[0.2em] uppercase hover:bg-gray-800 transition-all shadow-xl active:scale-95 mb-0">View Order Details</button>
                </div>
            )}

            {step === "details" && (
                <div className="bg-gray-50 h-full flex flex-col relative">
                    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 shrink-0 z-20">
                        <button onClick={() => setStep("confirmed")} className="text-gray-400 hover:text-gray-900 font-black uppercase tracking-widest text-[10px] flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            BACK
                        </button>
                        <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400">OFFICIAL RECORD</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 pb-24">
                        <div className="bg-[#050505] rounded-2xl p-4 text-white shadow-lg flex items-center gap-4 relative overflow-hidden shrink-0">
                            <img src={getArtistImage(show)} alt="Artist" className="w-20 h-20 object-cover rounded-lg shadow-md border border-white/10 z-10" />
                            <div className="flex-1 z-10">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#26A17B] mb-1 block">Reservation Confirmed</span>
                                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-0.5 leading-none">{show.city}</h2>
                                <p className="text-xs font-bold text-gray-300 uppercase tracking-wide">{formatFullDateTime(show.date, show.day)}</p>
                                <p className="text-[10px] text-gray-500 font-bold mt-0.5 uppercase truncate">{show.venue}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden shrink-0">
                            <div className="h-1.5 bg-gradient-to-r from-[#26A17B] via-[#D4AF37] to-[#26A17B]"></div>
                            
                            <div className="p-5">
                                <div className="mb-5 pb-4 border-b border-dashed border-gray-200">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Ticket Holder</p>
                                    <p className="text-lg font-black text-gray-900 tracking-tight uppercase">{name}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-2">
                                    <div className="relative bg-[#FFFDF5] p-4 rounded-2xl shadow-sm border-2 border-amber-400 group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                                            <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Type</p>
                                        </div>
                                        <p className="text-xl font-black text-amber-600 uppercase tracking-tighter italic">{selectedTicketType}</p>
                                    </div>
                                    
                                    <div className="relative bg-gray-50 p-4 rounded-2xl shadow-sm border border-gray-100 group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Qty</p>
                                        </div>
                                        <p className="text-xl font-black text-gray-900 tracking-tighter">{totalQuantity}<span className="text-xs text-gray-400 ml-0.5 font-bold">PCS</span></p>
                                    </div>
                                    
                                    <div className="relative bg-green-50 p-4 rounded-2xl shadow-sm border border-green-100 col-span-2 group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-4 h-4 text-green-600 group-hover:text-green-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <p className="text-[9px] font-black text-green-600/70 uppercase tracking-widest">Total Paid</p>
                                        </div>
                                        <p className="text-2xl font-black text-[#26A17B] tracking-tighter">{formatPrice(totalPrice)}</p>
                                    </div>
                                    
                                    <div className={`relative p-4 rounded-2xl shadow-sm border-2 col-span-2 group ${crypto === 'USDT' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className={`w-4 h-4 ${crypto === 'USDT' ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                            <p className={`text-[9px] font-black uppercase tracking-widest ${crypto === 'USDT' ? 'text-green-600/70' : 'text-red-600/70'}`}>Method</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`w-3 h-3 rounded-full shadow-sm ${crypto === "USDT" ? "bg-green-500" : "bg-red-500"}`}></span>
                                            <p className="text-lg font-black text-gray-900">{crypto}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                                <p className="text-[9px] font-black text-gray-400 uppercase mb-1.5 flex items-center gap-1.5">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    TxID (Blockchain Receipt)
                                </p>
                                <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-inner overflow-x-auto">
                                    <p className="text-[10px] font-mono font-bold text-gray-600 break-all">{confirmedTxId}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden shrink-0 relative">
                            <div className="h-1 w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>
                            
                            <div className="p-6 flex flex-col items-center text-center">
                                <div className="mb-3">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Mobile Ticket</p>
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Admission Pass</h3>
                                </div>

                                <div className="relative p-2 bg-white rounded-xl border-2 border-gray-900 shadow-inner mb-4">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${orderNumber}`} className="w-40 h-40 mix-blend-multiply block" />
                                </div>

                                <div className="w-full border-t border-dashed border-gray-200 pt-3 mb-3">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ticket Holder</p>
                                    <p className="text-lg font-black text-gray-900 uppercase tracking-tight">{name}</p>
                                </div>

                                <div className="mb-3">
                                    <p className="text-2xl font-mono font-black text-gray-900 tracking-[0.3em]">{orderNumber}</p>
                                </div>

                                <div className="bg-gray-50 w-full p-2.5 rounded-lg mt-1">
                                    <p className="text-[9px] font-bold text-gray-500 leading-tight">
                                        ⚠️ This ticket is for mobile use only. Screenshots are not valid for entry.<br/>
                                        Please present the QR code directly at the gate.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="h-1 w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>
                        </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 z-20">
                        <button onClick={onClose} className="w-full py-4 rounded-xl bg-[#050505] text-white font-black text-sm tracking-[0.2em] uppercase shadow-xl active:scale-95 transition-all">Close Official Ticket</button>
                    </div>
                </div>
            )}
        </div>

        {(step === "select" || step === "info") && (
            // ✅ 수정: p-6 -> p-4 (패딩 축소)
            <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] shrink-0">
                {/* ✅ 수정: mb-4 -> mb-2 */}
                <div className="flex justify-between items-end mb-2">
                    <span className="font-black text-black text-xl uppercase tracking-widest">Total <span className="ml-1 text-gray-900">({totalQuantity})</span></span>
                    <span className="font-black text-3xl tracking-tighter text-black leading-none">{formatPrice(totalPrice)}</span>
                </div>
                <button onClick={() => { if (step === "select") setStep("info"); else if (step === "info") setStep("payment"); }} disabled={totalQuantity === 0 || (step === "info" && (!email || !name || !isEmailValid))} className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] bg-[length:200%_auto] hover:bg-right text-gray-900 font-black text-base uppercase tracking-[0.2em] transition-all disabled:bg-none disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none shadow-[0_8px_25px_rgba(212,175,55,0.4)] active:scale-95 flex items-center justify-center gap-2">
                    {step === "select" ? "Next Step" : <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>Proceed to Payment</>}
                </button>
            </div>
        )}
      </div>
    </div>
  );
}