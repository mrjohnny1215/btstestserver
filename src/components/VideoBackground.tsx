export function VideoBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#050505]">
      {/* 🔮 보라색 메인 오로라 (왼쪽 상단) */}
      <div 
        className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-purple-900/20 blur-[120px] rounded-full animate-pulse" 
        style={{ animationDuration: '8s' }}
      />
      
      {/* 🌊 에메랄드 포인트 광원 (오른쪽 중앙) */}
      <div 
        className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-emerald-900/10 blur-[100px] rounded-full animate-pulse" 
        style={{ animationDuration: '12s', animationDelay: '2s' }}
      />

      {/* 🌌 딥 블루 오로라 (하단 전체) */}
      <div 
        className="absolute bottom-[-20%] left-[10%] w-[90%] h-[70%] bg-blue-900/10 blur-[130px] rounded-full animate-pulse" 
        style={{ animationDuration: '10s', animationDelay: '4s' }}
      />

      {/* 🎞️ 고급스러운 노이즈 텍스처 (필름 느낌 추가) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ 
          backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`,
          filter: 'contrast(150%) brightness(100%)'
        }}
      />
      
      {/* 🌑 전체적인 비네팅 효과 (중앙 집중) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
    </div>
  );
}
