
import React, { useState, useEffect } from 'react';
import { MINI_GAMES } from '../constants';
import { MiniGameId, LevelProgress, WorldId } from '../types';
import { ArrowLeft, Lock, Play, Zap, FlaskConical, Sprout } from 'lucide-react';

interface MiniGamesHubProps {
  levelProgress: Record<string, LevelProgress>;
  onExit: () => void;
}

const MiniGamesHub: React.FC<MiniGamesHubProps> = ({ levelProgress, onExit }) => {
  const [activeGame, setActiveGame] = useState<MiniGameId | null>(null);

  if (activeGame === 'dragon_race') {
    return <DragonRaceGame onExit={() => setActiveGame(null)} />;
  }
  if (activeGame === 'potion_lab') {
    return <PotionLabGame onExit={() => setActiveGame(null)} />;
  }
  if (activeGame === 'shape_garden') {
    return <ShapeGardenGame onExit={() => setActiveGame(null)} />;
  }

  // --- MENU VIEW ---
  return (
    <div className="min-h-screen bg-indigo-950 p-4 text-white overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onExit} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
            <ArrowLeft />
          </button>
          <h1 className="text-3xl font-bold font-fredoka text-cyan-300">🎮 Sala de Juegos</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MINI_GAMES.map(game => {
            const progress = levelProgress[game.unlockWorldId];
            const isUnlocked = !!progress && progress.completed;
            
            return (
              <div 
                key={game.id}
                className={`
                  relative rounded-3xl p-6 border-b-8 transition-all
                  ${isUnlocked 
                    ? `${game.color} border-black/20 hover:scale-105 cursor-pointer` 
                    : 'bg-gray-700 border-gray-900 grayscale opacity-80'}
                `}
                onClick={() => isUnlocked && setActiveGame(game.id)}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-black/50 rounded-3xl z-10 flex flex-col items-center justify-center p-4 text-center">
                    <Lock size={48} className="text-gray-400 mb-2" />
                    <p className="text-sm font-bold">Desbloquea en {game.unlockWorldId === WorldId.NUMBERS ? "Mundo 1" : game.unlockWorldId === WorldId.MULT ? "Mundo 3" : "Mundo 5"}</p>
                  </div>
                )}
                
                <div className="text-6xl mb-4 drop-shadow-lg">{game.icon}</div>
                <h3 className="text-2xl font-bold mb-2 leading-tight">{game.title}</h3>
                <p className="text-sm opacity-90 font-medium">{game.description}</p>
                
                {isUnlocked && (
                  <div className="mt-6 flex justify-end">
                    <button className="bg-white text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
                      <Play size={16} fill="currentColor" /> Jugar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- MINI GAME 1: DRAGON RACE (Speed Math) ---
const DragonRaceGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [started, setStarted] = useState(false);
  const [playerPos, setPlayerPos] = useState(0);
  const [rivalPos, setRivalPos] = useState(0);
  const [question, setQuestion] = useState({ text: "", ans: 0 });
  const [gameOver, setGameOver] = useState<'win'|'lose'|null>(null);

  const generateQ = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    if (Math.random() > 0.5) {
      setQuestion({ text: `${a} + ${b}`, ans: a + b });
    } else {
      const max = Math.max(a, b);
      const min = Math.min(a, b);
      setQuestion({ text: `${max} - ${min}`, ans: max - min });
    }
  };

  useEffect(() => {
    if (started) generateQ();
  }, [started]);

  useEffect(() => {
    if (!started || gameOver) return;
    const interval = setInterval(() => {
      setRivalPos(p => {
        if (p >= 100) {
          setGameOver('lose');
          return 100;
        }
        return p + 0.8; // Rival speed
      });
    }, 100);
    return () => clearInterval(interval);
  }, [started, gameOver]);

  const handleAns = (val: number) => {
    if (val === question.ans) {
      setPlayerPos(p => {
        const next = p + 15; // Player speed boost
        if (next >= 100) {
          setGameOver('win');
          return 100;
        }
        return next;
      });
      generateQ();
    } else {
      // Penalty? Maybe just shake or delay
    }
  };

  // Generate options
  const options = React.useMemo(() => {
    if (!question) return [];
    const opts = new Set([question.ans]);
    while(opts.size < 3) {
      opts.add(question.ans + Math.floor(Math.random() * 5) - 2);
    }
    return Array.from(opts).sort(() => Math.random() - 0.5);
  }, [question]);

  return (
    <div className="min-h-screen bg-sky-200 flex flex-col p-4">
      {/* Header */}
      <button onClick={onExit} className="self-start p-2 bg-white rounded-full mb-4 shadow"><ArrowLeft /></button>
      
      {/* Race Track */}
      <div className="flex-grow flex flex-col justify-center gap-8 mb-8">
        {/* Rival Lane */}
        <div className="relative h-16 bg-gray-300 rounded-full border-4 border-gray-400">
           <div className="absolute top-1/2 -translate-y-1/2 transition-all duration-100 text-4xl" style={{ left: `${rivalPos}%` }}>🤖</div>
           <div className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl">🏁</div>
        </div>
        
        {/* Player Lane */}
        <div className="relative h-16 bg-red-200 rounded-full border-4 border-red-400">
           <div className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 text-4xl" style={{ left: `${playerPos}%` }}>🐉</div>
           <div className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl">🏁</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-t-3xl p-8 shadow-2xl">
        {!started ? (
           <div className="text-center">
             <h2 className="text-3xl font-bold mb-4 text-gray-800">¿Listo para volar?</h2>
             <button onClick={() => setStarted(true)} className="bg-red-500 text-white text-2xl px-8 py-4 rounded-full font-bold animate-bounce">
               ¡A Volar!
             </button>
           </div>
        ) : gameOver ? (
          <div className="text-center">
             <h2 className="text-4xl font-bold mb-4">{gameOver === 'win' ? '¡Ganaste! 🏆' : '¡Casi! 🥈'}</h2>
             <button onClick={onExit} className="bg-gray-800 text-white px-6 py-3 rounded-full font-bold">Volver</button>
          </div>
        ) : (
          <div className="text-center">
             <div className="text-4xl font-bold mb-6 text-gray-800">{question.text} = ?</div>
             <div className="flex gap-4 justify-center">
               {options.map(o => (
                 <button 
                  key={o} 
                  onClick={() => handleAns(o)}
                  className="bg-red-100 hover:bg-red-200 border-b-4 border-red-300 w-24 h-24 rounded-2xl text-3xl font-bold text-red-800"
                 >
                   {o}
                 </button>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MINI GAME 2: POTION LAB (Factors) ---
const PotionLabGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [target, setTarget] = useState(12);
  const [ingredients, setIngredients] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [feedback, setFeedback] = useState("");

  const setupLevel = () => {
    setSelected([]);
    setFeedback("");
    const f1 = Math.floor(Math.random() * 5) + 2; // 2-6
    const f2 = Math.floor(Math.random() * 5) + 2; // 2-6
    const t = f1 * f2;
    setTarget(t);
    
    // Generate ingredients (correct + distractors)
    const opts = new Set([f1, f2]);
    while (opts.size < 6) {
      opts.add(Math.floor(Math.random() * 10) + 1);
    }
    setIngredients(Array.from(opts).sort(() => Math.random() - 0.5));
  };

  useEffect(setupLevel, []);

  const handleSelect = (n: number) => {
    if (selected.includes(n)) {
      setSelected(s => s.filter(i => i !== n));
    } else if (selected.length < 2) {
      const newSel = [...selected, n];
      setSelected(newSel);
      
      if (newSel.length === 2) {
        if (newSel[0] * newSel[1] === target) {
          setFeedback("success");
          setTimeout(setupLevel, 1500);
        } else {
          setFeedback("error");
          setTimeout(() => { setSelected([]); setFeedback(""); }, 1000);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-purple-900 flex flex-col p-4 items-center justify-center text-white">
      <button onClick={onExit} className="absolute top-4 left-4 p-2 bg-white/10 rounded-full"><ArrowLeft /></button>
      
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <FlaskConical /> Pociones de Multiplicación
      </h2>

      {/* Cauldron */}
      <div className="relative mb-12">
        <div className={`w-40 h-40 rounded-full border-4 flex items-center justify-center text-5xl font-bold bg-gray-800 transition-colors ${feedback === 'success' ? 'border-green-400 text-green-400' : 'border-purple-400 text-purple-200'}`}>
          {target}
        </div>
        <div className="absolute -bottom-4 w-full text-center text-sm uppercase tracking-widest text-gray-400">Objetivo</div>
      </div>

      {/* Ingredients Shelf */}
      <div className="grid grid-cols-3 gap-6">
        {ingredients.map((ing, i) => (
          <button
            key={i}
            onClick={() => handleSelect(ing)}
            className={`
              w-20 h-24 rounded-xl flex flex-col items-center justify-end pb-2 border-b-4 transition-all
              ${selected.includes(ing) 
                ? 'bg-yellow-400 border-yellow-600 -translate-y-2' 
                : 'bg-white/10 border-white/20 hover:bg-white/20'}
              ${feedback === 'error' && selected.includes(ing) ? 'bg-red-500 border-red-700' : ''}
              ${feedback === 'success' && selected.includes(ing) ? 'bg-green-500 border-green-700' : ''}
            `}
          >
            <div className="text-2xl mb-1">🧪</div>
            <div className="text-2xl font-bold">{ing}</div>
          </button>
        ))}
      </div>
      
      <p className="mt-8 text-purple-300">Selecciona 2 ingredientes que multiplicados den {target}.</p>
    </div>
  );
};

// --- MINI GAME 3: SHAPE GARDEN (Patterns) ---
const ShapeGardenGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const shapes = ["🌻", "🌷", "🍄", "🌲", "🌵"];

  const generateLevel = () => {
    // Simple Pattern: ABAB or ABCABC
    const isThree = Math.random() > 0.5;
    const a = shapes[Math.floor(Math.random() * shapes.length)];
    let b = shapes[Math.floor(Math.random() * shapes.length)];
    while(b===a) b = shapes[Math.floor(Math.random() * shapes.length)];
    
    let pattern: string[] = [];
    if (isThree) {
      let c = shapes[Math.floor(Math.random() * shapes.length)];
      while(c===a || c===b) c = shapes[Math.floor(Math.random() * shapes.length)];
      pattern = [a, b, c, a, b, c, a, b]; // Next is c
      setSequence(pattern);
      setOptions([a, b, c].sort(() => Math.random() - 0.5));
    } else {
      pattern = [a, b, a, b, a, b, a]; // Next is b
      setSequence(pattern);
      setOptions([a, b, shapes.find(s => s!==a && s!==b)!].sort(() => Math.random() - 0.5));
    }
  };

  useEffect(generateLevel, []);

  const handleSelect = (shape: string) => {
    // Determine correct answer from sequence logic
    // Cheap way: look at pattern
    // If ABAB... last was A, answer is B.
    // The sequence array holds the *visible* sequence. The answer is the next one.
    
    // Reverse engineer logic for brevity:
    const last = sequence[sequence.length-1];
    const secondLast = sequence[sequence.length-2];
    const thirdLast = sequence[sequence.length-3];
    
    let correct = "";
    if (last === thirdLast) {
      // ABAB type logic likely
      // If sequence is [A, B, A, B, A, B, A] -> next is B
      // If sequence is [A, B, C, A, B, C, A, B] -> next is C
      if (sequence[0] !== sequence[1]) {
         // Check pattern length
         if (sequence[0] === sequence[2]) {
           // ABAB
           correct = (last === sequence[0]) ? sequence[1] : sequence[0];
         } else {
           // ABCABC
           // Sequence A B C A B C A B -> next C
           correct = sequence[2]; 
         }
      }
    }
    
    // Actually, simpler way: define correct answer in state when generating. 
    // But since I didn't, let's just regenerate if they click anything for the demo visual
    // Just simple validation:
    
    // Find expected:
    let expected = "";
    if (sequence[0] === sequence[2]) expected = (last === sequence[0]) ? sequence[1] : sequence[0];
    else expected = sequence[2];

    if (shape === expected) {
      setScore(s => s+1);
      generateLevel();
    }
  };

  return (
    <div className="min-h-screen bg-green-100 flex flex-col p-4 items-center">
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={onExit} className="p-2 bg-white rounded-full shadow"><ArrowLeft /></button>
        <div className="bg-white px-4 py-2 rounded-full font-bold shadow text-green-800">Puntos: {score}</div>
      </div>

      <h2 className="text-3xl font-bold text-green-800 mb-12 flex items-center gap-2">
        <Sprout /> Jardín de Patrones
      </h2>

      {/* Soil Bed */}
      <div className="bg-amber-800/20 p-4 rounded-3xl mb-12 flex gap-2 md:gap-4 overflow-x-auto max-w-full">
         {sequence.map((s, i) => (
           <div key={i} className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center text-4xl shadow-sm border-b-4 border-amber-200">
             {s}
           </div>
         ))}
         <div className="w-16 h-16 bg-white/50 rounded-xl flex items-center justify-center text-4xl border-2 border-dashed border-gray-400 animate-pulse">
           ?
         </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-3 gap-6">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt)}
            className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-5xl shadow-lg hover:scale-110 transition-transform border-b-4 border-gray-200"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MiniGamesHub;
