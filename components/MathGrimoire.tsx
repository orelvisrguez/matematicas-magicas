
import React, { useState, useEffect } from 'react';
import { GRIMOIRE_PAGES } from '../constants';
import { WorldId } from '../types';
import { ArrowLeft, BookOpen, Lock, Star, MousePointer2, RefreshCw } from 'lucide-react';
import { audioService } from '../services/audioService';

interface MathGrimoireProps {
  unlockedPages: string[];
  onExit: () => void;
}

const MathGrimoire: React.FC<MathGrimoireProps> = ({ unlockedPages, onExit }) => {
  // Default to the first unlocked page or the first page if none
  const [activePageId, setActivePageId] = useState<string | null>(null);
  
  // Interactive State for Demos
  const [demoState, setDemoState] = useState<any>(null);

  useEffect(() => {
    if (unlockedPages.length > 0 && !activePageId) {
      setActivePageId(unlockedPages[unlockedPages.length - 1]); // Open latest
    } else if (!activePageId) {
      setActivePageId(GRIMOIRE_PAGES[0].id); // Preview first even if locked
    }
  }, [unlockedPages]);

  const handlePageSelect = (pageId: string) => {
    audioService.playSFX('click');
    setActivePageId(pageId);
    setDemoState(null); // Reset demo
  };

  const activePage = GRIMOIRE_PAGES.find(p => p.id === activePageId);
  const isUnlocked = activePage && unlockedPages.includes(activePage.id);

  // --- INTERACTIVE DEMOS RENDERER ---
  const renderInteractiveDemo = () => {
    if (!activePage || !isUnlocked) return null;

    switch (activePage.worldId) {
      case WorldId.ADD_SUB:
        const count = demoState || 2;
        return (
          <div className="flex flex-col items-center">
            <p className="text-sm text-amber-800 mb-2 font-bold">¡Haz clic para sumar manzanas!</p>
            <div 
              className="flex gap-2 p-4 bg-white/50 rounded-xl cursor-pointer hover:bg-white/80 transition"
              onClick={() => {
                audioService.playSFX('click');
                setDemoState(count >= 10 ? 1 : count + 1);
              }}
            >
              {[...Array(count)].map((_, i) => (
                <div key={i} className="text-3xl animate-bounce-short" style={{ animationDelay: `${i * 0.1}s` }}>🍎</div>
              ))}
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-900">{count} Manzanas</div>
          </div>
        );

      case WorldId.MULT:
        const groups = demoState?.groups || 2;
        const items = 3;
        return (
          <div className="flex flex-col items-center">
            <p className="text-sm text-amber-800 mb-2 font-bold">Grupos de 3: {groups} x {items} = {groups * items}</p>
            <button 
               className="bg-amber-600 text-white px-3 py-1 rounded mb-2 text-xs"
               onClick={() => setDemoState({ groups: groups >= 5 ? 1 : groups + 1 })}
            >
              Añadir Grupo
            </button>
            <div className="flex gap-4 p-2">
              {[...Array(groups)].map((_, g) => (
                <div key={g} className="border-2 border-amber-400 p-1 rounded bg-amber-100 grid grid-cols-2 gap-1 w-12 justify-items-center">
                   {[...Array(items)].map((_, i) => <div key={i} className="w-3 h-3 bg-green-500 rounded-full"></div>)}
                </div>
              ))}
            </div>
          </div>
        );

      case WorldId.GEO:
        const rotation = demoState || 0;
        return (
          <div className="flex flex-col items-center perspective-500">
             <p className="text-sm text-amber-800 mb-2 font-bold">¡Toca para girar!</p>
             <div 
               className="w-24 h-24 bg-blue-500/80 border-4 border-blue-700 shadow-xl transition-transform duration-700 ease-out cursor-pointer flex items-center justify-center text-white font-bold"
               style={{ transform: `rotateY(${rotation}deg) rotateX(${rotation/2}deg)` }}
               onClick={() => setDemoState(rotation + 90)}
             >
                CUBO
             </div>
          </div>
        );

      case WorldId.TIME:
        const hour = demoState || 12;
        return (
          <div className="flex flex-col items-center">
             <div 
               className="w-32 h-32 bg-white rounded-full border-4 border-gray-600 relative cursor-pointer shadow-inner"
               onClick={() => setDemoState(hour >= 12 ? 1 : hour + 1)}
             >
                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-300">Tocame</div>
                {/* Hour Hand */}
                <div 
                  className="absolute top-1/2 left-1/2 w-1.5 h-8 bg-black origin-bottom rounded-full transition-transform duration-500"
                  style={{ transform: `translate(-50%, -100%) rotate(${hour * 30}deg)` }}
                ></div>
                {/* Minute Hand */}
                <div className="absolute top-1/2 left-1/2 w-1 h-12 bg-red-500 origin-bottom rounded-full -translate-x-1/2 -translate-y-full"></div>
             </div>
             <p className="mt-2 font-bold text-amber-900">{hour}:00</p>
          </div>
        );

      default:
        return <div className="text-4xl animate-pulse">{activePage.visualSummary}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0b00] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')] opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl h-[85vh] flex flex-col md:flex-row gap-4">
        
        {/* LEFT COLUMN: The "Spine" / Index */}
        <div className="w-full md:w-1/3 flex flex-col gap-2 relative z-20">
           <div className="flex items-center gap-3 mb-6 bg-black/40 p-3 rounded-xl backdrop-blur-sm border border-amber-900/50">
             <button onClick={onExit} className="p-2 bg-amber-100 rounded-full text-amber-900 hover:scale-110 transition shadow-lg border-2 border-amber-600">
               <ArrowLeft size={20} />
             </button>
             <h1 className="text-2xl font-bold font-fredoka text-amber-100 drop-shadow-md flex items-center gap-2">
               <BookOpen className="text-yellow-500" /> Grimorio
             </h1>
           </div>

           <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-3">
             {GRIMOIRE_PAGES.map((page, index) => {
               const unlocked = unlockedPages.includes(page.id);
               const active = activePageId === page.id;
               
               return (
                 <button
                   key={page.id}
                   onClick={() => handlePageSelect(page.id)}
                   className={`
                     w-full text-left p-4 rounded-r-xl border-l-4 transition-all duration-300 transform relative overflow-hidden group
                     ${active 
                        ? 'bg-[#fdf6e3] border-amber-600 translate-x-4 shadow-[0_0_20px_rgba(251,191,36,0.4)]' 
                        : 'bg-[#2a1a10] border-gray-700 hover:translate-x-2 hover:bg-[#3a2a20]'}
                   `}
                 >
                   <div className="flex items-center justify-between relative z-10">
                     <span className={`font-bold font-serif ${active ? 'text-amber-900' : unlocked ? 'text-amber-100/80' : 'text-gray-500'}`}>
                       Capítulo {index + 1}
                     </span>
                     {unlocked ? (
                        active ? <Star size={16} className="text-amber-600 fill-amber-600" /> : null
                     ) : (
                        <Lock size={16} className="text-gray-500" />
                     )}
                   </div>
                   <div className={`text-xs mt-1 truncate ${active ? 'text-amber-700' : 'text-gray-400'}`}>
                     {unlocked ? page.title : "????"}
                   </div>
                   
                   {/* Bookmark ribbons visual */}
                   {active && (
                     <div className="absolute right-0 top-0 w-8 h-8 bg-amber-500 rotate-45 translate-x-4 -translate-y-4"></div>
                   )}
                 </button>
               );
             })}
           </div>
        </div>

        {/* RIGHT COLUMN: The "Page" */}
        <div className="w-full md:w-2/3 relative perspective-1000">
          <div className={`
             h-full w-full rounded-l-md rounded-r-2xl shadow-2xl relative overflow-hidden transition-all duration-500
             bg-[#fdf6e3] text-amber-900
             ${!isUnlocked ? 'grayscale brightness-90' : ''}
          `}>
             {/* Paper Texture Overlay */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/old-paper.png')] opacity-60 pointer-events-none mix-blend-multiply"></div>
             
             {/* Book Crease Shadow */}
             <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/20 to-transparent pointer-events-none"></div>

             {/* Content Area */}
             <div className="relative z-10 p-8 md:p-12 h-full flex flex-col overflow-y-auto custom-scrollbar">
                
                {activePage ? (
                  <>
                    <div className="flex justify-between items-start border-b-2 border-amber-900/20 pb-4 mb-6">
                       <div>
                         <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800/60 block mb-1">
                           {isUnlocked ? "Conocimiento Arcano" : "Escritura Sellada"}
                         </span>
                         <h2 className={`text-3xl md:text-4xl font-serif font-bold ${isUnlocked ? 'text-amber-900' : 'text-gray-500 blur-[2px]'}`}>
                           {isUnlocked ? activePage.title : "Magia Bloqueada"}
                         </h2>
                       </div>
                       <div className="text-5xl opacity-20 rotate-12">
                         {isUnlocked ? '✨' : '🔒'}
                       </div>
                    </div>

                    {isUnlocked ? (
                      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Main Text */}
                        <div className="text-lg md:text-xl leading-relaxed font-serif text-amber-900/90 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-amber-700">
                          {activePage.content}
                        </div>

                        {/* Interactive Zone */}
                        <div className="bg-amber-100/50 border-2 border-dashed border-amber-300 rounded-2xl p-6 relative group">
                           <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fdf6e3] px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2 border border-amber-200 rounded-full">
                             <MousePointer2 size={12} /> Zona de Práctica
                           </div>
                           
                           <div className="flex justify-center items-center min-h-[150px]">
                              {renderInteractiveDemo()}
                           </div>
                           
                           <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition text-xs text-amber-400 flex items-center gap-1">
                             <RefreshCw size={10} /> Reiniciar
                           </div>
                        </div>

                        {/* Footer Quote */}
                        <div className="mt-auto pt-8 text-center italic text-amber-800/60 text-sm border-t border-amber-900/10">
                           "El conocimiento es la magia más poderosa de todas."
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                        <Lock size={64} className="mb-4 text-gray-400" />
                        <p className="text-xl font-serif mb-2">Este capítulo está sellado.</p>
                        <p className="text-sm max-w-xs mx-auto">
                          Debes completar el reino correspondiente para descifrar estas runas antiguas.
                        </p>
                        <div className="mt-8 text-4xl tracking-[1em] font-serif blur-sm select-none">
                          ᚠᚢᚦᚨᚱᚲ ᚺᚨᚹ
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p>Selecciona un capítulo...</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathGrimoire;
