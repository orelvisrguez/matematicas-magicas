
import React, { useState, useEffect, useRef } from 'react';
import { WorldConfig, Question, QuestionType, WorldId, Difficulty } from '../types';
import { generateQuestionForWorld } from '../services/mathGenerator';
import { generateHint, generateChallengeQuestion } from '../services/geminiService';
import { ArrowLeft, Sparkles, Zap, Crown } from 'lucide-react';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, SPARKY_QUOTES } from '../constants';
import { audioService } from '../services/audioService';

interface GameLevelProps {
  world: WorldConfig;
  difficulty: Difficulty;
  onExit: () => void;
  onComplete: (score: number, duration: number) => void;
}

const Confetti = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-full animate-bounce-short"
          style={{
            backgroundColor: ['#FFD700', '#FF69B4', '#00BFFF', '#32CD32'][Math.floor(Math.random() * 4)],
            left: `${Math.random() * 100}%`,
            top: `-10%`,
            animation: `fall ${1 + Math.random()}s linear forwards`,
            animationDelay: `${Math.random() * 0.5}s`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to { transform: translateY(100vh) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Mini Lesson Component for Active Help
const MiniLessonOverlay: React.FC<{ 
  question: Question; 
  onClose: () => void; 
  worldId: WorldId;
}> = ({ question, onClose, worldId }) => {
  
  // Simple visualizer logic
  const renderVisualizer = () => {
    // Extract numbers from text (simple regex for basic ops)
    const numbers = question.text.match(/\d+/g)?.map(Number) || [];
    
    // Geometry / Shapes
    if (question.shapeData) {
      if (question.shapeData.type === 'clock') {
        return (
          <div className="text-center p-4 bg-white rounded-xl text-gray-800">
             <p className="mb-2">La aguja <b>Corta</b> marca la Hora.</p>
             <p>La aguja <b>Larga</b> marca los Minutos (cuenta de 5 en 5).</p>
             <div className="text-4xl mt-2">🕒</div>
          </div>
        );
      }
      return (
        <div className="text-center p-4">
           <p>¡Fíjate en los lados!</p>
           {question.shapeData.type === 'square' && <p>Un <b>Cuadrado</b> tiene 4 lados iguales.</p>}
           {question.shapeData.type === 'triangle' && <p>Un <b>Triángulo</b> tiene 3 lados.</p>}
           {question.shapeData.type === 'circle' && <p>Un <b>Círculo</b> es redondo y no tiene esquinas.</p>}
        </div>
      );
    }

    // Arithmetic
    if (numbers.length >= 2) {
      const [a, b] = numbers;
      
      // Suma
      if (question.text.includes('+') || worldId === WorldId.ADD_SUB) {
        if (question.text.includes('-')) {
           // Resta Visual
           return (
            <div className="flex flex-col items-center">
              <p className="mb-2 text-lg">Tienes {a} y quitas {b}.</p>
              <div className="flex flex-wrap gap-1 justify-center max-w-xs">
                {[...Array(a)].map((_, i) => (
                  <div key={i} className={`w-6 h-6 rounded-full border-2 ${i >= (a-b) ? 'bg-red-200 border-red-400 relative' : 'bg-green-400 border-green-600'}`}>
                    {i >= (a-b) && <div className="absolute inset-0 flex items-center justify-center text-red-600 font-bold">X</div>}
                  </div>
                ))}
              </div>
            </div>
           );
        }
        
        // Suma Visual
        return (
          <div className="flex flex-col items-center">
            <p className="mb-2 text-lg">Junta los grupos:</p>
            <div className="flex items-center gap-4">
               <div className="flex flex-wrap gap-1 w-20 justify-center bg-blue-100 p-2 rounded">
                 {[...Array(a > 20 ? 5 : a)].map((_,i) => <div key={i} className="w-4 h-4 bg-blue-500 rounded-full"/>)}
                 {a > 20 && <span>...</span>}
               </div>
               <span className="text-2xl font-bold">+</span>
               <div className="flex flex-wrap gap-1 w-20 justify-center bg-purple-100 p-2 rounded">
                 {[...Array(b > 20 ? 5 : b)].map((_,i) => <div key={i} className="w-4 h-4 bg-purple-500 rounded-full"/>)}
                 {b > 20 && <span>...</span>}
               </div>
            </div>
          </div>
        );
      }

      // Multiplicación
      if (question.text.includes('x') || worldId === WorldId.MULT) {
        if (a > 12 || b > 12) return <p>Multiplicar es sumar {a} veces el número {b}.</p>;
        return (
          <div className="flex flex-col items-center">
            <p className="mb-2">Son {a} grupos de {b}:</p>
            <div className="flex flex-col gap-1 bg-yellow-50 p-3 rounded border border-yellow-200">
              {[...Array(a)].map((_, r) => (
                <div key={r} className="flex gap-1">
                   {[...Array(b)].map((_, c) => (
                     <div key={c} className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                   ))}
                </div>
              ))}
            </div>
          </div>
        );
      }
    }

    // Default generic help
    return <p className="text-center italic">Lee despacio la pregunta y busca las pistas numéricas.</p>;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-4 border-purple-400 relative flex flex-col items-center">
        <div className="absolute -top-10 bg-purple-600 p-3 rounded-full border-4 border-white shadow-lg text-4xl">
          🧙‍♂️
        </div>
        
        <h3 className="mt-6 text-xl font-bold text-purple-800 mb-2">¡Lección Mágica!</h3>
        <p className="text-gray-600 mb-4 text-center text-sm">Parece que este hechizo es difícil. Déjame mostrártelo:</p>
        
        <div className="bg-gray-100 w-full p-4 rounded-xl border border-gray-300 mb-6 flex justify-center">
           {renderVisualizer()}
        </div>

        <button 
          onClick={onClose}
          className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-purple-500 transition-transform active:scale-95"
        >
          ¡Entendido!
        </button>
      </div>
    </div>
  );
};

const GameLevel: React.FC<GameLevelProps> = ({ world, difficulty, onExit, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'success' | 'error'>('none');
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  // Feedback Logic
  const [attempts, setAttempts] = useState(0);
  const [showMiniLesson, setShowMiniLesson] = useState(false);
  
  // Adaptive Logic
  const [streak, setStreak] = useState(0);

  // Time Tracking for Achievements
  const [startTime, setStartTime] = useState<number | null>(null);

  // Initialize First Question
  useEffect(() => {
    const q = generateQuestionForWorld(world.id, difficulty, 0, false);
    setQuestions([q]);
  }, [world.id, difficulty]);

  const startLevel = () => {
    setShowIntro(false);
    setStartTime(Date.now());
    audioService.playSFX('click');
  };

  const currentQuestion = questions[currentIndex];
  // Determine boss level status based on total count
  const isBossLevel = currentIndex === world.totalQuestions - 1;

  const handleAnswerSubmit = async () => {
    if (!currentQuestion || !userAnswer) return;

    const isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();

    if (isCorrect) {
      setFeedback('success');
      audioService.playSFX('success');
      
      // Update Streak
      const newStreak = streak + 1;
      setStreak(newStreak);

      setTimeout(async () => {
        // Prepare next step
        if (currentIndex < world.totalQuestions - 1) {
          // Generate NEXT question dynamically based on new streak
          const nextIsBoss = (currentIndex + 1) === world.totalQuestions - 1;
          const nextQ = generateQuestionForWorld(world.id, difficulty, newStreak, nextIsBoss);
          
          setQuestions(prev => [...prev, nextQ]);
          
          setScore(s => s + 1);
          setCurrentIndex(i => i + 1);
          setUserAnswer('');
          setFeedback('none');
          setHint(null);
          setAttempts(0);
        } else {
          // Level Completed
          const endTime = Date.now();
          const duration = startTime ? (endTime - startTime) / 1000 : 999;
          onComplete(score + 1, duration);
        }
      }, 2000); 
    } else {
      setFeedback('error');
      audioService.playSFX('error');
      setAttempts(prev => prev + 1);
      setStreak(0); // Reset streak
      
      // Auto-trigger Mini Lesson after 2 fails
      if (attempts >= 1) {
         setTimeout(() => setShowMiniLesson(true), 1000);
      }
    }
  };

  const requestHint = async () => {
    if (loadingAI || !currentQuestion) return;
    setLoadingAI(true);
    audioService.playSFX('click');
    const hintText = await generateHint(currentQuestion.text, userAnswer || "no sé");
    setHint(hintText);
    setLoadingAI(false);
  };

  const renderVisuals = () => {
    if (!currentQuestion.shapeData) return null;
    
    if (currentQuestion.shapeData.type === 'clock') {
      const { hour, minute } = currentQuestion.shapeData.value;
      const hourDeg = (hour % 12) * 30 + (minute / 60) * 30;
      const minDeg = minute * 6;

      return (
        <div className="w-48 h-48 rounded-full border-8 border-gray-700 bg-white relative mx-auto mb-6 shadow-lg transition-transform hover:scale-105">
           <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
           <div 
            className="absolute top-1/2 left-1/2 h-14 w-2 bg-black origin-bottom rounded-full transform -translate-x-1/2 -translate-y-full"
            style={{ transform: `translateX(-50%) translateY(-100%) rotate(${hourDeg}deg)` }}
           ></div>
           <div 
            className="absolute top-1/2 left-1/2 h-20 w-1.5 bg-red-500 origin-bottom rounded-full transform -translate-x-1/2 -translate-y-full"
            style={{ transform: `translateX(-50%) translateY(-100%) rotate(${minDeg}deg)` }}
           ></div>
           {[...Array(12)].map((_, i) => (
             <div 
              key={i} 
              className="absolute w-1 h-3 bg-gray-400 left-1/2 top-1 origin-bottom transform -translate-x-1/2"
              style={{ transformOrigin: '50% 90px', transform: `rotate(${i * 30}deg)` }}
             ></div>
           ))}
        </div>
      );
    }

    let shapeClass = "";
    const colorClass = isBossLevel ? "bg-red-500 border-4 border-red-700" : "bg-blue-500 border-4 border-blue-700";
    
    switch(currentQuestion.shapeData.type) {
      case 'square': shapeClass = `w-32 h-32 ${colorClass}`; break;
      case 'rectangle': shapeClass = `w-48 h-24 ${colorClass}`; break;
      case 'circle': shapeClass = `w-32 h-32 rounded-full ${colorClass}`; break;
      case 'triangle': 
        return (
           <div className={`w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] mx-auto mb-6 drop-shadow-lg ${isBossLevel ? 'border-b-red-500' : 'border-b-blue-500'}`}></div>
        );
      default: return null;
    }

    return <div className={`${shapeClass} mx-auto mb-6 shadow-lg transition-transform hover:rotate-3`}></div>;
  };

  // --- RENDERING ---

  if (!currentQuestion) return <div className="flex h-screen items-center justify-center text-2xl text-purple-600 font-bold animate-pulse">Cargando magia...</div>;

  // Intro Modal
  if (showIntro) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-500">
        <div className="bg-purple-900 text-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl border-4 border-yellow-400 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
          
          <div className="mx-auto w-32 h-32 bg-purple-700 rounded-full flex items-center justify-center text-7xl mb-4 border-4 border-yellow-300 shadow-lg animate-bounce-short">
            🧙‍♂️
          </div>
          
          <h2 className="text-3xl font-bold text-yellow-300 mb-4 font-fredoka">Mago Orión</h2>
          
          <div className="bg-purple-800/50 p-6 rounded-2xl mb-8 text-lg leading-relaxed border border-purple-600">
            "{world.orionIntro}"
          </div>

          <button 
            onClick={startLevel}
            className="bg-yellow-400 text-purple-900 px-10 py-4 rounded-full font-bold text-2xl shadow-lg hover:bg-yellow-300 hover:scale-105 transition-all w-full md:w-auto"
          >
            ¡Empezar Aventura!
          </button>
        </div>
      </div>
    );
  }

  const bgStyle = isBossLevel ? world.guardian.themeColor : world.color;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-1000 ${bgStyle} bg-opacity-30 overflow-hidden relative`}>
      
      {/* Visual Feedback Overlays */}
      {feedback === 'success' && <Confetti />}
      
      {/* Active Help Modal */}
      {showMiniLesson && (
        <MiniLessonOverlay 
          question={currentQuestion} 
          worldId={world.id} 
          onClose={() => setShowMiniLesson(false)} 
        />
      )}

      {/* Boss Overlay/Effect */}
      {isBossLevel && (
        <div className="absolute inset-0 pointer-events-none border-[12px] border-red-600/30 animate-pulse z-0"></div>
      )}

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10">
        
        {/* Header */}
        <div className={`p-4 ${isBossLevel ? 'bg-gray-900' : world.color} text-white flex justify-between items-center transition-colors duration-500`}>
          <button onClick={onExit} className="p-2 hover:bg-white/20 rounded-full transition">
            <ArrowLeft />
          </button>
          
          <div className="text-xl font-bold flex items-center gap-2">
            {isBossLevel && <Crown className="text-yellow-400 animate-bounce" />}
            {isBossLevel ? "¡Batalla Final!" : `Pregunta ${currentIndex + 1} / ${world.totalQuestions}`}
            {difficulty !== 'normal' && (
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded uppercase">{difficulty}</span>
            )}
          </div>
          
          <div className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full">
            <Sparkles size={16} className="text-yellow-300" />
            <span>{score * 10} pts</span>
          </div>
        </div>

        {/* Question Area */}
        <div className="p-6 md:p-8 flex-grow flex flex-col items-center text-center relative min-h-[400px]">
          
          {/* Guardian Avatar (Boss Mode) */}
          {isBossLevel && (
            <div className="flex flex-col items-center mb-6 animate-bounce-short">
              <div className="text-6xl filter drop-shadow-lg mb-2">{world.guardian.avatar}</div>
              <div className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md relative">
                {world.guardian.message}
                <div className="absolute w-3 h-3 bg-gray-800 rotate-45 -bottom-1.5 left-1/2 -translate-x-1/2"></div>
              </div>
              <div className="text-gray-500 text-xs mt-1 font-bold uppercase tracking-wider">{world.guardian.name}</div>
            </div>
          )}

          {/* Sparky Helper / Feedback Bubble */}
          <div className={`absolute bottom-4 left-4 flex flex-col items-start transition-opacity duration-300 z-30 ${isBossLevel ? 'opacity-80' : 'opacity-100'}`}>
            {/* Sparky Speech Bubble */}
            <div className={`
              p-3 rounded-2xl rounded-bl-none text-sm font-bold shadow-md mb-2 max-w-[150px] text-left transition-all duration-300
              ${feedback === 'success' ? 'bg-green-100 border-2 border-green-400 text-green-800 scale-110' : 
                feedback === 'error' ? 'bg-red-100 border-2 border-red-400 text-red-800' : 
                hint ? 'bg-yellow-100 border-2 border-yellow-400 text-yellow-900' :
                'bg-gray-100 text-gray-500'}
            `}>
               {feedback === 'success' && SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]}
               {feedback === 'error' && ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]}
               {feedback === 'none' && (hint || SPARKY_QUOTES[Math.floor(Math.random() * SPARKY_QUOTES.length)])}
            </div>
            
            <div 
              onClick={requestHint}
              className={`
                 w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-lg border-2 border-white cursor-pointer transition-transform hover:scale-110
                 ${loadingAI ? 'bg-gray-200 animate-spin' : 'bg-green-400 hover:bg-green-300'}
              `}
              title="¡Pídeme una pista!"
            >
              {loadingAI ? '🌀' : '🧚'}
            </div>
          </div>

          {renderVisuals()}

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 font-fredoka leading-tight">
            {currentQuestion.text}
          </h2>

          {/* Input Methods */}
          <div className={`w-full max-w-md space-y-4 mb-12 ${feedback === 'error' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
             <style>{`
               @keyframes shake {
                 0%, 100% { transform: translateX(0); }
                 25% { transform: translateX(-5px); }
                 75% { transform: translateX(5px); }
               }
             `}</style>
             
            {currentQuestion.type === QuestionType.MULTIPLE_CHOICE && currentQuestion.options ? (
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => { setFeedback('none'); setUserAnswer(opt); }}
                    className={`
                      p-4 text-xl font-bold rounded-xl border-b-4 transition-all active:scale-95
                      ${userAnswer === opt 
                        ? 'bg-purple-100 border-purple-500 text-purple-700 ring-2 ring-purple-500' 
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-50'}
                      ${feedback === 'error' && userAnswer === opt ? 'bg-red-100 border-red-500 text-red-700 ring-red-500' : ''}
                      ${feedback === 'success' && userAnswer === opt ? 'bg-green-100 border-green-500 text-green-700 ring-green-500 scale-105' : ''}
                    `}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="number"
                value={userAnswer}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAnswerSubmit();
                    setFeedback('none');
                }}
                onChange={(e) => { setFeedback('none'); setUserAnswer(e.target.value); }}
                placeholder="?"
                className={`
                   w-full text-center text-5xl font-bold p-4 border-4 rounded-xl outline-none transition-colors
                   ${feedback === 'error' ? 'border-red-400 bg-red-50 text-red-900' : 'border-gray-300 focus:border-purple-500 focus:bg-purple-50'}
                   ${feedback === 'success' ? 'border-green-500 bg-green-50 text-green-900' : ''}
                `}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-md space-y-4 relative z-20">
            <div className="flex gap-3">
              <button 
                onClick={handleAnswerSubmit}
                disabled={!userAnswer || feedback === 'success'}
                className={`
                  flex-1 py-4 rounded-xl font-bold text-white text-xl shadow-lg border-b-4 transition-all
                  ${!userAnswer 
                    ? 'bg-gray-300 border-gray-400 cursor-not-allowed' 
                    : isBossLevel 
                      ? 'bg-red-600 border-red-800 hover:bg-red-500' 
                      : 'bg-green-500 border-green-700 hover:bg-green-400'
                  } active:border-b-0 active:translate-y-1 transform
                  ${feedback === 'success' ? 'scale-105 bg-green-400' : ''}
                `}
              >
                {feedback === 'success' ? '¡Muy bien!' : isBossLevel ? '¡Atacar!' : 'Comprobar'}
              </button>
              
              {(feedback === 'error' || attempts > 0) && (
                <button 
                  onClick={requestHint}
                  disabled={loadingAI}
                  className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 border-b-4 border-yellow-600 rounded-xl px-4 flex items-center justify-center transition-all active:border-b-0 active:translate-y-1 animate-pulse"
                  title="Ayuda de Sparky"
                >
                  <Zap size={28} fill="currentColor" />
                </button>
              )}
            </div>
            
            {/* Explicit Help Trigger */}
            {attempts >= 1 && !showMiniLesson && (
              <div 
                onClick={() => setShowMiniLesson(true)}
                className="text-purple-600 underline cursor-pointer text-sm font-bold animate-pulse hover:text-purple-800"
              >
                ¿Necesitas una explicación mágica?
              </div>
            )}
          </div>

        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-gray-200 w-full relative">
          <div 
            className={`h-full ${isBossLevel ? 'bg-red-500' : world.color} transition-all duration-500`} 
            style={{ width: `${((currentIndex) / world.totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GameLevel;
