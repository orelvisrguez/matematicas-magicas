
import React, { useEffect, useRef } from 'react';
import { WORLDS, GRIMOIRE_PAGES } from '../constants';
import { LevelProgress } from '../types';
import { ArrowLeft, Star, Lock, CheckCircle, Zap } from 'lucide-react';

interface SkillTreeProps {
  levelProgress: Record<string, LevelProgress>;
  unlockedPages: string[];
  onExit: () => void;
}

const SkillTree: React.FC<SkillTreeProps> = ({ levelProgress, unlockedPages, onExit }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom (start of tree) or the highest unlocked level
  useEffect(() => {
    if (scrollRef.current) {
      // Find the highest unlocked level index
      const highestUnlockedIndex = WORLDS.findIndex(w => {
         const prog = levelProgress[w.id];
         return !prog || !prog.completed;
      });
      
      // Calculate scroll position roughly (reverse index logic)
      // Or just scroll to bottom initially for the "Growth" feeling
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  // Reverse worlds to render from Bottom (Root) to Top (Sky)
  const reversedWorlds = [...WORLDS].reverse();

  return (
    <div className="h-screen w-full bg-slate-900 flex flex-col relative overflow-hidden font-fredoka">
      
      {/* Background Atmosphere Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#0ea5e9] to-[#84cc16] z-0 pointer-events-none"></div>
      
      {/* Cloud Decorations (CSS Parallax feel) */}
      <div className="absolute top-20 left-10 text-white/20 text-9xl animate-pulse">☁️</div>
      <div className="absolute top-1/2 right-10 text-white/30 text-8xl animate-pulse" style={{ animationDelay: '2s' }}>☁️</div>
      <div className="absolute bottom-40 left-20 text-white/40 text-6xl animate-pulse" style={{ animationDelay: '1s' }}>☁️</div>

      {/* Header */}
      <div className="relative z-50 p-4 flex items-center justify-between bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="flex items-center gap-4">
          <button 
            onClick={onExit} 
            className="p-2 bg-white/20 rounded-full text-white hover:bg-white/40 hover:scale-110 transition-all border-2 border-white/50"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md flex items-center gap-2">
            🌱 Gran Árbol Mágico
          </h1>
        </div>
        <div className="bg-black/30 px-4 py-2 rounded-full text-white text-sm font-bold border border-white/20">
          Tu Camino al Conocimiento
        </div>
      </div>

      {/* Tree Container */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto relative z-10 custom-scrollbar scroll-smooth"
      >
        <div className="max-w-3xl mx-auto relative pt-32 pb-32 min-h-[150vh]">
          
          {/* THE VINE (SVG Path connecting nodes) */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
             <defs>
               <linearGradient id="vineGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                 <stop offset="0%" stopColor="#5D4037" /> {/* Root Brown */}
                 <stop offset="40%" stopColor="#22c55e" /> {/* Stem Green */}
                 <stop offset="100%" stopColor="#a855f7" /> {/* Magic Purple */}
               </linearGradient>
               <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                  </feMerge>
               </filter>
             </defs>
             {/* 
                Generating the path dynamically is tricky in React without fixed heights.
                Instead, we use a central dashed line as a guide, and individual connector curves in the loop below could be used.
                For this "S" shape effect, we'll assume a consistent height per row (~200px).
             */}
             <path 
               d={`
                 M 50% 100% 
                 ${reversedWorlds.map((_, i) => {
                    const yStep = 100 - ((i + 1) * (100 / reversedWorlds.length));
                    const xPos = i % 2 === 0 ? 70 : 30; // Zig Zag 30% <-> 70%
                    return `Q 50% ${yStep + 5}%, ${xPos}% ${yStep}% T 50% ${yStep - 5}%`;
                 }).join(" ")}
               `}
               fill="none"
               stroke="url(#vineGradient)"
               strokeWidth="8"
               strokeLinecap="round"
               filter="url(#glow)"
               className="opacity-80"
             />
          </svg>

          {/* Render Worlds (Bottom to Top) */}
          {reversedWorlds.map((world, index) => {
            // Re-calculate original index because array is reversed
            const originalIndex = (WORLDS.length - 1) - index;
            const progress = levelProgress[world.id];
            
            // Logic for state
            const isCompleted = progress?.completed;
            const isUnlocked = isCompleted || originalIndex === 0 || (levelProgress[WORLDS[originalIndex - 1]?.id]?.completed);
            const stars = progress?.stars || 0;
            const concepts = GRIMOIRE_PAGES.filter(p => p.worldId === world.id);
            
            // Zig-Zag positioning
            const isRight = index % 2 === 0; // Starts right because bottom is index 0 of reversed array? 
            // Actually, let's alternate based on the reversed index to match the SVG curve logic visually
            const alignmentClass = isRight ? 'justify-end pr-4 md:pr-20' : 'justify-start pl-4 md:pl-20';

            return (
              <div 
                key={world.id} 
                className={`flex w-full mb-24 relative ${alignmentClass}`}
              >
                {/* Connector Branch visual (CSS pseudo-element backup) */}
                
                {/* The Node Island */}
                <div className={`
                  relative group flex flex-col items-center
                  transition-all duration-700 transform
                  ${isUnlocked ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-60 grayscale'}
                `}>
                  
                  {/* Floating Island Base */}
                  <div className={`
                    absolute -bottom-6 w-32 h-10 rounded-[100%] blur-sm opacity-80 z-0
                    ${isCompleted ? 'bg-cyan-400/50 animate-pulse' : 'bg-black/40'}
                  `}></div>

                  {/* World Icon Orb */}
                  <div className={`
                     w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-2xl border-4 z-10 relative
                     ${isCompleted 
                       ? 'bg-gradient-to-br from-yellow-300 to-amber-500 border-white ring-4 ring-yellow-400/50 animate-bounce-short' 
                       : isUnlocked 
                         ? `${world.color} border-white text-white animate-float`
                         : 'bg-slate-700 border-slate-600 text-slate-500'}
                  `}>
                     {isUnlocked ? (
                        <span>{world.guardian.avatar}</span>
                     ) : (
                        <Lock />
                     )}
                     
                     {/* Star Badge */}
                     {isUnlocked && (
                       <div className="absolute -top-2 -right-2 bg-white text-yellow-500 rounded-full px-2 py-0.5 text-xs font-bold border border-yellow-200 shadow flex items-center gap-1">
                         <Star size={10} fill="currentColor" /> {stars}/3
                       </div>
                     )}
                  </div>

                  {/* Title Plate */}
                  <div className={`
                    mt-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-xl text-center shadow-lg border-b-4 z-10
                    ${isUnlocked ? `border-${world.color.split('-')[1]}-600 text-gray-800` : 'border-gray-500 text-gray-500'}
                  `}>
                    <h3 className="font-bold text-sm md:text-base whitespace-nowrap">{world.title}</h3>
                  </div>

                  {/* Concept Leaves/Sprouts */}
                  {isUnlocked && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none z-0">
                       {concepts.map((page, i) => {
                         const pageUnlocked = unlockedPages.includes(page.id);
                         // Position leaves in a circle
                         const angle = (i / concepts.length) * 360;
                         const radius = 80; // Distance from center
                         const x = Math.cos((angle * Math.PI) / 180) * radius;
                         const y = Math.sin((angle * Math.PI) / 180) * radius;

                         return (
                           <div
                             key={page.id}
                             className={`
                               absolute w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 shadow-md pointer-events-auto cursor-help
                               transition-all duration-500 hover:scale-125 hover:z-50 group/leaf
                               ${pageUnlocked ? 'bg-green-400 border-green-200' : 'bg-gray-600 border-gray-500 opacity-50'}
                             `}
                             style={{ 
                               top: `calc(50% + ${y}px)`, 
                               left: `calc(50% + ${x}px)`,
                               transitionDelay: `${i * 100}ms`
                             }}
                           >
                              {pageUnlocked ? '🌿' : '🥀'}
                              
                              {/* Hover Tooltip for Concept */}
                              <div className="absolute bottom-full mb-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/leaf:opacity-100 transition-opacity pointer-events-none">
                                {page.title}
                              </div>
                           </div>
                         );
                       })}
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {/* Root/Start Decoration */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center opacity-80">
            <div className="text-6xl mb-2">🌱</div>
            <div className="bg-amber-900/40 px-4 py-1 rounded-full text-amber-100 text-sm font-bold border border-amber-800">
               Inicio del Viaje
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SkillTree;
