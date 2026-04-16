import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, User, LogOut, ShieldAlert, Crown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const menuLinks = [
    { label: 'Ranking', to: '/leaderboard' },
    { label: 'Play', to: '/play/ag-racer', show: !!user },
    { label: 'About', to: '/' },
  ];

  return (
    <>
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
              {menuLinks.filter(link => link.show !== false).map(link => (
                <Link key={link.label} to={link.to} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
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
            </div>

            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden text-zinc-400 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-forest-950 border-l border-white/5 z-[70] p-12 shadow-2xl"
            >
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-12 right-12 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="h-full flex flex-col justify-between">
                <div className="space-y-12">
                  <div className="text-white font-bold text-2xl tracking-tighter">
                    Velocity<span className="text-emerald-accent">X</span>
                  </div>

                  <nav className="flex flex-col gap-8">
                    {menuLinks.filter(link => link.show !== false).map(link => (
                      <Link 
                        key={link.label} 
                        to={link.to} 
                        onClick={() => setIsMenuOpen(false)}
                        className="text-2xl font-black italic tracking-tighter text-zinc-500 hover:text-emerald-accent transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                    {user ? (
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsMenuOpen(false)}
                        className="text-2xl font-black italic tracking-tighter text-zinc-500 hover:text-emerald-accent transition-colors"
                      >
                        Identity
                      </Link>
                    ) : (
                      <Link 
                        to="/auth" 
                        onClick={() => setIsMenuOpen(false)}
                        className="text-2xl font-black italic tracking-tighter text-zinc-500 hover:text-emerald-accent transition-colors"
                      >
                        Initialize Identity
                      </Link>
                    )}
                  </nav>
                </div>

                {user && (
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-4 text-red-400 font-bold uppercase tracking-widest text-xs"
                  >
                    <LogOut className="w-4 h-4" /> Terminate Session
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
