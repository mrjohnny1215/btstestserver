import { useState, useEffect } from "react";
import { type Show } from "../data/tourData";
import { verifyPayment, isValidTxHash } from "../utils/paymentCheck";

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
  onConfirmed: (txHash: string) => void;
}

export function PaymentPage({ orderInfo, onBack, onConfirmed }: PaymentPageProps) {
  const [txHash, setTxHash] = useState("");
  const [timeLeft, setTimeLeft] = useState(29 * 60 + 52);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");

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

  const USDT_WARNING = "⚠️ This address accepts only Tether (TRC20). Any other assets sent here will be permanently lost.";
  const USDC_WARNING = "⚠️ This address accepts only USD Coin (SPL). Any other assets sent here will be permanently lost.";

  const handleCopy = () => {
    const address = orderInfo.crypto === "USDT" ? USDT_ADDRESS : USDC_ADDRESS;
    navigator.clipboard.writeText(address);
    alert("Address copied to clipboard!");
  };

  const handleSubmit = async () => {
    setVerificationError("");
    
    if (!isValidTxHash(txHash, orderInfo.crypto)) {
      setVerificationError(
        orderInfo.crypto === "USDT"
          ? "Invalid TRC-20 TX Hash (64 hex characters required)"
          : "Invalid Solana TX ID (87-88 Base58 characters required)"
      );
      return;
    }
    
    if (orderInfo.crypto === "USDT" && txHash.startsWith("T")) {
      setVerificationError("This looks like a TRON wallet address, not a transaction hash");
      return;
    }
    if (orderInfo.crypto === "USDC" && (txHash.startsWith("E") || txHash.startsWith("5"))) {
      setVerificationError("This looks like a Solana wallet address, not a transaction ID");
      return;
    }
    
    setIsVerifying(true);
    
    try {
      const verification = await verifyPayment(
        txHash,
        orderInfo.crypto,
        walletAddress,
        orderInfo.totalPrice
      );
      
      if (!verification.success) {
        setVerificationError(verification.message);
        return;
      }
      
      onConfirmed(txHash);
      
    } catch (error) {
      setVerificationError("Network error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const walletAddress = orderInfo.crypto === "USDT" ? USDT_ADDRESS : USDC_ADDRESS;
  const warningMessage = orderInfo.crypto === "USDT" ? USDT_WARNING : USDC_WARNING;
  
  const amount = orderInfo.totalPrice;
  const symbol = orderInfo.crypto === "USDT" ? "USDT" : "USDC";
  const network = orderInfo.crypto === "USDT" ? "TRC-20" : "Solana";
  
  const themeColor = orderInfo.crypto === "USDT" ? "#26A17B" : "#3B82F6";
  const themeGlow = orderInfo.crypto === "USDT" ? "bg-green-500" : "bg-blue-500";
  const themeBorder = orderInfo.crypto === "USDT" ? "border-green-800" : "border-blue-800";
  const themeText = orderInfo.crypto === "USDT" ? "text-green-400" : "text-blue-400";
  const themeDot = orderInfo.crypto === "USDT" ? "bg-green-500" : "bg-blue-500";
  const themeBg = orderInfo.crypto === "USDT" ? "bg-green-900/30" : "bg-blue-900/30";

  const isButtonDisabled = txHash.trim().length === 0 || !isValidTxHash(txHash, orderInfo.crypto) || isVerifying;

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto custom-scrollbar">
      
      <div className="flex items-center justify-between p-3 border-b border-gray-800 sticky top-0 bg-black z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-widest text-[10px]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          BACK
        </button>
        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full ${themeBg} ${themeBorder} ${themeText}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${themeDot} animate-pulse`}></div>
          <span className="text-[10px] font-black tracking-widest">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="p-3 flex flex-col items-center max-w-lg mx-auto w-full">
        
        <div className="w-full bg-black text-white p-3 rounded-2xl shadow-xl mb-3 relative overflow-hidden border border-gray-800">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl -mr-4 -mt-4"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="flex-1 pr-3">
              <p className="text-xs font-black text-white uppercase tracking-wider mb-0.5">{orderInfo.show.venue}</p>
              <p className="text-[9px] text-gray-400 font-bold">{orderInfo.show.date} • {orderInfo.ticketType.toUpperCase()} x {orderInfo.quantity}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-black" style={{ color: themeColor }}>{amount}</p>
              <p className="text-[8px] font-bold text-gray-400">{symbol}</p>
            </div>
          </div>
        </div>

        <div className="text-center mb-3 mt-2">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-2 text-gray-900">
            Send {symbol} ({network})
          </h2>
          <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wide leading-tight">
            Please send the exact amount to the address below
          </p>
        </div>

        <div className="mb-3 relative group">
          <div className={`absolute inset-0 blur-2xl opacity-20 rounded-full ${themeGlow}`}></div>
          <div className="relative bg-white p-3 rounded-2xl border-2 border-gray-200 shadow-lg">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=  ${walletAddress}`} 
              alt="QR Code" 
              className="w-40 h-40 mix-blend-multiply" 
            />
            {orderInfo.crypto === "USDC" && (
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full border-2 border-blue-500 flex items-center justify-center shadow-lg">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/c/ca/USD_Coin_logo_%28cropped%29.png  " 
                  alt="USDC" 
                  className="w-7 h-7 object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <div className={`w-full p-2.5 rounded-xl mb-3 text-[9px] font-bold text-center border ${orderInfo.crypto === "USDT" ? "bg-green-50 border-green-200 text-green-700" : "bg-blue-50 border-blue-200 text-blue-700"}`}>
          {warningMessage}
        </div>

        <div className="w-full space-y-2 mb-3">
          <div>
            <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 text-center">
              {symbol} Wallet Address ({network})
            </label>
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border-2 border-gray-200 focus-within:border-gray-400 transition-colors">
              <input 
                type="text" 
                value={walletAddress} 
                readOnly 
                className="flex-1 bg-transparent border-none text-[10px] font-mono font-bold text-gray-900 focus:outline-none px-2 truncate"
              />
              <button onClick={handleCopy} className="px-3 py-1.5 bg-black text-white text-[9px] font-black uppercase rounded-lg hover:bg-gray-800 transition-colors shrink-0">
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 text-center">
              Payment Proof (TxID / Hash)
            </label>
            <input 
              type="text" 
              value={txHash}
              onChange={(e) => {
                setTxHash(e.target.value);
                if (verificationError) setVerificationError("");
              }}
              placeholder="Paste your transaction ID here" 
              className={`w-full bg-white p-2.5 rounded-xl border-2 text-[10px] font-mono font-bold text-gray-900 focus:outline-none transition-colors placeholder-gray-400 ${
                txHash.length > 0 && !isValidTxHash(txHash, orderInfo.crypto) 
                  ? 'border-red-400 focus:border-red-500' 
                  : 'border-gray-200 focus:border-gray-400'
              }`}
            />
            {txHash.length > 0 && !isValidTxHash(txHash, orderInfo.crypto) && (
              <p className="text-[8px] text-red-500 font-bold mt-1 text-center">
                {orderInfo.crypto === "USDT" 
                  ? "Invalid TRC-20 TX Hash (64 hex characters)"
                  : "Invalid Solana TX ID (87-88 Base58 characters)"
                }
              </p>
            )}
          </div>
        </div>

        {verificationError && (
          <div className="w-full p-3 bg-red-50 border-2 border-red-300 rounded-xl mb-3">
            <p className="text-[9px] text-red-700 font-bold text-center">
              ⚠️ {verificationError}
            </p>
          </div>
        )}
        
        {isVerifying && (
          <div className="w-full p-3 bg-blue-50 border-2 border-blue-300 rounded-xl mb-3">
            <p className="text-[9px] text-blue-700 font-bold text-center animate-pulse">
              Verifying transaction on blockchain...
            </p>
          </div>
        )}

        <div className="mt-auto w-full pt-1 pb-2">
          <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest text-center mb-2">
            Required to verify your transaction on the blockchain
          </p>
          <button 
            onClick={handleSubmit}
            disabled={isButtonDisabled}
            className={`w-full py-3 rounded-xl font-black text-sm tracking-[0.2em] uppercase transition-all shadow-xl active:scale-95 ${
              isButtonDisabled
                ? "bg-gray-300 text-gray-500 shadow-none cursor-not-allowed"
                : "bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] bg-[length:200%_auto] hover:bg-right text-gray-900 shadow-[0_8px_25px_rgba(212,175,55,0.4)]"
            }`}
          >
            {isVerifying ? "VERIFYING..." : "I HAVE SENT PAYMENT"}
          </button>
        </div>

      </div>
    </div>
  );
}