
import React, { useState } from 'react';
import { GameState, Race } from '../types';
import { STORE_ITEMS, RACES, WORLDS, ACHIEVEMENTS } from '../constants';
import { ArrowLeft, User, Home, Trophy, Sparkles, Medal, Lock } from 'lucide-react';

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

  const categoryLabels: Record<string, string> = {
    hat: 'Sombreros',
    outfit: 'Trajes',
    wand: 'Varitas',
    pet: 'Mascotas'
  };

  return (
    <div className="min-h-screen bg-indigo-950 p-4 text-white overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
             <button onClick={onExit} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
               <ArrowLeft />
             </button>
             <h1 className="text-2xl md:text-3xl font-bold font-fredoka text-yellow-300">🏰 Torre del Aprendiz</h1>
          </div>
          
          {/* Tabs */}
          <div className="flex bg-indigo-900 p-1 rounded-xl">
             <button 
               onClick={() => setActiveTab('avatar')}
               className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${activeTab === 'avatar' ? 'bg-purple-600 shadow-md' : 'hover:bg-indigo-800'}`}
             >
               <User size={18} /> <span className="hidden md:inline">Avatar</span>
             </button>
             <button 
               onClick={() => setActiveTab('room')}
               className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${activeTab === 'room' ? 'bg-purple-600 shadow-md' : 'hover:bg-indigo-800'}`}
             >
               <Home size={18} /> <span className="hidden md:inline">Habitación</span>
             </button>
             <button 
               onClick={() => setActiveTab('trophies')}
               className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${activeTab === 'trophies' ? 'bg-purple-600 shadow-md' : 'hover:bg-indigo-800'}`}
             >
               <Trophy size={18} /> <span className="hidden md:inline">Trofeos</span>
             </button>
          </div>
        </div>

        {/* --- TAB CONTENT: AVATAR --- */}
        {activeTab === 'avatar' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             
             {/* Left: Preview */}
             <div className="bg-gray-800 rounded-3xl p-8 border-4 border-purple-500 relative flex flex-col items-center justify-center min-h-[400px] shadow-2xl overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Avatar Composition */}
                <div className="relative transform scale-150 md:scale-[2] mt-12 mb-8">
                    {/* Hat (Top Layer) */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 text-7xl animate-bounce-short drop-shadow-lg">
                       {getEquippedIcon('hat')}
                    </div>

                    {/* Race Base (Middle Layer) */}
                    <div 
                      className="text-8xl relative z-20 transition-all drop-shadow-xl"
                      style={{ filter: state.avatar.skinColor !== 'none' ? `sepia(1) hue-rotate(${state.avatar.skinColor})` : 'none' }}
                    >
                      {raceConfig.emoji}
                    </div>

                    {/* Outfit (Bottom Layer - Acting as Body) */}
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 text-7xl drop-shadow-md">
                       {getEquippedIcon('outfit')}
                    </div>

                    {/* Wand (Side) */}
                    <div className="absolute top-8 -right-14 z-20 text-6xl transform rotate-12 origin-bottom-left filter drop-shadow-lg">
                       {getEquippedIcon('wand')}
                    </div>

                    {/* Pet (Floor Side) */}
                    <div className="absolute bottom-0 -left-20 z-20 text-5xl filter drop-shadow-md">
                       {getEquippedIcon('pet')}
                    </div>
                </div>

                <div className="absolute bottom-6 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full text-center z-40">
                   <h2 className="font-bold text-xl text-yellow-300">Aprendiz {state.avatar.race === 'human' ? 'Humano' : state.avatar.race === 'elf' ? 'Elfo' : 'Duende'}</h2>
                   <div className="flex justify-center gap-1 mt-1">
                      {[...Array(Object.keys(state.levelProgress).length)].map((_,i) => <span key={i}>⭐</span>)}
                   </div>
                </div>
             </div>

             {/* Right: Controls */}
             <div className="bg-white/10 rounded-3xl p-6 backdrop-blur-md h-full flex flex-col gap-6">
                
                {/* Race Selector */}
                <div>
                   <h3 className="text-xs uppercase tracking-wider text-indigo-300 font-bold mb-3">Raza</h3>
                   <div className="flex gap-4">
                      {RACES.map(race => (
                        <button
                          key={race.id}
                          onClick={() => onUpdateAvatar(race.id, state.avatar.skinColor)}
                          className={`
                            flex-1 py-3 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-1
                            ${state.avatar.race === race.id 
                              ? 'bg-purple-600 border-purple-400 shadow-lg scale-105' 
                              : 'bg-white/10 border-white/20 hover:bg-white/20'}
                          `}
                        >
                          <span className="text-2xl">{race.emoji}</span>
                          <span className="text-xs">{race.name}</span>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Skin Tone Selector (Simple Filters) */}
                <div>
                   <h3 className="text-xs uppercase tracking-wider text-indigo-300 font-bold mb-3">Tono Mágico</h3>
                   <div className="flex gap-3">
                      {[
                        { id: 'none', color: '#ecc', label: 'Natural' },
                        { id: '90deg', color: '#88cc88', label: 'Bosque' }, // Greenish
                        { id: '180deg', color: '#88cccc', label: 'Hielo' }, // Blueish
                        { id: '270deg', color: '#cc88cc', label: 'Vacío' }, // Purpleish
                      ].map(tone => (
                         <button
                           key={tone.id}
                           onClick={() => onUpdateAvatar(state.avatar.race, tone.id)}
                           className={`w-10 h-10 rounded-full border-2 ${state.avatar.skinColor === tone.id ? 'border-white ring-2 ring-purple-500' : 'border-transparent'}`}
                           style={{ backgroundColor: tone.color }}
                           title={tone.label}
                         />
                      ))}
                   </div>
                </div>

                {/* Inventory Grid */}
                <div className="flex-grow">
                   <h3 className="text-xs uppercase tracking-wider text-indigo-300 font-bold mb-3">Equipamiento</h3>
                   <div className="bg-black/20 rounded-xl p-4 h-64 overflow-y-auto custom-scrollbar">
                      {['hat', 'outfit', 'wand', 'pet'].map(cat => (
                         <div key={cat} className="mb-4">
                            <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase">{categoryLabels[cat] || cat}</h4>
                            <div className="flex flex-wrap gap-2">
                               {ownedItems.filter(i => i.type === cat).map(item => (
                                  <button
                                    key={item.id}
                                    onClick={() => onEquip(item.type as any, item.id)}
                                    className={`
                                      w-12 h-12 rounded-lg flex items-center justify-center text-2xl border transition-all
                                      ${state.equipped[cat as 'hat'|'outfit'|'wand'|'pet'] === item.id 
                                        ? 'bg-yellow-500 border-yellow-300 shadow-md' 
                                        : 'bg-white/10 border-white/10 hover:bg-white/20'}
                                    `}
                                    title={item.name}
                                  >
                                    {item.icon}
                                  </button>
                               ))}
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- TAB CONTENT: ROOM --- */}
        {activeTab === 'room' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Room Visual */}
              <div className="md:col-span-2 bg-amber-900/50 rounded-3xl border-8 border-stone-800 relative h-[500px] shadow-inner overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]">
                 {/* Floor */}
                 <div className="absolute bottom-0 w-full h-32 bg-amber-950/80 skew-x-12 origin-bottom"></div>
                 
                 {/* Placed Furniture Grid (Simple Visual) */}
                 <div className="absolute inset-0 p-8 flex flex-wrap content-end gap-4 pointer-events-none">
                    {state.equipped.furniture.map((id, index) => {
                       const item = STORE_ITEMS.find(i => i.id === id);
                       if(!item) return null;
                       return (
                         <div key={`${id}-${index}`} className="relative group animate-bounce-short" style={{ animationDelay: `${index * 0.2}s` }}>
                            <div className="text-6xl md:text-8xl drop-shadow-2xl">{item.icon}</div>
                         </div>
                       );
                    })}
                 </div>

                 {/* Avatar in Room (Mini) */}
                 <div className="absolute bottom-10 right-10 transform scale-100 opacity-90">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 text-4xl">{getEquippedIcon('hat')}</div>
                    <div className="text-5xl relative z-20">{raceConfig.emoji}</div>
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 text-4xl">{getEquippedIcon('outfit')}</div>
                 </div>
              </div>

              {/* Furniture Inventory */}
              <div className="bg-stone-800 rounded-3xl p-6 h-full flex flex-col">
                 <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                   <Home size={20} className="text-orange-400" /> Decoración
                 </h3>
                 <p className="text-sm text-gray-400 mb-4">Toca para colocar o quitar muebles de tu torre.</p>
                 
                 <div className="grid grid-cols-3 gap-3">
                    {ownedItems.filter(i => i.type === 'furniture').map(item => {
                       const isPlaced = state.equipped.furniture.includes(item.id);
                       return (
                         <button
                           key={item.id}
                           onClick={() => onEquip('furniture', item.id)}
                           className={`
                             aspect-square rounded-xl flex items-center justify-center text-3xl border-2 transition-all
                             ${isPlaced 
                               ? 'bg-orange-600 border-orange-400 shadow-inner' 
                               : 'bg-white/10 border-white/20 hover:bg-white/20'}
                           `}
                         >
                           {item.icon}
                           {isPlaced && <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>}
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
              <div className="bg-gradient-to-r from-cyan-900 to-blue-900 rounded-2xl p-8 mb-8 flex items-center justify-between border-2 border-cyan-500 shadow-lg shadow-cyan-500/20">
                 <div>
                    <h2 className="text-2xl font-bold text-cyan-300">Bóveda de Cristal</h2>
                    <p className="text-cyan-100">Tus riquezas mágicas acumuladas.</p>
                 </div>
                 <div className="text-5xl font-bold flex items-center gap-2 text-white">
                    {state.crystals} <span className="text-4xl">💎</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* World Trophies Column */}
                <div>
                   <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
                      <Trophy /> Trofeos de Mundo
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
                                ${isCompleted ? 'bg-indigo-800 border-yellow-500' : 'bg-gray-800 border-gray-700 opacity-50'}
                              `}
                            >
                              <div className={`
                                w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3
                                ${isCompleted ? 'bg-yellow-500/20 text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'bg-black/30 text-gray-600'}
                              `}>
                                  {isCompleted ? <Trophy size={28} /> : <Lock size={20} />}
                              </div>
                              <h3 className="font-bold text-xs mb-1 text-gray-200">{world.title}</h3>
                              <div className="flex gap-1 justify-center h-4">
                                  {[1,2,3].map(s => (
                                    <span key={s} className={`text-xs ${s <= stars ? 'grayscale-0' : 'grayscale text-gray-600'}`}>
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
                <div>
                  <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
                     <Medal /> Medallas de Honor
                  </h3>
                  <div className="space-y-4">
                     {ACHIEVEMENTS.map(ach => {
                        const isUnlocked = state.unlockedAchievements.includes(ach.id);
                        return (
                           <div 
                             key={ach.id}
                             className={`
                               flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                               ${isUnlocked 
                                 ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-yellow-500/50' 
                                 : 'bg-gray-900 border-gray-800 opacity-60'}
                             `}
                           >
                              <div className={`
                                 w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-lg flex-shrink-0
                                 ${isUnlocked ? ach.color : 'bg-gray-800 text-gray-600'}
                              `}>
                                 {isUnlocked ? ach.icon : <Lock size={20} />}
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
