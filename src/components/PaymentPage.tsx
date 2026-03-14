import { useState, useEffect, useMemo } from "react";
import { type Show } from "../data/tourData";

interface PaymentPageProps {
  orderInfo: {
    email: string;
    name: string;
    totalPrice: number;
    show: Show;
    ticketType: string;
    quantity: number;
    crypto: "USDT" | "USDC";
  };
  onBack: () => void;
  onConfirmed: (txHash: string, name: string, email: string) => void;
  onNameChange?: (name: string) => void;
  onEmailChange?: (email: string) => void;
}

export function PaymentPage({ orderInfo, onBack, onConfirmed, onNameChange, onEmailChange }: PaymentPageProps) {
  const [txHash, setTxHash] = useState("");
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [verificationError, setVerificationError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(orderInfo.name || "");
  const [email, setEmail] = useState(orderInfo.email || "");

  const isEmailValid = useMemo(() => {
    if (!email) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|icloud\.com|me\.com|mac\.com)$/i;
    return emailRegex.test(email);
  }, [email]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const USDT_ADDRESS = "TDAVYeowwtvPmoJfeFjmK9D3UVv33LW2N7";
  const USDC_ADDRESS = "EoSrBdAV5FQ3LLpcCox8BJoRa45PN1Xosqh9xAN2xwBk";

  const handleCopy = () => {
    const address = orderInfo.crypto === "USDT" ? USDT_ADDRESS : USDC_ADDRESS;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    setVerificationError("");

    if (!isEmailValid) {
      setVerificationError("Please enter a valid Gmail or iCloud email address.");
      return;
    }

    if (!name.trim()) {
      setVerificationError("Please enter your full legal name.");
      return;
    }

    if (txHash.trim().length === 0) {
      setVerificationError("Please enter any text to test.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      onConfirmed(txHash, name, email);
      setIsLoading(false);
    }, 3000);
  };

  const walletAddress = orderInfo.crypto === "USDT" ? USDT_ADDRESS : USDC_ADDRESS;
  const network = orderInfo.crypto === "USDT" ? "TRC-20" : "Solana";
  const themeDot = orderInfo.crypto === "USDT" ? "bg-green-500" : "bg-blue-500";
  const themeBg = orderInfo.crypto === "USDT" ? "bg-green-100" : "bg-blue-100";
  const themeBorder = orderInfo.crypto === "USDT" ? "border-green-800" : "border-blue-800";
  const themeText = orderInfo.crypto === "USDT" ? "text-green-700" : "text-blue-700";
  const themeGlow = orderInfo.crypto === "USDT" ? "bg-green-500" : "bg-blue-500";

  const isButtonDisabled = txHash.trim().length === 0 || isLoading || !isEmailValid || !name.trim();

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-cyan-400 border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-white font-black text-lg uppercase tracking-widest animate-pulse">
          Confirming Availability
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between p-3 sticky top-0 z-10 bg-transparent">
        <button onClick={onBack} className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg shadow-md hover:bg-gray-800 transition-colors font-bold uppercase tracking-widest text-[10px]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          BACK
        </button>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-sm border ${themeBg} ${themeBorder} ${themeText}`}>
          <div className={`w-2 h-2 rounded-full ${themeDot} animate-pulse`}></div>
          <span className="text-xs font-black tracking-widest">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="p-3 flex flex-col items-center max-w-lg mx-auto w-full">
        <div className="text-center mb-4 mt-2">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-2 text-gray-900">Send Exact Amount</h2>
          <div className="text-xs md:text-sm font-bold text-green-600 uppercase tracking-wide leading-relaxed">
            <p>Send the exact amount shown below.</p>
            <p>No extra {orderInfo.crypto === "USDT" ? "TRX" : "SOL"} needed. Gas fees INCLUDED!</p>
          </div>
        </div>

        <div className="mb-4 relative group">
          <div className={`absolute inset-0 blur-2xl opacity-20 rounded-full ${themeGlow}`}></div>
          <div className="relative bg-white p-3 rounded-2xl border-2 border-gray-200 shadow-lg">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${walletAddress}`} alt="QR Code" className="w-40 h-40 mix-blend-multiply" />
            {orderInfo.crypto === "USDC" && (
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full border-2 border-blue-500 flex items-center justify-center shadow-lg">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/USD_Coin_logo_%28cropped%29.png" alt="USDC" className="w-7 h-7 object-contain" />
              </div>
            )}
          </div>
        </div>

        <div className="w-full space-y-3 mb-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider text-center mb-2">Delivery Information</h4>
          <div>
            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Full Legal Name</label>
            <input type="text" value={name} onChange={(e) => { setName(e.target.value); onNameChange?.(e.target.value); }} placeholder="Full Legal Name" className="w-full px-3 py-2 rounded-lg border border-gray-300 font-medium text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-xs" />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); onEmailChange?.(e.target.value); }} placeholder="Enter a valid Gmail or iCloud address" className={`w-full px-3 py-2 rounded-lg border font-medium text-gray-900 focus:outline-none focus:ring-1 transition-all text-xs ${!isEmailValid && email.length > 0 ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-black focus:ring-black"}`} />
            {!isEmailValid && email.length > 0 && <p className="text-[9px] text-red-500 font-bold mt-1">Only Gmail and iCloud addresses are allowed.</p>}
          </div>
        </div>

        <div className="w-full space-y-3 mb-4">
          <div>
            <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-1.5 text-center">Destination Address ({network})</label>
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border-2 border-gray-300 focus-within:border-black transition-colors shadow-sm">
              <input type="text" value={walletAddress} readOnly className="flex-1 bg-transparent border-none text-[11px] font-mono font-bold text-gray-900 focus:outline-none px-2 truncate" />
              <button onClick={handleCopy} className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all shrink-0 ${copied ? "bg-green-500 text-white" : "bg-black text-white hover:bg-gray-800"}`}>{copied ? "COPIED" : "COPY"}</button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-1.5 text-center">Payment Proof (TxID / Hash)</label>
            <input type="text" value={txHash} onChange={(e) => { setTxHash(e.target.value); setVerificationError(""); }} placeholder="Paste Payment Proof (TxID / Hash)" className="w-full bg-white p-2.5 rounded-xl border-2 text-[11px] font-mono font-bold text-gray-900 focus:outline-none border-gray-300 focus:border-black shadow-sm" />
          </div>
        </div>

        {verificationError && (
          <div className="w-full p-3 bg-red-100 border-2 border-red-400 rounded-xl mb-3 animate-pulse">
            <p className="text-[10px] text-red-800 font-bold text-center flex items-center justify-center gap-2"><span>⚠️</span> {verificationError}</p>
          </div>
        )}

        <div className="mt-auto w-full pt-2 pb-4">
          <p className="text-[9px] font-black text-black uppercase tracking-widest text-center mb-3 opacity-80">Required to verify your transaction</p>
          <button onClick={handleSubmit} disabled={isButtonDisabled} className={`w-full py-4 rounded-xl font-black text-sm tracking-[0.2em] uppercase transition-all shadow-xl active:scale-95 ${isButtonDisabled ? "bg-gray-300 text-gray-500 shadow-none cursor-not-allowed opacity-70" : "bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] bg-[length:200%_auto] hover:bg-right text-gray-900 shadow-[0_8px_25px_rgba(212,175,55,0.4)] border border-yellow-600"}`}>CONFIRM PAYMENT</button>
        </div>
      </div>
    </div>
  );
}