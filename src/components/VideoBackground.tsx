export function VideoBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#050505]">
      <div 
        className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-purple-900/20 blur-[120px] rounded-full animate-pulse" 
        style={{ animationDuration: '8s' }}
      />
      
      <div 
        className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-emerald-900/10 blur-[100px] rounded-full animate-pulse" 
        style={{ animationDuration: '12s', animationDelay: '2s' }}
      />

      <div 
        className="absolute bottom-[-20%] left-[10%] w-[90%] h-[70%] bg-blue-900/10 blur-[130px] rounded-full animate-pulse" 
        style={{ animationDuration: '10s', animationDelay: '4s' }}
      />

      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ 
          backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`,
          filter: 'contrast(150%) brightness(100%)'
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
    </div>
  );
}