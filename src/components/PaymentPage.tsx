import { useState } from "react";
import { type Show } from "../data/tourData";

interface PaymentPageProps {
  orderInfo: {
    email: string;
    name: string;
    totalPrice: number;
    show: Show;
    ticketType: string;
    quantity: number;
    crypto: "USDT" | "XMR";
  };
  onBack: () => void;
  onConfirmed: (txHash: string) => void;
}

export function PaymentPage({ orderInfo, onBack, onConfirmed }: PaymentPageProps) {
  const [txHash, setTxHash] = useState("");
  const [timeLeft, setTimeLeft] = useState(29 * 60 + 52);

  useState(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  });

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCopy = () => {
    const address = orderInfo.crypto === "USDT" 
      ? "TQn9Y2khSsTFC8gcqW5w3j7k8s9d0f1g2h" 
      : "GMS1u1czi2TBJwwGefFP2XeiUVPNYbKbrtaxUGvgtUs2";
    navigator.clipboard.writeText(address);
    alert("Address copied to clipboard!");
  };

  const handleSubmit = () => {
    if (txHash.length < 10) {
      alert("Please enter a valid Transaction ID (Hash).");
      return;
    }
    onConfirmed(txHash);
  };

  const walletAddress = orderInfo.crypto === "USDT" 
    ? "TQn9Y2khSsTFC8gcqW5w3j7k8s9d0f1g2h" 
    : "GMS1u1czi2TBJwwGefFP2XeiUVPNYbKbrtaxUGvgtUs2";
    
  const amount = orderInfo.crypto === "USDT" 
    ? orderInfo.totalPrice 
    : (orderInfo.totalPrice / 150).toFixed(4);
  const symbol = orderInfo.crypto === "USDT" ? "USDT" : "XMR";
  const network = orderInfo.crypto === "USDT" ? "TRC-20" : "Monero";

  return (
    <div className="flex flex-col h-full bg-black text-white overflow-y-auto custom-scrollbar">
      
      <div className="flex items-center justify-between p-3 border-b border-gray-800 sticky top-0 bg-black/90 backdrop-blur-md z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-widest text-[10px]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          BACK
        </button>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-green-900/30 border border-green-800 text-green-400">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-black tracking-widest">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="p-3 flex flex-col items-center max-w-lg mx-auto w-full">
        
        <div className="text-center mb-3 mt-2">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-2 text-white">
            Send {symbol} ({network})
          </h2>
          <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wide leading-tight">
            Please send the exact amount to the address below
          </p>
        </div>

        <div className="w-full bg-[#1a1a1a] text-white p-3 rounded-2xl shadow-xl mb-3 relative overflow-hidden border border-gray-800">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl -mr-4 -mt-4"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="flex-1 pr-3">
              <p className="text-xs font-black text-white uppercase tracking-wider mb-0.5">{orderInfo.show.venue}</p>
              <p className="text-[9px] text-gray-400 font-bold">{orderInfo.show.date} • {orderInfo.ticketType.toUpperCase()} x {orderInfo.quantity}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-black text-[#26A17B]">{amount}</p>
              <p className="text-[8px] font-bold text-gray-400">{symbol}</p>
            </div>
          </div>
        </div>

        <div className="mb-3 relative group">
          <div className={`absolute inset-0 blur-2xl opacity-20 rounded-full ${orderInfo.crypto === "USDT" ? "bg-green-500" : "bg-orange-500"}`}></div>
          <div className="relative bg-white p-3 rounded-2xl border-2 border-gray-700 shadow-lg">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${walletAddress}`} alt="QR Code" className="w-40 h-40 mix-blend-multiply" />
          </div>
        </div>

        <div className="w-full space-y-2 mb-3">
          <div>
            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">
              {symbol} Wallet Address ({network})
            </label>
            <div className="flex items-center gap-2 bg-[#1a1a1a] p-1.5 rounded-xl border border-gray-700 focus-within:border-gray-500 transition-colors">
              <input 
                type="text" 
                value={walletAddress} 
                readOnly 
                className="flex-1 bg-transparent border-none text-[10px] font-mono font-bold text-white focus:outline-none px-2 truncate"
              />
              <button onClick={handleCopy} className="px-3 py-1.5 bg-white text-black text-[9px] font-black uppercase rounded-lg hover:bg-gray-200 transition-colors shrink-0">
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">
              Payment Proof (TxID / Hash)
            </label>
            <input 
              type="text" 
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="Paste your transaction ID here" 
              className="w-full bg-[#1a1a1a] p-2.5 rounded-xl border border-gray-700 text-[10px] font-mono font-bold text-white focus:outline-none focus:border-gray-500 transition-colors placeholder-gray-500"
            />
          </div>
        </div>

        <div className="mt-auto w-full pt-1 pb-2">
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest text-center mb-2">
            Required to verify your transaction on the blockchain
          </p>
          <button 
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-white text-black font-black text-sm tracking-[0.2em] uppercase hover:bg-gray-200 transition-all shadow-xl active:scale-95 disabled:bg-gray-600 disabled:text-gray-400"
            disabled={txHash.length < 10}
          >
            I HAVE SENT PAYMENT
          </button>
        </div>

      </div>
    </div>
  );
}