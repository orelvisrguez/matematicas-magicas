
import React from 'react';
import { STORE_ITEMS } from '../constants';
import { GameState } from '../types';
import { ArrowLeft, Gem } from 'lucide-react';

interface MagicShopProps {
  crystals: number;
  inventory: string[];
  onBuy: (itemId: string, cost: number) => void;
  onExit: () => void;
}

const MagicShop: React.FC<MagicShopProps> = ({ crystals, inventory, onBuy, onExit }) => {
  return (
    <div className="min-h-screen bg-slate-900 p-4 text-white overflow-y-auto">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        @keyframes shine {
          0% { left: -100%; opacity: 0; }
          20% { left: 100%; opacity: 0.1; }
          100% { left: 100%; opacity: 0; }
        }
        .card-shine {
          position: relative;
          overflow: hidden;
        }
        .card-shine::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, transparent, white, transparent);
          transform: skewX(-25deg);
          pointer-events: none;
        }
        /* Only shine if not owned */
        .card-shine-active::after {
          animation: shine 4s infinite;
          animation-delay: 1s;
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-slate-800 p-4 rounded-2xl sticky top-0 z-10 shadow-lg border-b-4 border-slate-700">
          <div className="flex items-center gap-4">
            <button onClick={onExit} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
              <ArrowLeft />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-purple-300 font-fredoka">🔮 Tienda Mágica</h1>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-full border border-purple-500/50">
            <Gem className="text-cyan-400" />
            <span className="text-xl font-bold text-cyan-300">{crystals}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STORE_ITEMS.filter(item => item.cost > 0).map((item, index) => {
            const isOwned = inventory.includes(item.id);
            const canAfford = crystals >= item.cost;

            return (
              <div 
                key={item.id} 
                className={`
                  relative rounded-2xl p-6 flex flex-col items-center text-center border-2 transition-all duration-300 group
                  ${isOwned 
                    ? 'bg-slate-800/50 border-slate-700 opacity-80' 
                    : 'bg-slate-800 border-slate-600 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 card-shine card-shine-active'}
                `}
              >
                {/* Floating Icon */}
                <div 
                  className={`
                    w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center text-5xl mb-4 shadow-inner 
                    ${!isOwned ? 'animate-float group-hover:bg-slate-600 group-hover:scale-110 transition-transform' : ''}
                  `}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {item.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-1 group-hover:text-purple-300 transition-colors">{item.name}</h3>
                <p className="text-slate-400 text-sm mb-4 h-10">{item.description}</p>
                
                {isOwned ? (
                  <button disabled className="bg-green-600/20 text-green-200 px-6 py-2 rounded-full font-bold w-full cursor-not-allowed border border-green-500/30">
                    Comprado
                  </button>
                ) : (
                  <button
                    onClick={() => onBuy(item.id, item.cost)}
                    disabled={!canAfford}
                    className={`
                      px-6 py-2 rounded-full font-bold w-full flex items-center justify-center gap-2 transition-all active:scale-95
                      ${canAfford 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/50' 
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
                    `}
                  >
                    <span>{item.cost}</span>
                    <Gem size={16} className={canAfford ? 'text-cyan-300 animate-pulse' : ''} />
                    Comprar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MagicShop;
