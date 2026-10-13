import React, { useState, useEffect } from 'react';

export const HeroVisual: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div 
      className="relative w-full max-w-[540px] aspect-square mx-auto flex items-center justify-center perspective-1200 cursor-pointer select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient background volumetric glow */}
      <div className="absolute inset-0 bg-gradient-radial from-[#D9AD54]/15 via-[#194D42]/25 to-transparent rounded-full blur-3xl pointer-events-none transform -translate-y-4"></div>
      
      {/* Secondary emerald atmospheric depth glow */}
      <div className="absolute w-72 h-72 bg-[#123C35] rounded-full blur-2xl opacity-60 pointer-events-none"></div>

      {/* 3D Interactive Container */}
      <div 
        className="relative w-full h-full flex items-center justify-center preserve-3d transition-transform duration-500 ease-out"
        style={{
          transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`
        }}
      >
        
        {/* Layer 0: Ground shadow ellipse */}
        <div className="absolute bottom-6 w-3/4 h-12 bg-black/40 blur-xl rounded-full transform scale-y-50 pointer-events-none"></div>

        {/* Layer 1: Outer Rotating Calibrated Measurement Ring */}
        <div className="absolute w-[88%] h-[88%] rounded-full border border-[#D9AD54]/30 animate-spin-very-slow pointer-events-none flex items-center justify-center">
          <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
            {/* Concentric fine guide circles */}
            <circle cx="200" cy="200" r="195" fill="none" stroke="#D9AD54" strokeWidth="0.75" strokeDasharray="3 6" opacity="0.4" />
            <circle cx="200" cy="200" r="185" fill="none" stroke="#D9AD54" strokeWidth="1" opacity="0.6" />
            <circle cx="200" cy="200" r="175" fill="none" stroke="#829B83" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" />
            
            {/* Radial graduation tick marks (traditional virarkadai & metric calibration) */}
            {Array.from({ length: 48 }).map((_, i) => {
              const angle = (i * 360) / 48;
              const isMajor = i % 4 === 0;
              const length = isMajor ? 12 : 6;
              const r1 = 185;
              const r2 = 185 - length;
              const rad = (angle * Math.PI) / 180;
              const x1 = 200 + r1 * Math.cos(rad);
              const y1 = 200 + r1 * Math.sin(rad);
              const x2 = 200 + r2 * Math.cos(rad);
              const y2 = 200 + r2 * Math.sin(rad);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isMajor ? '#D9AD54' : '#829B83'}
                  strokeWidth={isMajor ? 1.5 : 0.8}
                  opacity={isMajor ? 0.85 : 0.45}
                />
              );
            })}
          </svg>
        </div>

        {/* Layer 2: Translucent Emerald Glass Geometric Disk */}
        <div className="absolute w-[72%] h-[72%] rounded-full bg-gradient-to-tr from-[#0B2925]/85 via-[#123C35]/70 to-[#194D42]/40 backdrop-blur-md border-2 border-[#D9AD54]/45 shadow-emerald-glow transform animate-float-slow flex items-center justify-center">
          
          {/* Subtle geometric facets inside glass */}
          <div className="w-[85%] h-[85%] rounded-full border border-[#D9AD54]/25 flex items-center justify-center animate-spin-reverse">
            <div className="w-[80%] h-[80%] rounded-full border border-dashed border-[#829B83]/30"></div>
          </div>
        </div>

        {/* Layer 3: Dimensional Antique Gold Measuring Ring (Core Traditional Thread Motif) */}
        <div className="absolute w-[54%] h-[54%] rounded-full border-4 border-[#D9AD54] shadow-gold-glow animate-float-reverse flex items-center justify-center bg-gradient-to-br from-[#D9AD54]/20 via-[#194D42]/40 to-[#0B2925]/90">
          
          {/* Concentric inner calibration lines */}
          <svg viewBox="0 0 200 200" className="w-full h-full p-2">
            {/* Interlaced golden thread loop path */}
            <path
              d="M 100 25 C 145 25, 175 65, 175 100 C 175 145, 135 175, 100 175 C 55 175, 25 135, 25 100 C 25 60, 65 25, 100 25 Z"
              fill="none"
              stroke="#FFFDF8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.8"
            />
            {/* Dynamic continuous gold thread spline */}
            <path
              d="M 45 100 Q 100 35, 155 100 T 100 165 Z"
              fill="none"
              stroke="#D9AD54"
              strokeWidth="3"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(217,173,84,0.6)]"
            />
            {/* Center golden pivot core */}
            <circle cx="100" cy="100" r="14" fill="#123C35" stroke="#D9AD54" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="6" fill="#D9AD54" />
          </svg>
        </div>

        {/* Layer 4: Floating Gold Particles & Stardust Orbs */}
        <div className="absolute top-[14%] right-[16%] w-3 h-3 rounded-full bg-[#D9AD54] shadow-gold-glow animate-pulse-glow"></div>
        <div className="absolute bottom-[20%] left-[14%] w-2.5 h-2.5 rounded-full bg-[#FFFDF8] shadow-gold-glow animate-pulse-glow delay-1000"></div>
        <div className="absolute top-[38%] left-[8%] w-2 h-2 rounded-full bg-[#D9AD54]/80 shadow-gold-glow animate-pulse-glow delay-500"></div>
        <div className="absolute bottom-[35%] right-[10%] w-2 h-2 rounded-full bg-[#829B83] animate-pulse-glow delay-700"></div>

        {/* Layer 5: Refined Heritage Data Badges (Floating Depth Callouts) */}
        <div className="absolute -top-3 right-4 px-3.5 py-1.5 rounded-full emerald-glass text-[10px] font-mono tracking-wider text-[#D9AD54] font-bold border border-[#D9AD54]/40 shadow-lg transform translate-z-10 animate-float-slow">
          <span>● VIRARKADAI MATRIX</span>
        </div>

        <div className="absolute -bottom-3 left-4 px-3.5 py-1.5 rounded-full emerald-glass text-[10px] font-mono tracking-wider text-[#F6F3E9] font-medium border border-[#829B83]/40 shadow-lg transform translate-z-10 animate-float-reverse">
          <span className="text-[#D9AD54]">0.1 mm</span> NORMALIZED RADIAL
        </div>

      </div>
    </div>
  );
};
