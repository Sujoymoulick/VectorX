import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Loader2, ArrowLeft, ChevronRight, Lock, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setError(null);
    setIsLoading(true);

    try {
      const { error: authError } = isLogin 
        ? await login(email, password)
        : await register(email, password);

      if (authError) {
        setError(authError.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const { error: authError } = await signInWithGoogle();
      if (authError) {
        setError(authError.message);
        setIsLoading(false);
      }
      // Note: Redirect is handled by Supabase OAuth
    } catch (err: any) {
      setError('Google Sign-In failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-forest-950 p-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-emerald-accent/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-emerald-accent/10 blur-[150px] rounded-full" />

      {/* Back to Home */}
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="absolute top-12 left-12 flex items-center gap-3 text-zinc-500 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-black">Escape</span>
      </motion.button>

      {/* Auth Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="glass-card rounded-[40px] p-12 md:p-16 shadow-[0_0_100px_rgba(0,0,0,0.6)]">
          <div className="mb-12">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="w-12 h-12 rounded-2xl bg-emerald-accent/20 flex items-center justify-center mb-8 border border-emerald-accent/20"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-accent shadow-[0_0_10px_#10b981]" />
            </motion.div>
            
            <h2 className="text-4xl font-black tracking-tighter mb-4 text-shadow-glow">
              {isLogin ? 'WELCOME BACK' : 'JOIN ARENA'}
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-[280px]">
              {isLogin ? 'Enter your credentials to descend back into the race.' : 'Create an identity to start your journey in VectorX.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-bold uppercase tracking-wider overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.3em] font-black text-zinc-600 ml-4 mb-2">Identify</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 transition-colors group-focus-within:text-emerald-accent" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="racer@velocity.x"
                  className="w-full pl-16 pr-8 py-5 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-emerald-accent/50 focus:bg-white/[0.05] outline-none transition-all text-white placeholder:text-zinc-700 text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" { ...{"className": "block text-[10px] uppercase tracking-[0.3em] font-black text-zinc-600 ml-4 mb-2"} }>Credentials</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 transition-colors group-focus-within:text-emerald-accent" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-16 pr-8 py-5 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-emerald-accent/50 focus:bg-white/[0.05] outline-none transition-all text-white placeholder:text-zinc-700 text-sm font-medium"
                  required
                  minLength={6}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 mt-6 rounded-2xl bg-emerald-accent text-forest-950 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-cyber-lime transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            >
              {isLoading && isLogin ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>}
              {!isLoading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-black text-zinc-500">
              <span className="bg-[#08120a] px-4">Synchronize Identity</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-5 rounded-2xl bg-white/[0.03] border border-white/5 text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white/[0.08] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-5 h-5 flex items-center justify-center bg-white rounded-full p-1 group-hover:scale-110 transition-transform">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
            <span>Continue with Google</span>
          </button>

          <div className="mt-10 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 hover:text-white transition-colors"
            >
              {isLogin ? "Need an identity? Register" : "Existing Identity? Sign In"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
