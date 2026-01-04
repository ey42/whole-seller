import React, { useState } from 'react';

const GridBackground = ({ children }: { children: React.ReactNode }) => {

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const {clientX, clientY, currentTarget} = e;
        const {left, top} = currentTarget.getBoundingClientRect();
        setMousePos({ x: clientX - left, y: clientY - top });
    }
  return (
    // 1. The Container with solid black background
    <div onMouseMove={handleMouseMove} className="relative min-h-screen w-full bg-[#0a0a0a] overflow-hidden group">
      {/* 1. The Base Grid (Dim) */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none' stroke='rgb(255, 255, 255)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3cpath d='M15 16v2M16 17h-2' stroke-width='2'/%3e%3c/svg%3e")`,
        }}
      />
      {/* 2. The Grid Pattern Layer */}

      <div className="absolute inset-0 z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255, 255, 255)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3cpath d='M15 16v2M16 17h-2' stroke-width='2'/%3e%3c/svg%3e")`,
          maskImage: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
        }}
      />
      {/* 3. The Lighting/Fade Layer (Radial Gradient) */}
      {/* This sits on top and fades the grid out towards the edges */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_10%,black_100%)] pointer-events-none"></div>

      {/* Your Website Content goes here, sitting on top of everything */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};
export default GridBackground;