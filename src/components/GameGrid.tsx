import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAMES, GameCategory, Game } from '../data/games';
import { ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GameGrid() {
  const [activeCategory, setActiveCategory] = useState<GameCategory | 'All'>('All');

  const categories: (GameCategory | 'All')[] = ['All', 'Space', 'Sports & Physics', 'Action & Survival', 'Abstract & Experimental'];

  const filteredGames = GAMES.filter(game => activeCategory === 'All' || game.category === activeCategory);

  return (
    <div className="space-y-12">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
              activeCategory === cat 
                ? 'bg-emerald-accent text-forest-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                : 'glass-card text-zinc-500 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function GameCard({ game }: { game: Game }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -10 }}
      className="group relative glass-card rounded-[32px] p-8 aspect-[4/5] flex flex-col justify-end overflow-hidden"
    >
      {/* Glow Backdrop */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${game.color}, transparent)` }}
      />
      
      {/* Icon Area */}
      <div className="absolute top-8 left-8 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
        <div 
          className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10"
          style={{ backgroundColor: `${game.color}20` }}
        >
          <game.icon className="w-5 h-5" style={{ color: game.color }} />
        </div>
      </div>

      {/* "Coming Soon" or Category */}
      <div className="absolute top-8 right-8">
        {!game.isPlayable ? (
          <span className="text-[8px] uppercase tracking-widest font-black text-zinc-600 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
            Coming Soon
          </span>
        ) : (
          <span className="flex h-2 w-2 rounded-full bg-emerald-accent animate-pulse shadow-[0_0_10px_#10b981]" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
        <p className="text-[9px] uppercase tracking-[0.3em] font-black mb-3" style={{ color: game.color }}>
          {game.category}
        </p>
        <h3 className="text-2xl font-black tracking-tight text-white mb-4 group-hover:text-shadow-glow transition-all">
          {game.title}
        </h3>
        
        {/* Animated Description & Button */}
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out">
          <div className="overflow-hidden">
            <p className="text-xs text-zinc-500 leading-relaxed mb-8">
              {game.description}
            </p>
            {game.isPlayable ? (
              <Link 
                to={`/play/${game.id}`}
                className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-black text-emerald-accent hover:text-white transition-colors"
              >
                Launch Arena <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <button disabled className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 cursor-not-allowed">
                Encrypted Data <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Play Overlay (Only for playable) */}
      {game.isPlayable && (
        <div className="absolute inset-0 bg-emerald-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      )}
    </motion.div>
  );
}
