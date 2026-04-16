import { Link } from 'react-router-dom';
import { ArrowRight, Github, Twitter, Instagram, Info, ChevronRight, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import GameGrid from '../components/GameGrid';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen bg-forest-950 overflow-x-hidden font-sans">
      {/* Hero Section Wrapper */}
      <div className="min-h-screen flex items-center justify-center relative px-6 py-20">
        {/* Background Texture & Glows */}
        <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-accent/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-emerald-accent/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Main Hero Container */}
        <main className="relative z-10 w-full max-w-[1400px] min-h-[600px] h-auto md:h-[750px] flex items-stretch">
          
          {/* Left Sidebar (Reference style) */}
          <motion.aside 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="hidden xl:flex flex-col justify-center gap-8 px-8 border-r border-white/5 pr-12"
          >
            <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
            <div className="h-12 w-px bg-white/10 my-4" />
            <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Info className="w-5 h-5" /></a>
          </motion.aside>

          {/* Hero Card (Glass) */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "circOut" }}
            className="flex-1 glass-card rounded-[32px] md:rounded-[40px] flex flex-col md:flex-row items-center overflow-hidden relative shadow-[0_0_80px_rgba(0,0,0,0.5)] border-white/5"
          >
            
            {/* Content (Left side on desktop) */}
            <div className="flex-1 p-8 md:p-20 z-20 text-center md:text-left flex flex-col justify-center w-full">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black text-emerald-accent mb-6 block">#1 Racing Arena</span>
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-shadow-glow">
                  VECTOR<br /><span className="text-white/20 text-3xl sm:text-5xl md:text-8xl">ARENA</span>
                </h1>
                <p className="text-xs md:text-base text-zinc-400 max-w-sm mx-auto md:mx-0 mb-12 leading-relaxed font-medium">
                  Experience high-octane 2D racing directly in your browser. Join millions of players, customize your rig, and climb the global rankings.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6">
                  <Link 
                    to={user ? "/play/ag-racer" : "/auth"} 
                    className="group flex items-center gap-4 bg-emerald-accent text-forest-950 px-10 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-cyber-lime transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.3)] w-full sm:w-auto justify-center"
                  >
                    Start Racing <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/leaderboard" 
                    className="flex items-center gap-4 text-white font-bold text-[11px] uppercase tracking-[0.2em] hover:text-emerald-accent transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-emerald-accent transition-colors">
                      <Play className="w-3 h-3 fill-current" />
                    </div>
                    Watch Trailer
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Hero Image / Figure (Right side on desktop) */}
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1.5, ease: "circOut" }}
              className="w-full md:w-[50%] h-[300px] md:h-full relative mt-auto md:mt-0"
            >
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent via-transparent to-forest-900/40 md:to-forest-900/80 z-10" />
              <img 
                src="/images/hero_racer.png" 
                alt="VelocityX Racer" 
                className="w-full h-full object-cover object-center scale-110 md:scale-100"
              />
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* Game Library Section */}
      <section className="relative z-10 py-20 md:py-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 md:mb-24"
          >
            <span className="text-emerald-accent text-[10px] uppercase tracking-[0.4em] font-black mb-4 block">Archive 02</span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 italic">CHOOSE YOUR ARENA</h2>
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-transparent via-emerald-accent/50 to-transparent mx-auto mb-8" />
            <p className="text-zinc-500 max-w-lg mx-auto text-xs md:text-sm leading-relaxed px-4">
              From the infinite void to high-gravity physics tests, our expanded library offers diverse challenges across the vector galaxy.
            </p>
          </motion.div>

          <GameGrid />
        </div>
      </section>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 right-40 hidden lg:block opacity-20">
        <div className="w-32 h-32 border border-emerald-accent/30 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
