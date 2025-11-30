import React, { useState, useEffect } from 'react';
import WorldMap from './components/WorldMap';
import GameLevel from './components/GameLevel';
import MagicShop from './components/MagicShop';
import ApprenticeTower from './components/ApprenticeTower';
import MathGrimoire from './components/MathGrimoire';
import SkillTree from './components/SkillTree';
import MiniGamesHub from './components/MiniGamesHub';
import { GameState, WorldId, Difficulty, Race, Achievement } from './types';
import { WORLDS, GRIMOIRE_PAGES, ACHIEVEMENTS } from './constants';
import { Sparkles, Star, Gem, BookOpen, Scroll, Medal, Volume2, VolumeX } from 'lucide-react';
import { audioService } from './services/audioService';

type ViewState = 'map' | 'game' | 'shop' | 'tower' | 'grimoire' | 'tree' | 'minigames';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('mm_gamestate_v4'); // Incremented version to v4
    if (saved) return JSON.parse(saved);
    
    return {
      unlockedLevelIndex: 0,
      currentWorldId: null,
      score: 0,
      crystals: 0,
      levelProgress: {},
      inventory: ['hat_novice', 'wand_wood', 'outfit_novice'],
      avatar: {
        race: 'human',
        skinColor: 'none'
      },
      equipped: { 
        hat: 'hat_novice', 
        wand: 'wand_wood', 
        outfit: 'outfit_novice',
        pet: null, 
        furniture: [] 
      },
      unlockedGrimoirePages: [],
      unlockedAchievements: []
    };
  });

  const [currentView, setCurrentView] = useState<ViewState>('map');
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('normal');
  const [showPrologue, setShowPrologue] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Modal State for Level Complete
  const [winModalData, setWinModalData] = useState<{
    stars: number;
    crystals: number;
    unlockedPage: boolean;
  } | null>(null);

  // Achievement Notification
  const [unlockedAchievementToast, setUnlockedAchievementToast] = useState<Achievement | null>(null);

  useEffect(() => {
    localStorage.setItem('mm_gamestate_v4', JSON.stringify(gameState));
  }, [gameState]);

  // Check for First Time Play to show Prologue
  useEffect(() => {
    // Show prologue if it's a fresh game (score 0, level 0) and we haven't shown it in this session yet
    if (gameState.unlockedLevelIndex === 0 && gameState.score === 0 && !sessionStorage.getItem('prologue_seen')) {
      setShowPrologue(true);
      sessionStorage.setItem('prologue_seen', 'true');
    }
  }, []);

  // --- AUDIO LOGIC ---
  useEffect(() => {
    // Determine which BGM track to play
    let bgmKey = 'map';
    
    if (currentView === 'shop') bgmKey = 'shop';
    else if (currentView === 'game' && gameState.currentWorldId) {
      bgmKey = gameState.currentWorldId;
    } else if (currentView === 'minigames') {
      bgmKey = 'shop'; // Use shop theme for games for now
    }

    // Try to switch music
    // Note: This relies on audioService.init() being called on first interaction
    audioService.playBGM(bgmKey);
  }, [currentView, gameState.currentWorldId]);

  const handleInteraction = () => {
    audioService.init();
  };

  const toggleMute = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
    handleInteraction(); // Ensure init
  };

  // Helper to unlock achievement
  const checkAndUnlockAchievement = (id: string) => {
    if (!gameState.unlockedAchievements.includes(id)) {
      setGameState(prev => ({
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, id]
      }));
      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (ach) {
        setUnlockedAchievementToast(ach);
        audioService.playSFX('win');
        setTimeout(() => setUnlockedAchievementToast(null), 4000);
      }
    }
  };

  // Navigation Logic
  const handleSelectWorld = (id: WorldId, difficulty: Difficulty) => {
    setGameState(prev => ({ ...prev, currentWorldId: id }));
    setCurrentDifficulty(difficulty);
    setCurrentView('game');
  };

  const handleExitLevel = () => {
    setGameState(prev => ({ ...prev, currentWorldId: null }));
    setCurrentView('map');
  };

  // REWARD LOGIC
  const handleLevelComplete = (finalScore: number, duration: number) => {
    if (!gameState.currentWorldId) return;

    const worldConfig = WORLDS.find(w => w.id === gameState.currentWorldId)!;
    
    // Calculate Stars
    let starsEarned = 1;
    if (finalScore === worldConfig.totalQuestions) starsEarned = 3;
    else if (finalScore >= worldConfig.totalQuestions - 2) starsEarned = 2;

    // Base Crystals
    let crystalsBase = starsEarned === 3 ? 50 : starsEarned === 2 ? 30 : 10;
    
    // Difficulty Multiplier
    let multiplier = 1;
    if (currentDifficulty === 'easy') multiplier = 0.5;
    if (currentDifficulty === 'hard') multiplier = 2;

    const crystalsEarned = Math.floor(crystalsBase * multiplier);
    
    // Check for Grimoire Unlock (if new level completed)
    const pageId = GRIMOIRE_PAGES.find(p => p.worldId === gameState.currentWorldId)?.id;
    let newGrimoirePage = false;
    
    setGameState(prev => {
      // Logic to unlock next level
      let newUnlockedIndex = prev.unlockedLevelIndex;
      const currentWorldIndex = WORLDS.findIndex(w => w.id === prev.currentWorldId);
      
      const passed = finalScore >= 3; // Basic pass condition
      
      if (passed && currentWorldIndex === prev.unlockedLevelIndex && prev.unlockedLevelIndex < WORLDS.length - 1) {
        newUnlockedIndex = prev.unlockedLevelIndex + 1;
      }

      // Check if page is new
      const unlockedPages = [...prev.unlockedGrimoirePages];
      if (passed && pageId && !unlockedPages.includes(pageId)) {
        unlockedPages.push(pageId);
        newGrimoirePage = true;
      }

      // Update Max Stars for this level
      const currentProgress = prev.levelProgress[prev.currentWorldId!] || { stars: 0, completed: false, completedDifficulties: [] };
      const newStars = Math.max(currentProgress.stars, starsEarned);
      
      // Update Completed Difficulties
      const completedDiffs = currentProgress.completedDifficulties || [];
      if (passed && !completedDiffs.includes(currentDifficulty)) {
        completedDiffs.push(currentDifficulty);
      }

      return {
        ...prev,
        score: prev.score + finalScore,
        crystals: prev.crystals + crystalsEarned,
        unlockedLevelIndex: newUnlockedIndex,
        unlockedGrimoirePages: unlockedPages,
        levelProgress: {
          ...prev.levelProgress,
          [prev.currentWorldId!]: {
            stars: newStars,
            completed: true,
            completedDifficulties: completedDiffs
          }
        },
        currentWorldId: null // Clear world ID to exit game loop visually in state
      };
    });

    // --- CHECK ACHIEVEMENTS ---
    setTimeout(() => {
        // 1. Novice Explorer (Any level completed)
        checkAndUnlockAchievement('novice_explorer');

        // 2. Master of Addition (World 2, Hard, 3 Stars)
        if (gameState.currentWorldId === WorldId.ADD_SUB && currentDifficulty === 'hard' && starsEarned === 3) {
            checkAndUnlockAchievement('master_add');
        }

        // 3. Geometry Detective (World 5, 3 Stars)
        if (gameState.currentWorldId === WorldId.GEO && starsEarned === 3) {
            checkAndUnlockAchievement('geo_detective');
        }

        // 4. Speedster (Any Level, 3 Stars, < 45 seconds)
        if (starsEarned === 3 && duration < 45) {
            checkAndUnlockAchievement('speedster');
        }
    }, 500);

    setWinModalData({
      stars: starsEarned,
      crystals: crystalsEarned,
      unlockedPage: newGrimoirePage
    });
    audioService.playSFX('win');
    setCurrentView('map');
  };

  const handleBuyItem = (itemId: string, cost: number) => {
    if (gameState.crystals >= cost && !gameState.inventory.includes(itemId)) {
      setGameState(prev => {
          const nextState = {
            ...prev,
            crystals: prev.crystals - cost,
            inventory: [...prev.inventory, itemId]
          };
          
          return nextState;
      });
      
      audioService.playSFX('buy');

      // Post-state update achievement check (simplified logic for now)
      if (gameState.inventory.length >= 7) { 
          checkAndUnlockAchievement('collector');
      }
    }
  };

  const handleEquipItem = (type: 'hat' | 'wand' | 'pet' | 'furniture' | 'outfit', itemId: string) => {
    audioService.playSFX('click');
    setGameState(prev => {
      const newEquipped = { ...prev.equipped };
      if (type === 'furniture') {
        // Toggle furniture
        if (newEquipped.furniture.includes(itemId)) {
          newEquipped.furniture = newEquipped.furniture.filter(id => id !== itemId);
        } else {
          newEquipped.furniture = [...newEquipped.furniture, itemId];
        }
      } else {
        newEquipped[type] = itemId;
      }
      return { ...prev, equipped: newEquipped };
    });
  };

  const handleUpdateAvatar = (race: Race, skinColor: string) => {
    audioService.playSFX('click');
    setGameState(prev => ({
      ...prev,
      avatar: { race, skinColor }
    }));
  };

  // --- RENDER ---

  const currentWorldConfig = WORLDS.find(w => w.id === gameState.currentWorldId);

  return (
    <div className="font-sans text-gray-900 bg-[#f0f9ff]" onClick={handleInteraction}>
      
      {/* Audio Control - MOVED TO TOP-24 TO AVOID OVERLAP WITH GEMS */}
      <button 
        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
        className="fixed top-24 right-4 z-[60] bg-white/80 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
         {isMuted ? <VolumeX className="text-gray-500" /> : <Volume2 className="text-purple-600" />}
      </button>

      {/* Achievement Toast */}
      {unlockedAchievementToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-500">
           <div className={`
             flex items-center gap-4 px-6 py-4 rounded-full shadow-2xl border-4 border-white
             ${unlockedAchievementToast.color} text-white
           `}>
              <div className="text-4xl animate-bounce-short">{unlockedAchievementToast.icon}</div>
              <div>
                <div className="text-xs font-bold uppercase opacity-80">¡Logro Desbloqueado!</div>
                <div className="font-bold text-lg leading-tight">{unlockedAchievementToast.title}</div>
              </div>
           </div>
        </div>
      )}

      {/* Prologue Modal */}
      {showPrologue && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-1000">
           <div className="bg-[#fdf6e3] rounded-sm p-8 max-w-lg w-full text-center shadow-2xl border-8 border-yellow-900 relative overflow-hidden font-serif">
              {/* Parchment Texture Overlay */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/old-paper.png')] opacity-50 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="mb-6 flex justify-center">
                  <div className="bg-yellow-900 text-amber-100 p-4 rounded-full border-4 border-amber-500 shadow-xl">
                    <Scroll size={48} />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-yellow-900 mb-4 underline decoration-amber-500 decoration-wavy">
                  La Profecía
                </h2>
                
                <p className="text-lg text-amber-900 mb-6 leading-relaxed">
                  "Hace mucho tiempo, el <span className="font-bold">Gran Libro de las Matemáticas</span> mantenía el equilibrio en nuestros mundos. Pero una tormenta de caos ha arrancado sus páginas."
                </p>
                
                <p className="text-lg text-amber-900 mb-8 leading-relaxed">
                  "Solo un <b>Sabio Numérico</b> puede resolver los acertijos, recuperar las páginas perdidas y restaurar la paz. ¿Eres tú ese héroe?"
                </p>

                <button 
                  onClick={() => setShowPrologue(false)}
                  className="bg-yellow-800 text-amber-100 px-8 py-3 rounded text-xl font-bold border-2 border-yellow-600 hover:bg-yellow-700 hover:scale-105 transition-all shadow-lg"
                >
                  ¡Acepto la Misión!
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Level Complete Reward Modal */}
      {winModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-yellow-400 animate-bounce-short relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-yellow-100 to-transparent -z-10"></div>
            
            <h2 className="text-3xl font-bold text-purple-700 mb-4 font-fredoka">¡Nivel Completado!</h2>
            
            {/* Stars */}
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3].map(i => (
                <Star 
                  key={i} 
                  size={48} 
                  className={`drop-shadow-md ${i <= winModalData.stars ? 'text-yellow-400 fill-yellow-400 animate-pulse' : 'text-gray-200'}`} 
                />
              ))}
            </div>

            {/* Crystals */}
            <div className="bg-slate-900 text-cyan-400 px-6 py-3 rounded-full inline-flex items-center gap-3 mb-6 shadow-inner">
              <span className="text-sm text-gray-400 font-bold uppercase">Recompensa:</span>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold">+{winModalData.crystals}</span>
                <Gem size={24} fill="currentColor" />
              </div>
            </div>

            {/* Grimoire Page Unlock */}
            {winModalData.unlockedPage && (
              <div className="bg-amber-100 border-2 border-amber-300 p-3 rounded-xl mb-6 flex items-center gap-3 text-left">
                <div className="bg-amber-500 text-white p-2 rounded-lg">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-800 uppercase">¡Nueva Página!</p>
                  <p className="text-sm text-amber-900 leading-tight">Grimorio actualizado</p>
                </div>
              </div>
            )}

            <button 
              onClick={() => setWinModalData(null)}
              className="w-full bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg border-b-4 border-green-700 hover:bg-green-400 hover:scale-105 transition active:border-b-0 active:translate-y-1"
            >
              ¡Genial!
            </button>
          </div>
        </div>
      )}

      {/* Main View Router */}
      {currentView === 'game' && currentWorldConfig ? (
        <GameLevel 
          world={currentWorldConfig} 
          difficulty={currentDifficulty}
          onExit={handleExitLevel}
          onComplete={handleLevelComplete}
        />
      ) : currentView === 'shop' ? (
        <MagicShop 
          crystals={gameState.crystals}
          inventory={gameState.inventory}
          onBuy={handleBuyItem}
          onExit={() => setCurrentView('map')}
        />
      ) : currentView === 'tower' ? (
        <ApprenticeTower 
          state={gameState}
          onEquip={handleEquipItem}
          onUpdateAvatar={handleUpdateAvatar}
          onExit={() => setCurrentView('map')}
        />
      ) : currentView === 'grimoire' ? (
        <MathGrimoire 
          unlockedPages={gameState.unlockedGrimoirePages}
          onExit={() => setCurrentView('map')}
        />
      ) : currentView === 'tree' ? (
        <SkillTree 
          levelProgress={gameState.levelProgress}
          unlockedPages={gameState.unlockedGrimoirePages}
          onExit={() => setCurrentView('map')}
        />
      ) : currentView === 'minigames' ? (
        <MiniGamesHub 
          levelProgress={gameState.levelProgress}
          onExit={() => setCurrentView('map')}
        />
      ) : (
        <WorldMap 
          levelProgress={gameState.levelProgress}
          unlockedIndex={gameState.unlockedLevelIndex}
          crystals={gameState.crystals}
          onSelectWorld={handleSelectWorld}
          onNavigate={(view) => { audioService.playSFX('click'); setCurrentView(view); }}
        />
      )}
    </div>
  );
};

export default App;