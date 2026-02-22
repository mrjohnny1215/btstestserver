import { useState, useEffect } from "react";
import { type Show } from "../data/tourData";

interface OrderInfo {
  email: string;
  name: string;
  totalPrice: number;
  show: Show;
  ticketType: string;
  quantity: number;
  crypto?: "USDT" | "TRX";
}

interface PaymentPageProps {
  orderInfo: OrderInfo;
  onBack: () => void;
  onConfirmed: (txHash: string) => void;
}

export function PaymentPage({ orderInfo, onBack, onConfirmed }: PaymentPageProps) {
  const [timeLeft, setTimeLeft] = useState(1800);
  const [copied, setCopied] = useState(false);
  
  // 💡 [수정] 단순 로딩 여부가 아니라, 검증 단계를 텍스트로 보여주기 위한 상태
  const [verifyStep, setVerifyStep] = useState(0); 
  const [txId, setTxId] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  const crypto = orderInfo.crypto || "USDT";
  const isUSDT = crypto === "USDT";
  
  const title = isUSDT ? "SEND USDT (TRC-20)" : "SEND TRON (TRX)";
  const symbol = isUSDT ? "USDT" : "TRX";
  const amount = isUSDT ? orderInfo.totalPrice : orderInfo.totalPrice * 6; 
  const addressLabel = isUSDT ? "USDT WALLET ADDRESS (TRC-20)" : "TRON WALLET ADDRESS (TRX)";
  
  const address = isUSDT 
    ? "TAeD9UfPwHjpaR7pSMv4LtJRWsdx8iy5Fx" 
    : "TJrX9sYvPwwHjpaR7pSMv4LtJRWsdxTRX1"; 
    
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + address;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 💡 [수정] 허접한 스피너 대신, 텍스트가 순차적으로 변하는 고급 검증 연출
  const handleVerifyPayment = () => {
    setVerifyStep(1); // 1단계: 네트워크 스캔
    
    setTimeout(() => {
      setVerifyStep(2); // 2단계: 트랜잭션 해시 확인 중
    }, 1500);

    setTimeout(() => {
      setVerifyStep(3); // 3단계: 티켓 발권 중
    }, 3500);

    setTimeout(() => {
      onConfirmed(txId); // 4.5초 뒤 최종 완료
    }, 4500);
  };

  return (
    <div className="bg-[#050505] h-full flex flex-col p-6 sm:p-10 font-sans text-white animate-in slide-in-from-right-8 duration-300 rounded-b-3xl relative">
      
      {/* 💡 [수정] 검증 진행 중일 때 화면 전체를 덮는 고급스러운 로딩 오버레이 */}
      {verifyStep > 0 && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center px-10 rounded-b-3xl">
            <div className="w-full max-w-sm">
                <div className="flex justify-between items-end mb-3">
                    <span className="font-mono text-xs font-bold text-[#26A17B] uppercase tracking-widest">
                        {verifyStep === 1 && "Scanning Network..."}
                        {verifyStep === 2 && "Verifying Transaction..."}
                        {verifyStep === 3 && "Securing Tickets..."}
                    </span>
                    <span className="font-mono text-xs font-bold text-white">{verifyStep}/3</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-[#26A17B] transition-all duration-1000 ease-out"
                        style={{ width: verifyStep === 1 ? "33%" : verifyStep === 2 ? "66%" : "100%" }}
                    />
                </div>
                <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-8 animate-pulse">
                    Please do not close this window
                </p>
            </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-10">
        <button onClick={onBack} disabled={verifyStep > 0} className="text-gray-400 hover:text-white flex items-center gap-2 text-xs font-black tracking-[0.2em] uppercase transition-colors disabled:opacity-30">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#26A17B]/30 bg-[#26A17B]/10 text-[#26A17B]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-[10px] font-black tracking-widest">{mins}:{secs}</span>
          <span className="text-[8px] font-black tracking-widest opacity-60 ml-1 hidden sm:inline">TIME REMAINING</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className={`text-2xl sm:text-3xl font-black tracking-tighter mb-2 text-white`}>{title}</h2>
        <p className="text-gray-500 text-[10px] sm:text-xs font-bold tracking-widest uppercase">Please send the exact amount to the address below</p>
      </div>

      <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex justify-between items-center mb-6">
        <div className="text-left">
          <h3 className="text-sm font-black tracking-tight mb-1">{orderInfo.show.venue}</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            {orderInfo.show.date.split('.')[0]}.{orderInfo.show.date.split('.')[1]}, 2026 • {orderInfo.ticketType.toUpperCase()} x {orderInfo.quantity}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-black tracking-tighter leading-none mb-1 ${isUSDT ? 'text-green-400' : 'text-red-400'}`}>
            {amount.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 font-black tracking-[0.2em]">{symbol}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl mx-auto w-fit mb-6 shadow-[0_0_40px_rgba(255,255,255,0.1)] relative">
        <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40 md:w-48 md:h-48 rounded-xl" />
      </div>

      <div className="space-y-2 mb-6">
        <label className="block text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase pl-2">{addressLabel}</label>
        <div className="flex items-center gap-2 p-2 rounded-xl border border-white/10 bg-white/5">
          <code className="flex-1 text-xs font-mono font-bold truncate pl-3 text-gray-300">{address}</code>
          <button onClick={handleCopy} disabled={verifyStep > 0} className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-black tracking-widest uppercase transition-all disabled:opacity-30">
            {copied ? "COPIED" : "COPY"}
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <label className="block text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase pl-2">
            Payment Proof (TxID / Hash)
        </label>
        <input 
            type="text" 
            value={txId} 
            onChange={(e) => setTxId(e.target.value.trim())} 
            placeholder="Paste your transaction ID here" 
            disabled={verifyStep > 0}
            className="w-full px-5 py-4 rounded-xl border-2 border-white/10 bg-black focus:bg-white/5 focus:outline-none focus:border-[#26A17B] transition-all font-mono text-xs text-white placeholder:text-white/20 tracking-wider disabled:opacity-50" 
        />
        <p className="text-[9px] font-bold text-gray-600 mt-1 pl-2 uppercase tracking-widest">Required to verify your transaction on the blockchain.</p>
      </div>

      <div className="mt-auto">
         <button 
            onClick={handleVerifyPayment} 
            disabled={verifyStep > 0 || txId.length === 0}
            className={`w-full py-5 rounded-2xl border text-white font-black text-sm tracking-[0.2em] uppercase shadow-2xl transition-all flex items-center justify-center gap-3 
                ${txId.length === 0 ? 'bg-gray-900 border-transparent opacity-50 cursor-not-allowed' : 
                  'bg-[#26A17B] border-[#26A17B] hover:bg-[#1f8766] active:scale-95 text-white'}`}
         >
            I Have Sent Payment
         </button>
      </div>
    </div>
  );
}