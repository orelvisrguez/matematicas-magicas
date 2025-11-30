
import React, { useState } from 'react';
import { WORLDS } from '../constants';
import { WorldId, LevelProgress, Difficulty } from '../types';
import { Lock, Star, Map, Calculator, X, Divide, Shapes, Clock, BrainCircuit, Gem, Store, Home, Book, Sprout, Crown, Gamepad2, Scroll, Feather, Zap } from 'lucide-react';
import { audioService } from '../services/audioService';

interface WorldMapProps {
  levelProgress: Record<string, LevelProgress>;
  unlockedIndex: number;
  crystals: number;
  onSelectWorld: (id: WorldId, difficulty: Difficulty) => void;
  onNavigate: (view: 'tower' | 'shop' | 'grimoire' | 'tree' | 'minigames') => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ levelProgress, unlockedIndex, crystals, onSelectWorld, onNavigate }) => {
  const [selectedWorldId, setSelectedWorldId] = useState<WorldId | null>(null);

  const getIcon = (iconName: string, size: number) => {
    switch (iconName) {
      case 'Map': return <Map size={size} />;
      case 'Calculator': return <Calculator size={size} />;
      case 'X': return <X size={size} />;
      case 'Divide': return <Divide size={size} />;
      case 'Shapes': return <Shapes size={size} />;
      case 'Clock': return <Clock size={size} />;
      case 'BrainCircuit': return <BrainCircuit size={size} />;
      default: return <Map size={size} />;
    }
  };

  const handleWorldClick = (id: WorldId) => {
    audioService.playSFX('click');
    setSelectedWorldId(id);
  };

  const closeMissionModal = () => {
    audioService.playSFX('click');
    setSelectedWorldId(null);
  };

  const startMission = (difficulty: Difficulty) => {
    if (selectedWorldId) {
      audioService.playSFX('click');
      onSelectWorld(selectedWorldId, difficulty);
      setSelectedWorldId(null);
    }
  };

  const selectedWorld = WORLDS.find(w => w.id === selectedWorldId);

  return (
    <div className="min-h-screen bg-[url('https://picsum.photos/1920/1080?blur=5')] bg-cover bg-center bg-no-repeat bg-fixed flex flex-col">
      
      {/* Top Bar: Currency */}
      <div className="bg-white/90 backdrop-blur-md p-3 px-6 shadow-md flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-lg md:text-2xl font-bold text-purple-800 font-fredoka">
          ✨ Mapa de los Reinos
        </h1>
        <div className="flex items-center gap-2 bg-slate-900 text-cyan-400 px-4 py-1.5 rounded-full font-bold shadow-inner">
          <Gem size={18} fill="currentColor" />
          <span>{crystals}</span>
        </div>
      </div>

      {/* Main Map Area - Winding Path Layout */}
      <div className="flex-grow overflow-y-auto pb-32 pt-8 px-4 relative">
        <div className="max-w-2xl mx-auto flex flex-col items-center relative space-y-12">
          
          {/* Connecting Line (SVG Background) */}
          <svg className="absolute top-10 left-0 w-full h-[90%] -z-0 pointer-events-none opacity-40" preserveAspectRatio="none">
             {/* Simple dashed line connecting centers approximately */}
             <path 
               d="M 50% 0 L 50% 100%" 
               stroke="white" 
               strokeWidth="8" 
               strokeDasharray="15, 15"
               fill="none" 
             />
          </svg>

          {WORLDS.map((world, index) => {
            const isUnlocked = index <= unlockedIndex;
            const isNext = index === unlockedIndex;
            const progress = levelProgress[world.id];
            const stars = progress ? progress.stars : 0;
            const progressPercent = (stars / 3) * 100;

            // Alternating alignment for a "Path" feel
            const alignment = index % 2 === 0 ? 'md:translate-x-12' : 'md:-translate-x-12';
            
            return (
              <div 
                key={world.id}
                onClick={() => isUnlocked ? handleWorldClick(world.id) : null}
                className={`
                  relative z-10 w-full max-w-xs md:max-w-sm group cursor-pointer transition-all duration-300 transform
                  ${isUnlocked ? 'hover:scale-105' : 'cursor-not-allowed'}
                  ${alignment}
                `}
              >
                {/* Card Container */}
                <div className={`
                  rounded-3xl p-4 border-b-8 shadow-xl flex flex-col items-center text-center relative
                  ${isUnlocked 
                    ? `bg-white border-purple-200` 
                    : 'bg-gray-200 border-gray-400 grayscale opacity-80'}
                `}>
                  
                  {/* Floating Badge for Next Level */}
                  {isNext && (
                    <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full animate-bounce text-sm shadow-md z-20 border-2 border-white">
                      ¡Tu Misión!
                    </div>
                  )}

                  {/* Icon Circle */}
                  <div className={`
                    w-20 h-20 rounded-full flex items-center justify-center -mt-10 mb-2 text-white text-3xl shadow-lg border-4 border-white
                    ${isUnlocked ? world.color : 'bg-gray-500'}
                  `}>
                    {isUnlocked ? getIcon(world.icon, 36) : <Lock size={28} />}
                  </div>

                  {/* Title & Description */}
                  <h3 className={`text-lg font-bold leading-tight ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                    {world.title}
                  </h3>
                  
                  {/* Kingdom Progress Bar */}
                  {isUnlocked && (
                    <div className="w-full mt-3">
                      <div className="flex justify-between items-end mb-1 px-1">
                         <div className="flex space-x-0.5">
                           {[1, 2, 3].map(s => (
                             <Star 
                                key={s} 
                                size={14} 
                                className={`${s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                           ))}
                         </div>
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                           {progressPercent.toFixed(0)}% Dominado
                         </span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                        <div 
                          className={`h-full ${world.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {!isUnlocked && (
                    <div className="mt-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Bloqueado
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mission Briefing Modal */}
      {selectedWorld && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl p-6 max-w-lg w-full relative shadow-2xl border-4 border-purple-300">
              <button 
                onClick={closeMissionModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={28} />
              </button>

              <h2 className="text-2xl font-bold text-purple-900 mb-1 font-fredoka text-center">
                 {selectedWorld.title}
              </h2>
              
              {/* Story Plot Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 relative mt-4 shadow-sm">
                 <div className="absolute -top-3 left-4 bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-bold uppercase rounded border border-amber-300 flex items-center gap-1">
                   <Scroll size={12} /> La Misión
                 </div>
                 <p className="text-amber-900 text-sm leading-relaxed italic mt-1">
                   "{selectedWorld.storyPlot}"
                 </p>
              </div>

              <div className="grid gap-4">
                 {/* Easy - Aprendiz */}
                 <div 
                   onClick={() => startMission('easy')}
                   className="group relative flex items-center gap-4 p-4 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                 >
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform">
                      <Feather size={28} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg text-emerald-800">Aprendiz</h3>
                      <p className="text-xs font-medium text-emerald-600">Entrenamiento básico y repaso.</p>
                    </div>
                    <div className="flex flex-col items-end">
                         <span className="text-[10px] font-bold uppercase text-emerald-400 mb-1">Recompensa</span>
                         <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                             <span className="text-sm font-bold text-emerald-700">x0.5</span>
                             <Gem size={14} className="text-emerald-400" fill="currentColor" />
                         </div>
                    </div>
                 </div>

                 {/* Normal - Mago */}
                 <div 
                   onClick={() => startMission('normal')}
                   className="group relative flex items-center gap-4 p-4 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                 >
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                      <Zap size={28} fill="currentColor" className="text-yellow-400 stroke-blue-600" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg text-blue-800">Mago</h3>
                      <p className="text-xs font-medium text-blue-600">La aventura estándar.</p>
                    </div>
                    <div className="flex flex-col items-end">
                         <span className="text-[10px] font-bold uppercase text-blue-400 mb-1">Recompensa</span>
                         <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-blue-100 shadow-sm">
                             <span className="text-sm font-bold text-blue-700">x1.0</span>
                             <Gem size={14} className="text-cyan-400" fill="currentColor" />
                         </div>
                    </div>
                 </div>

                 {/* Hard - Archimago */}
                 {(() => {
                   const progress = levelProgress[selectedWorld.id];
                   const normalCompleted = progress?.completedDifficulties?.includes('normal');
                   // Allow access if stars > 0 (backward compatibility) or normal completed
                   const isLocked = !normalCompleted && (!progress || progress.stars === 0);

                   return (
                     <div 
                       onClick={() => !isLocked && startMission('hard')}
                       className={`
                         group relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden
                         ${isLocked 
                           ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed grayscale' 
                           : 'border-purple-300 bg-gradient-to-br from-purple-50 to-fuchsia-50 hover:from-purple-100 hover:to-fuchsia-100 hover:border-purple-400 hover:shadow-xl hover:-translate-y-1 cursor-pointer'}
                       `}
                     >
                        {!isLocked && <div className="absolute top-0 right-0 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>}

                        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm z-10 transition-transform group-hover:scale-110 ${isLocked ? 'bg-gray-200 text-gray-400' : 'bg-white text-purple-600'}`}>
                          {isLocked ? <Lock size={24} /> : <Crown size={28} fill="#fbbf24" className="text-purple-600" />}
                        </div>
                        <div className="flex-grow z-10">
                          <h3 className={`font-bold text-lg ${isLocked ? 'text-gray-500' : 'text-purple-900'}`}>Archimago</h3>
                          <p className={`text-xs font-medium ${isLocked ? 'text-gray-400' : 'text-purple-700'}`}>
                             {isLocked ? 'Completa el modo Mago primero.' : 'Desafío extremo para expertos.'}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end z-10">
                             <span className={`text-[10px] font-bold uppercase mb-1 ${isLocked ? 'text-gray-300' : 'text-purple-400'}`}>Recompensa</span>
                             <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm ${isLocked ? 'bg-gray-100 border-gray-200' : 'bg-white border-purple-100'}`}>
                                 <span className={`text-sm font-bold ${isLocked ? 'text-gray-400' : 'text-purple-700'}`}>x2.0</span>
                                 <Gem size={14} className={isLocked ? 'text-gray-400' : 'text-cyan-400'} fill={isLocked ? "none" : "currentColor"} />
                             </div>
                        </div>
                     </div>
                   );
                 })()}
              </div>
           </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="bg-white border-t-2 border-purple-200 p-2 pb-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] sticky bottom-0 z-20">
        <div className="max-w-lg mx-auto flex justify-around">
          <NavButton icon={<Home size={22} />} label="Torre" onClick={() => onNavigate('tower')} />
          <NavButton icon={<Store size={22} />} label="Tienda" onClick={() => onNavigate('shop')} />
          
          {/* Main Action Button (Map) - Active State */}
          <div className="relative -top-6">
             <button 
               className="bg-purple-600 text-white p-4 rounded-full shadow-lg border-4 border-white hover:scale-105 transition active:scale-95"
               onClick={() => {}} // Already on map
             >
               <Map size={28} />
             </button>
          </div>

          <NavButton icon={<Gamepad2 size={22} />} label="Juegos" onClick={() => onNavigate('minigames')} />
          <NavButton icon={<Book size={22} />} label="Grimorio" onClick={() => onNavigate('grimoire')} />
          <NavButton icon={<Sprout size={22} />} label="Árbol" onClick={() => onNavigate('tree')} />
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center text-gray-400 hover:text-purple-600 transition p-2 w-16"
  >
    <div className="mb-0.5">
      {icon}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
  </button>
);

export default WorldMap;
