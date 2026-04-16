import { useAuth } from '../contexts/AuthContext';
import { Trophy, Crown, Clock, Gamepad2, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import GameGrid from '../components/GameGrid';
import { GAMES } from '../data/games';

export default function Dashboard() {
  const { user, upgradeToPremium } = useAuth();

  if (!user) return null;

  return (
    <div className="relative min-h-screen bg-forest-950 pt-32 pb-20 px-6 font-sans">
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-emerald-accent text-[10px] uppercase tracking-[0.4em] font-black mb-4 block">Archive 01</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 italic">IDENTITY: {user.displayName.toUpperCase()}</h1>
            <p className="text-zinc-500 font-medium">Session initialized. Accessing authorized arenas.</p>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex gap-4"
          >
            <Link 
              to={`/play/${GAMES[Math.floor(Math.random() * GAMES.length)].id}`} 
              className="group flex items-center gap-4 bg-emerald-accent text-forest-950 px-8 py-4 rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-cyber-lime transition-all"
            >
              Quick Launch <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
            </Link>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <StatsCard 
            icon={Trophy} 
            label="Peak Velocity" 
            value={user.highScore.toLocaleString()} 
            color="#fbbf24" 
            index={0}
          />
          <StatsCard 
            icon={Clock} 
            label="Log Time" 
            value={new Date(user.createdAt).toLocaleDateString()} 
            color="#3b82f6" 
            index={1}
          />
          <StatsCard 
            icon={Crown} 
            label="Clearance" 
            value={user.isPremium ? 'PRO RACER' : 'STANDARD'} 
            color="#a855f7" 
            index={2}
          >
            {!user.isPremium && (
              <button 
                onClick={upgradeToPremium}
                className="mt-4 w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] uppercase tracking-[0.2em] font-black hover:bg-white/10 transition-colors"
              >
                Upgrade Clearance
              </button>
            )}
          </StatsCard>
        </div>

        {/* Game Selection */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black tracking-tight italic">CHOOSE YOUR ARENA</h2>
            <div className="h-px flex-1 bg-white/5 mx-8 hidden md:block" />
          </div>
          <GameGrid />
        </div>

        {/* Secondary Info */}
        <div className="grid md:grid-cols-2 gap-8 mt-24">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-[32px] p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black tracking-tight italic">RECENT LOGS</h3>
              <Gamepad2 className="w-5 h-5 text-zinc-700" />
            </div>
            <div className="bg-black/20 rounded-2xl p-12 text-center border border-white/5">
              <p className="text-xs text-zinc-600 uppercase tracking-widest font-black">No Active Logs Detected</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-[32px] p-8 border-emerald-accent/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black tracking-tight italic">GLOBAL RANKING</h3>
              <Link to="/leaderboard" className="text-emerald-accent hover:text-white transition-colors">
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-emerald-accent/5 rounded-2xl p-6 border border-emerald-accent/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-zinc-700 italic">#?</span>
                <div>
                  <p className="text-sm font-black uppercase tracking-wider">{user.displayName}</p>
                  <p className="text-[10px] text-emerald-accent font-bold uppercase tracking-widest">Active Operative</p>
                </div>
              </div>
              <div className="text-2xl font-black italic">{user.highScore.toLocaleString()}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon: Icon, label, value, color, children, index }: any) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className="glass-card rounded-[32px] p-8 relative overflow-hidden group"
    >
      <div 
        className="absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-center gap-4 mb-4">
        <div 
          className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/5"
          style={{ backgroundColor: `${color}10` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black">{label}</p>
          <h3 className="text-3xl font-black tracking-tight italic text-white mt-1 uppercase">{value}</h3>
        </div>
      </div>
      {children}
    </motion.div>
  );
}
