import { useState } from "react";
import { type Show } from "../data/tourData";

function UsdtIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <img src="https://upload.wikimedia.org/wikipedia/commons/0/01/USDT_Logo.png" alt="USDT" className={className} />
  );
}

function UsdcIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/USD_Coin_logo_%28cropped%29.png" alt="USDC" className={className} />
  );
}

interface CheckoutPageProps {
  show: Show;
  quantity: number;
  totalPrice: number;
  sectionName: string;
  crypto: "USDT" | "USDC";
  setCrypto: (crypto: "USDT" | "USDC") => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export function CheckoutPage({ 
  show, quantity, totalPrice, sectionName, 
  crypto, setCrypto, name, setName, email, setEmail, 
  onBack, onConfirm 
}: CheckoutPageProps) {
  
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@(gmail\.com|icloud\.com|me\.com|mac\.com)$/i.test(email);
  const canProceed = name.length > 2 && isEmailValid;

  const getSeatNumbers = () => {
    const seats = [];
    for (let i = 0; i < quantity; i++) {
      const sec = Math.floor(Math.random() * 20) + 100;
      const row = String.fromCharCode(65 + Math.floor(Math.random() * 10));
      const seat = Math.floor(Math.random() * 50) + 1;
      seats.push(`Sec ${sec}, Row ${row}, Seat ${seat}`);
    }
    return seats;
  };
  const seatNumbers = getSeatNumbers();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-black text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack} className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:text-gray-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          BACK
        </button>
        <h2 className="text-lg font-black uppercase tracking-widest">CHECKOUT</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-xl font-black uppercase leading-tight mb-1 text-gray-900">
              BTS WORLD TOUR 'ARIRANG' IN {show.city.toUpperCase()}
            </h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-1">
              {show.date.includes('.') ? (() => {
                const [m, d] = show.date.split('.');
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return `${months[parseInt(m)-1]} ${d}, 2026`;
              })() : show.date} • 8:00 PM
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase mt-1">{show.venue} - {show.address.split(',')[1].trim()}</p>
            
            <div className="mt-4 flex items-start gap-3">
               <div className="bg-blue-50 text-blue-600 p-2 rounded-lg shrink-0">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <div>
                 <p className="text-xs font-bold text-gray-900 uppercase mb-1">Ticket Information</p>
                 <p className="text-sm font-medium text-gray-600">{sectionName}</p>
                 <p className="text-[10px] text-gray-400 font-bold mt-1">All Sales Final • No Refunds</p>
               </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-5 space-y-3">
            {seatNumbers.map((seat, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                <span className="font-bold text-gray-700">Ticket {idx + 1}</span>
                <span className="font-mono font-medium text-gray-900">{seat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h4 className="text-sm font-black uppercase text-gray-900 mb-4 tracking-wider">Payment Method</h4>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setCrypto("USDT")}
              className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                crypto === "USDT" 
                  ? "border-green-500 bg-green-50 shadow-md" 
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <UsdtIcon className="w-8 h-8" />
              <span className={`text-lg font-black ${crypto === "USDT" ? "text-green-800" : "text-gray-900"}`}>
                {totalPrice.toLocaleString()}
              </span>
              <span className="text-[9px] font-bold text-center leading-tight opacity-70">
                1 USDT = $1.00<br/>(TRC-20)
              </span>
              {crypto === "USDT" && (
                <div className="absolute top-2 right-2 text-green-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                </div>
              )}
            </button>

            <button 
              onClick={() => setCrypto("USDC")}
              className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                crypto === "USDC" 
                  ? "border-blue-500 bg-blue-50 shadow-md" 
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <UsdcIcon className="w-8 h-8" />
              <span className={`text-lg font-black ${crypto === "USDC" ? "text-blue-800" : "text-gray-900"}`}>
                {totalPrice.toLocaleString()}
              </span>
              <span className="text-[9px] font-bold text-center leading-tight opacity-70">
                1 USDC = $1.00<br/>(Solana)
              </span>
              {crypto === "USDC" && (
                <div className="absolute top-2 right-2 text-blue-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <h4 className="text-sm font-black uppercase text-gray-900 tracking-wider">Delivery Information</h4>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Full Legal Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. John Doe" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 font-medium text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value.trim())} 
              placeholder="name@gmail.com" 
              className={`w-full px-4 py-3 rounded-lg border font-medium text-gray-900 focus:outline-none focus:ring-1 transition-all ${
                email.length > 0 && !isEmailValid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-black focus:ring-black'
              }`} 
            />
            {email.length > 0 && !isEmailValid && (
              <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">Please enter a valid email address.</p>
            )}
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 flex justify-between items-center">
           <div>
             <p className="text-[10px] font-bold text-gray-500 uppercase">Total Amount</p>
             <p className="text-xl font-black text-gray-900">${totalPrice.toLocaleString()}</p>
           </div>
           <div className="text-right">
             <p className="text-[10px] font-bold text-gray-500 uppercase">Quantity</p>
             <p className="text-lg font-black text-gray-900">{quantity} Tickets</p>
           </div>
        </div>

      </div>

      <div className="p-4 bg-white border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-gray-500 uppercase">Total</span>
          <span className="text-2xl font-black text-black">${totalPrice.toLocaleString()}</span>
        </div>
        <button 
          onClick={onConfirm}
          disabled={!canProceed}
          className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2 ${
            canProceed 
              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-green-500/30 active:scale-95" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          PLACE ORDER
        </button>
        <p className="text-[9px] text-center text-gray-400 font-bold mt-2 uppercase tracking-wider">
          By placing order you agree to Terms of Use
        </p>
      </div>
    </div>
  );
}