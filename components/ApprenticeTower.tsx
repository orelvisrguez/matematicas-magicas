
import React, { useState } from 'react';
import { GameState, Race } from '../types';
import { STORE_ITEMS, RACES, WORLDS, ACHIEVEMENTS } from '../constants';
import { ArrowLeft, User, Home, Trophy, Sparkles, Medal, Lock, Wand2 } from 'lucide-react';
import { audioService } from '../services/audioService';

interface ApprenticeTowerProps {
  state: GameState;
  onEquip: (type: 'hat' | 'wand' | 'pet' | 'furniture' | 'outfit', id: string) => void;
  onUpdateAvatar: (race: Race, skinColor: string) => void;
  onExit: () => void;
}

const ApprenticeTower: React.FC<ApprenticeTowerProps> = ({ state, onEquip, onUpdateAvatar, onExit }) => {
  const [activeTab, setActiveTab] = useState<'avatar' | 'room' | 'trophies'>('avatar');

  const ownedItems = STORE_ITEMS.filter(item => state.inventory.includes(item.id) || item.cost === 0);
  
  const getEquippedIcon = (type: 'hat' | 'wand' | 'pet' | 'outfit') => {
    const id = state.equipped[type];
    if (!id) return null;
    return STORE_ITEMS.find(i => i.id === id)?.icon;
  };

  const raceConfig = RACES.find(r => r.id === state.avatar.race) || RACES[0];

  const handleTabChange = (tab: 'avatar' | 'room' | 'trophies') => {
    audioService.playSFX('click');
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#1e1b4b] p-4 text-white overflow-y-auto font-fredoka">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-indigo-900/50 p-4 rounded-3xl border border-indigo-700 backdrop-blur-sm">
          <div className="flex items-center gap-4 w-full md:w-auto">
             <button onClick={onExit} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition hover:scale-105 active:scale-95">
               <ArrowLeft />
             </button>
             <div>
                <h1 className="text-2xl md:text-3xl font-bold text-yellow-300 flex items-center gap-2">
                  🏰 Torre del Aprendiz
                </h1>
                <p className="text-indigo-300 text-sm">Tu santuario personal</p>
             </div>
          </div>
          
          {/* Tabs */}
          <div className="flex bg-black/30 p-1.5 rounded-2xl w-full md:w-auto justify-between md:justify-start">
             {[
                { id: 'avatar', icon: <User size={20} />, label: 'Espejo' },
                { id: 'room', icon: <Home size={20} />, label: 'Habitación' },
                { id: 'trophies', icon: <Trophy size={20} />, label: 'Logros' },
             ].map((tab) => (
               <button 
                 key={tab.id}
                 onClick={() => handleTabChange(tab.id as any)}
                 className={`
                   px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all flex-1 md:flex-none justify-center
                   ${activeTab === tab.id 
                     ? 'bg-purple-600 shadow-lg shadow-purple-900/50 text-white transform scale-105' 
                     : 'text-indigo-300 hover:bg-white/5 hover:text-white'}
                 `}
               >
                 {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
               </button>
             ))}
          </div>
        </div>

        {/* --- TAB CONTENT: AVATAR (MAGIC MIRROR) --- */}
        {activeTab === 'avatar' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             
             {/* Left: The Magic Mirror (Preview) */}
             <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative w-full max-w-md aspect-[3/4] rounded-[40px] border-[12px] border-yellow-600 shadow-2xl bg-black overflow-hidden group">
                    {/* Mirror Frame Details */}
                    <div className="absolute top-0 left-0 w-full h-full border-[4px] border-yellow-400 rounded-[28px] pointer-events-none z-50 opacity-50"></div>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-12 bg-yellow-600 rounded-b-full z-50 flex items-center justify-center border-b-4 border-yellow-400">
                        <Sparkles className="text-yellow-200 animate-pulse" size={24} />
                    </div>

                    {/* Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>
                    
                    {/* Magic Aura */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>

                    {/* --- AVATAR COMPOSITION --- */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-[1.8] md:scale-[2.2] flex flex-col items-center justify-center animate-float">
                        <style>{`
                          @keyframes float {
                            0%, 100% { transform: translate(-50%, -50%) translateY(0px) scale(2.2); }
                            50% { transform: translate(-50%, -50%) translateY(-10px) scale(2.2); }
                          }
                          .animate-float { animation: float 6s ease-in-out infinite; }
                        `}</style>

                        {/* Relative Container for stacking */}
                        <div className="relative w-32 h-40 flex items-center justify-center">
                            
                            {/* 1. Wand (Back/Side Layer) */}
                            <div className="absolute top-10 -right-12 text-6xl transform rotate-12 z-20 filter drop-shadow-lg transition-all duration-300">
                               {getEquippedIcon('wand')}
                            </div>

                            {/* 2. Outfit (Body Layer) - Acts as the base */}
                            <div className="absolute top-14 left-1/2 -translate-x-1/2 text-8xl z-10 filter drop-shadow-xl">
                               {getEquippedIcon('outfit')}
                            </div>

                            {/* 3. Race/Head (Middle Layer) */}
                            <div 
                              className="absolute top-0 left-1/2 -translate-x-1/2 text-7xl z-20 filter drop-shadow-md transition-all duration-300"
                              style={{ filter: state.avatar.skinColor !== 'none' ? `sepia(1) hue-rotate(${state.avatar.skinColor})` : 'none' }}
                            >
                              {raceConfig.emoji}
                            </div>

                            {/* 4. Hat (Top Layer) */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-7xl z-30 filter drop-shadow-2xl transition-all duration-300 hover:-translate-y-1">
                               {getEquippedIcon('hat')}
                            </div>

                            {/* 5. Pet (Floor Layer) */}
                            <div className="absolute bottom-[-20px] -left-14 text-5xl z-30 filter drop-shadow-lg transform scale-x-[-1]">
                               {getEquippedIcon('pet')}
                            </div>
                        </div>
                    </div>

                    {/* Name Tag */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-center w-3/4">
                       <h2 className="font-bold text-lg text-yellow-300">
                         {raceConfig.name} {state.avatar.skinColor !== 'none' ? 'Místico' : ''}
                       </h2>
                       <div className="text-xs text-indigo-300 uppercase tracking-widest font-bold">Nivel {state.unlockedLevelIndex + 1}</div>
                    </div>
                </div>
             </div>

             {/* Right: The Wardrobe (Controls) */}
             <div className="lg:col-span-7 bg-white/5 rounded-[40px] p-6 border border-white/10 flex flex-col gap-6 h-full">
                
                {/* Race & Skin Section */}
                <div className="bg-black/20 p-4 rounded-3xl">
                   <h3 className="text-sm uppercase tracking-wider text-indigo-300 font-bold mb-3 flex items-center gap-2">
                     <User size={16} /> Identidad
                   </h3>
                   <div className="flex flex-wrap gap-4 items-center">
                      <div className="flex bg-black/40 p-1 rounded-xl">
                        {RACES.map(race => (
                          <button
                            key={race.id}
                            onClick={() => onUpdateAvatar(race.id, state.avatar.skinColor)}
                            className={`
                              px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2
                              ${state.avatar.race === race.id 
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : 'text-gray-400 hover:text-white'}
                            `}
                          >
                            <span className="text-xl">{race.emoji}</span>
                          </button>
                        ))}
                      </div>
                      
                      <div className="w-px h-8 bg-white/10 hidden sm:block"></div>

                      <div className="flex gap-2">
                          {[
                            { id: 'none', color: '#fca5a5', label: 'Natural' }, // Using a generic skin tone color for preview
                            { id: '90deg', color: '#4ade80', label: 'Bosque' }, 
                            { id: '180deg', color: '#60a5fa', label: 'Hielo' }, 
                            { id: '270deg', color: '#c084fc', label: 'Vacío' }, 
                          ].map(tone => (
                            <button
                              key={tone.id}
                              onClick={() => onUpdateAvatar(state.avatar.race, tone.id)}
                              className={`
                                w-8 h-8 rounded-full border-2 transition-transform hover:scale-110
                                ${state.avatar.skinColor === tone.id ? 'border-white ring-2 ring-indigo-500 scale-110' : 'border-transparent opacity-70'}
                              `}
                              style={{ backgroundColor: tone.color }}
                              title={tone.label}
                            />
                          ))}
                      </div>
                   </div>
                </div>

                {/* Inventory Grid */}
                <div className="flex-grow flex flex-col">
                   <h3 className="text-sm uppercase tracking-wider text-indigo-300 font-bold mb-3 flex items-center gap-2">
                     <Wand2 size={16} /> Equipamiento
                   </h3>
                   
                   <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-6">
                      {[
                        { id: 'hat', label: 'Sombreros' },
                        { id: 'outfit', label: 'Trajes' },
                        { id: 'wand', label: 'Varitas' },
                        { id: 'pet', label: 'Compañeros' }
                      ].map(cat => (
                         <div key={cat.id} className="bg-black/20 rounded-2xl p-4">
                            <h4 className="text-xs font-bold text-indigo-200 mb-3 uppercase opacity-70">{cat.label}</h4>
                            <div className="flex flex-wrap gap-3">
                               {ownedItems.filter(i => i.type === cat.id).map(item => {
                                  const isEquipped = state.equipped[cat.id as any] === item.id;
                                  return (
                                    <button
                                      key={item.id}
                                      onClick={() => onEquip(item.type as any, item.id)}
                                      className={`
                                        w-16 h-16 rounded-xl flex items-center justify-center text-3xl border-2 transition-all relative group
                                        ${isEquipped
                                          ? 'bg-gradient-to-br from-purple-600 to-indigo-600 border-yellow-400 shadow-lg scale-105' 
                                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'}
                                      `}
                                      title={item.name}
                                    >
                                      <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                                      {isEquipped && (
                                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full p-0.5 border border-white">
                                          <Sparkles size={12} fill="currentColor" />
                                        </div>
                                      )}
                                    </button>
                                  );
                               })}
                               {ownedItems.filter(i => i.type === cat.id).length === 0 && (
                                 <div className="text-sm text-gray-500 italic py-2">Nada por aquí... ¡Visita la tienda!</div>
                               )}
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- TAB CONTENT: ROOM (THE TOWER) --- */}
        {activeTab === 'room' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Room Visual Scene */}
              <div className="md:col-span-2 relative h-[500px] rounded-[40px] overflow-hidden border-8 border-stone-800 shadow-2xl bg-stone-900 group">
                 
                 {/* 1. Wall Texture */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brick-wall-dark.png')] opacity-50"></div>
                 
                 {/* 2. The Window (Background Sky) */}
                 <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-64 bg-slate-900 rounded-t-full border-8 border-stone-700 overflow-hidden shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-purple-800"></div>
                    <div className="absolute top-4 right-4 text-yellow-100 text-4xl opacity-80 animate-pulse">🌙</div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 animate-pulse"></div>
                    {/* Clouds */}
                    <div className="absolute top-10 -left-10 text-white/10 text-6xl">☁️</div>
                 </div>

                 {/* 3. The Floor */}
                 <div className="absolute bottom-0 w-full h-40 bg-[#3d2918] border-t-4 border-[#2a1d12] shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-30"></div>
                    {/* Rug Area (implied by placement) */}
                 </div>

                 {/* 4. Furniture Placement Grid */}
                 <div className="absolute inset-0 z-10 p-8">
                    {/* Hanging/Wall Items Area */}
                    <div className="h-1/2 w-full flex justify-between items-start px-8">
                        {state.equipped.furniture.filter((_, i) => i % 2 === 0).map((id, i) => { // Crude way to split wall/floor items for visual variety
                           const item = STORE_ITEMS.find(it => it.id === id);
                           return item ? (
                             <div key={id} className="text-6xl filter drop-shadow-xl animate-bounce-short" style={{ animationDelay: `${i*0.5}s` }}>
                               {item.icon}
                             </div>
                           ) : null;
                        })}
                    </div>
                    {/* Floor Items Area */}
                    <div className="h-1/2 w-full flex justify-around items-end pb-4">
                        {state.equipped.furniture.filter((_, i) => i % 2 !== 0).map((id, i) => {
                           const item = STORE_ITEMS.find(it => it.id === id);
                           return item ? (
                             <div key={id} className="text-7xl filter drop-shadow-2xl transform hover:scale-110 transition cursor-pointer">
                               {item.icon}
                             </div>
                           ) : null;
                        })}
                    </div>
                 </div>

                 {/* 5. Mini Avatar Presence */}
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 transform scale-75 group-hover:scale-90 transition-transform duration-500">
                    <div className="relative">
                       <div className="text-8xl filter drop-shadow-2xl">{raceConfig.emoji}</div>
                       <div className="absolute -top-8 left-0 text-7xl">{getEquippedIcon('hat')}</div>
                       <div className="absolute top-8 left-0 text-7xl">{getEquippedIcon('outfit')}</div>
                    </div>
                 </div>
                 
                 {/* Lighting Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none"></div>
              </div>

              {/* Furniture Inventory */}
              <div className="bg-stone-900/80 backdrop-blur rounded-[30px] p-6 h-full flex flex-col border border-stone-700">
                 <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-stone-300 uppercase tracking-wider">
                   <Home size={18} /> Decoración
                 </h3>
                 <div className="bg-black/30 p-3 rounded-xl mb-4 text-xs text-stone-400 text-center">
                   Toca los objetos para colocarlos en tu torre.
                 </div>
                 
                 <div className="grid grid-cols-3 gap-3 overflow-y-auto custom-scrollbar pr-1">
                    {ownedItems.filter(i => i.type === 'furniture').map(item => {
                       const isPlaced = state.equipped.furniture.includes(item.id);
                       return (
                         <button
                           key={item.id}
                           onClick={() => onEquip('furniture', item.id)}
                           className={`
                             aspect-square rounded-xl flex items-center justify-center text-4xl border-2 transition-all relative
                             ${isPlaced 
                               ? 'bg-amber-900/50 border-amber-500 shadow-inner' 
                               : 'bg-white/5 border-white/10 hover:bg-white/10'}
                           `}
                         >
                           {item.icon}
                           {isPlaced && (
                             <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-black"></div>
                           )}
                         </button>
                       );
                    })}
                 </div>
              </div>
           </div>
        )}

        {/* --- TAB CONTENT: TROPHIES --- */}
        {activeTab === 'trophies' && (
           <div className="animate-in fade-in zoom-in duration-500 pb-12">
              {/* Crystals Vault */}
              <div className="bg-gradient-to-r from-cyan-900 to-blue-900 rounded-3xl p-8 mb-8 flex items-center justify-between border-4 border-cyan-500/30 shadow-2xl relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-10"></div>
                 <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-cyan-300 font-fredoka">Bóveda de Cristal</h2>
                    <p className="text-cyan-100/70">Tus riquezas mágicas acumuladas.</p>
                 </div>
                 <div className="text-6xl font-bold flex items-center gap-3 text-white drop-shadow-md">
                    {state.crystals} <span className="text-5xl animate-bounce-short">💎</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* World Trophies Column */}
                <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                   <h3 className="text-xl font-bold text-yellow-300 mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                      <Trophy className="text-yellow-500" /> Trofeos de Reino
                   </h3>
                   <div className="grid grid-cols-2 gap-4">
                      {WORLDS.map(world => {
                          const progress = state.levelProgress[world.id];
                          const isCompleted = progress?.completed;
                          const stars = progress?.stars || 0;
                          
                          return (
                            <div 
                              key={world.id} 
                              className={`
                                rounded-2xl p-4 flex flex-col items-center text-center border-2 transition-transform hover:scale-105
                                ${isCompleted ? 'bg-indigo-900/80 border-yellow-500/50' : 'bg-black/20 border-white/5 opacity-50'}
                              `}
                            >
                              <div className={`
                                w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3
                                ${isCompleted ? 'bg-yellow-500/20 text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'bg-black/30 text-gray-600'}
                              `}>
                                  {isCompleted ? <Trophy size={28} /> : <Lock size={20} />}
                              </div>
                              <h3 className="font-bold text-xs mb-2 text-gray-200 uppercase tracking-wide">{world.title}</h3>
                              <div className="flex gap-1 justify-center h-4 bg-black/20 px-2 py-0.5 rounded-full">
                                  {[1,2,3].map(s => (
                                    <span key={s} className={`text-xs ${s <= stars ? 'grayscale-0 opacity-100' : 'grayscale opacity-30'}`}>
                                      ⭐
                                    </span>
                                  ))}
                              </div>
                            </div>
                          );
                      })}
                   </div>
                </div>

                {/* Achievements Medals Column */}
                <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-yellow-300 mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                     <Medal className="text-orange-400" /> Medallas de Honor
                  </h3>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                     {ACHIEVEMENTS.map(ach => {
                        const isUnlocked = state.unlockedAchievements.includes(ach.id);
                        return (
                           <div 
                             key={ach.id}
                             className={`
                               flex items-center gap-4 p-4 rounded-2xl border-2 transition-all
                               ${isUnlocked 
                                 ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-yellow-500/30 shadow-lg' 
                                 : 'bg-black/20 border-transparent opacity-60'}
                             `}
                           >
                              <div className={`
                                 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg flex-shrink-0
                                 ${isUnlocked ? ach.color : 'bg-gray-800 text-gray-600'}
                              `}>
                                 {isUnlocked ? ach.icon : <Lock size={16} />}
                              </div>
                              <div>
                                 <h4 className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                                   {ach.title}
                                 </h4>
                                 <p className="text-xs text-gray-400 leading-tight mt-1">
                                   {ach.description}
                                 </p>
                              </div>
                           </div>
                        );
                     })}
                  </div>
                </div>

              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default ApprenticeTower;
