import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, User, LogOut, ShieldAlert, Crown, Menu } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 z-50 w-full px-6 py-6 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="group flex items-center gap-3 text-white font-bold text-2xl tracking-tighter">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-accent/20 blur-lg group-hover:bg-emerald-accent/40 transition-colors" />
              <div className="relative w-2 h-2 rounded-full bg-emerald-accent shadow-[0_0_10px_#10b981]" />
            </div>
            Velocity<span className="text-emerald-accent">X</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500">
            <Link to="/leaderboard" className="hover:text-white transition-colors">
              Ranking
            </Link>
            {user && (
              <Link to="/play" className="hover:text-white transition-colors">
                Play
              </Link>
            )}
            <Link to="/" className="hover:text-white transition-colors">
              About
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-5 glass-panel px-4 py-2 rounded-full shadow-2xl">
              {user.isPremium && (
                <Crown className="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="text-zinc-400 hover:text-white transition-colors">
                  <ShieldAlert className="w-4 h-4" />
                </Link>
              )}
              <Link to="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
                <User className="w-4 h-4" />
              </Link>
              <button 
                onClick={handleLogout}
                className="text-zinc-400 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <Link to="/auth" className="text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500 hover:text-white transition-colors">
                Join
              </Link>
              <Link 
                to="/auth" 
                className="glass-card px-8 py-2.5 rounded-full text-[11px] uppercase tracking-[0.2em] font-black text-white hover:bg-white/10 transition-all border-white/20"
              >
                Sign In
              </Link>
            </div>
          )}
          <button className="md:hidden text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
