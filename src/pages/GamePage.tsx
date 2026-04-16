import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Play, RotateCcw, Gamepad2, ArrowLeft, Info } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky, PerspectiveCamera, Box, Sphere, Grid, Float, Text, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { GAMES, Game } from '../data/games';

// Constants
const LANE_WIDTH = 3;
const SPEED_INITIAL = 20;
const SPAWN_Z = -100;
const DESPAWN_Z = 20;

// Game State
type Obstacle = {
  id: number;
  x: number;
  z: number;
  type: 'car' | 'rock';
  speedMod: number;
};

function SpaceEngine({ game, isPlaying, isGameOver, endGame, updateScore, user }: { 
  game: Game, isPlaying: boolean, isGameOver: boolean, endGame: () => void, updateScore: (s: number) => void, user: any 
}) {
  const carRef = useRef<THREE.Group>(null);
  const gridRef = useRef<THREE.Mesh>(null);
  const [lane, setLane] = useState(1);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const state = useRef({ score: 0, speed: game.params?.speed || SPEED_INITIAL, lastObstacleTime: 0, gridOffset: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') setLane(l => Math.max(0, l - 1));
      else if (e.key === 'ArrowRight' || e.key === 'd') setLane(l => Math.min(2, l + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver]);

  useFrame((_, delta) => {
    if (!isPlaying || isGameOver) return;
    state.current.score += delta * state.current.speed;
    updateScore(state.current.score);
    state.current.speed += delta * 0.1;

    if (gridRef.current) {
      state.current.gridOffset += state.current.speed * delta;
      if (state.current.gridOffset > 10) state.current.gridOffset -= 10;
      gridRef.current.position.z = state.current.gridOffset;
    }

    const targetX = (lane - 1) * LANE_WIDTH;
    if (carRef.current) {
      carRef.current.position.x += (targetX - carRef.current.position.x) * 10 * delta;
      carRef.current.rotation.z += ((carRef.current.position.x - targetX) * 0.2 - carRef.current.rotation.z) * 10 * delta;
      carRef.current.rotation.y = (carRef.current.position.x - targetX) * 0.1;
    }

    const now = Date.now();
    if (now - state.current.lastObstacleTime > Math.max(300, 1200 - state.current.speed * 10)) {
      const newLane = Math.floor(Math.random() * 3);
      setObstacles(prev => [...prev, {
        id: Math.random(),
        x: (newLane - 1) * LANE_WIDTH,
        z: SPAWN_Z,
        type: Math.random() > 0.5 ? 'car' : 'rock',
        speedMod: Math.random() > 0.5 ? Math.random() * 5 : 0
      }]);
      state.current.lastObstacleTime = now;
    }

    setObstacles(prev => {
      let hit = false;
      const next = prev.map(obs => {
        const newZ = obs.z + (state.current.speed + obs.speedMod) * delta;
        if (carRef.current && Math.abs(carRef.current.position.x - obs.x) < 1.4 && Math.abs(0 - newZ) < 2) hit = true;
        return { ...obs, z: newZ };
      }).filter(obs => obs.z < DESPAWN_Z);
      if (hit) endGame();
      return next;
    });
  });

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      state.current = { score: 0, speed: game.params?.speed || SPEED_INITIAL, lastObstacleTime: Date.now(), gridOffset: 0 };
      setObstacles([]);
      setLane(1);
    }
  }, [isPlaying, isGameOver, game]);

  const accentColor = game.params?.accentColor || game.color;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 12]} fov={60} rotation={[-0.2, 0, 0]} />
      <Sky sunPosition={[0, 0.05, -10]} turbidity={0.1} rayleigh={0.5} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 10, -10]} intensity={1.5} color={accentColor} />
      
      <group ref={gridRef as any}>
        <Grid args={[100, 200]} cellSize={2} cellColor="#1a1a1a" sectionSize={10} sectionColor={accentColor} fadeDistance={100} />
      </group>

      <group ref={carRef} position={[0, 0.5, 0]}>
        <Box args={[1.5, 0.6, 2.5]}>
          <meshStandardMaterial color={user?.isPremium ? '#fbbf24' : '#ffffff'} metalness={0.9} roughness={0.1} />
        </Box>
        <Trail width={1} length={8} color={accentColor} attenuation={(t) => t * t}>
         <mesh position={[0, 0, 1.2]} />
        </Trail>
      </group>

      {obstacles.map(obs => (
        <group key={obs.id} position={[obs.x, 0.5, obs.z]}>
          {obs.type === 'car' ? (
            <Box args={[1.5, 0.6, 2.5]}><meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} /></Box>
          ) : (
            <Sphere args={[0.8, 8, 8]}><meshStandardMaterial color="#3f3f46" wireframe /></Sphere>
          )}
        </group>
      ))}
    </>
  );
}

function CombatEngine({ game, isPlaying, isGameOver, endGame, updateScore }: any) {
  const [enemies, setEnemies] = useState<any[]>([]);
  const weaponRef = useRef<THREE.Group>(null);
  const state = useRef({ score: 0, lastSpawn: 0, mouseX: 0, mouseY: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      state.current.mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
      state.current.mouseY = (e.clientY / window.innerHeight - 0.5) * -15;
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  useFrame((_, delta) => {
    if (!isPlaying || isGameOver) return;
    state.current.score += delta * 100;
    updateScore(state.current.score);

    if (weaponRef.current) {
      weaponRef.current.position.x += (state.current.mouseX - weaponRef.current.position.x) * 5 * delta;
      weaponRef.current.position.y += (state.current.mouseY - weaponRef.current.position.y) * 5 * delta;
    }

    if (Date.now() - state.current.lastSpawn > 800) {
      setEnemies(prev => [...prev, {
        id: Math.random(),
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 20,
        z: -100,
        speed: 40 + Math.random() * 20
      }]);
      state.current.lastSpawn = Date.now();
    }

    setEnemies(prev => {
      let hit = false;
      const next = prev.map(e => {
        const newZ = e.z + e.speed * delta;
        if (Math.abs(e.x - state.current.mouseX) < 2 && Math.abs(e.y - state.current.mouseY) < 2 && Math.abs(newZ) < 2) hit = true;
        return { ...e, z: newZ };
      }).filter(e => e.z < 10);
      if (hit) endGame();
      return next;
    });
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <Sky sunPosition={[0, 0, -1]} />
      <group ref={weaponRef}>
        <Box args={[0.5, 0.5, 2]}><meshStandardMaterial color={game.color} wireframe /></Box>
        <pointLight intensity={2} color={game.color} />
      </group>
      {enemies.map(e => (
        <Float key={e.id} speed={5} rotationIntensity={2} floatIntensity={2}>
          <Box position={[e.x, e.y, e.z]} args={[2, 2, 2]}>
            <meshStandardMaterial color="#ef4444" wireframe />
          </Box>
        </Float>
      ))}
      <Grid infiniteGrid fadeDistance={50} cellColor="#111" sectionColor={game.color} />
    </>
  );
}

function PhysicsEngine({ game, isPlaying, isGameOver, updateScore }: any) {
  const ballRef = useRef<THREE.Mesh>(null);
  const state = useRef({ score: 0, vx: 5, vy: 5, vz: 5 });

  useFrame((_, delta) => {
    if (!isPlaying || isGameOver) return;
    state.current.score += delta * 50;
    updateScore(state.current.score);

    if (ballRef.current) {
      ballRef.current.position.x += state.current.vx * delta;
      ballRef.current.position.y += state.current.vy * delta;
      ballRef.current.position.z += state.current.vz * delta;

      if (Math.abs(ballRef.current.position.x) > 10) state.current.vx *= -1;
      if (Math.abs(ballRef.current.position.y) > 10) state.current.vy *= -1;
      if (Math.abs(ballRef.current.position.z) > 10) state.current.vz *= -1;
      
      ballRef.current.rotation.x += delta * 2;
      ballRef.current.rotation.y += delta * 2;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 25]} />
      <Box args={[22, 22, 22]}>
        <meshStandardMaterial color={game.color} wireframe transparent opacity={0.1} />
      </Box>
      <Sphere ref={ballRef as any} args={[1.5, 16, 16]}>
        <meshStandardMaterial color={game.color} emissive={game.color} emissiveIntensity={0.5} />
      </Sphere>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={1} color={game.color} />
    </>
  );
}

function AbstractEngine({ game, isPlaying, isGameOver, updateScore }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const state = useRef({ score: 0 });

  useFrame((stateObj, delta) => {
    if (!isPlaying || isGameOver) return;
    state.current.score += delta * 20;
    updateScore(state.current.score);
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.2;
      groupRef.current.position.z = Math.sin(stateObj.clock.elapsedTime) * 5;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} />
      <group ref={groupRef}>
        {[...Array(20)].map((_, i) => (
          <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1}>
            <Box 
              position={[(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30]} 
              args={[1, 1, 1]}
            >
              <meshStandardMaterial color={game.color} wireframe />
            </Box>
          </Float>
        ))}
      </group>
      <Sky sunPosition={[0, 1, 0]} />
      <Text position={[0, 0, -10]} fontSize={2} color={game.color} font="/fonts/Inter-Bold.woff">
        {game.title.toUpperCase()}
      </Text>
    </>
  );
}

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { user, updateHighScore } = useAuth();
  const navigate = useNavigate();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const game = useMemo(() => GAMES.find(g => g.id === gameId), [gameId]);

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-forest-950 p-6 text-center">
        <h1 className="text-4xl font-black mb-4">ARENA NOT FOUND</h1>
        <Link to="/dashboard" className="text-emerald-accent font-bold uppercase tracking-widest hover:text-white transition-colors">
          Return to Identity Dashboard
        </Link>
      </div>
    );
  }

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
  };

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    updateHighScore(Math.floor(score));
  };

  const renderEngine = () => {
    const props = { game, isPlaying, isGameOver, endGame, updateScore: setScore, user };
    switch (game.engineType) {
      case 'space': return <SpaceEngine {...props} />;
      case 'combat': return <CombatEngine {...props} />;
      case 'physics': return <PhysicsEngine {...props} />;
      case 'abstract': return <AbstractEngine {...props} />;
      default: return <SpaceEngine {...props} />;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-32 font-sans">
      <div className="flex flex-col xl:flex-row gap-12">
        {/* Game Area */}
        <div className="flex-1 relative group">
          <div className="glass-card rounded-[40px] overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.4)] aspect-video md:aspect-[16/9] min-h-[500px]">
            <Canvas shadows gl={{ antialias: true }}>
              {renderEngine()}
            </Canvas>
            
            {/* Overlays */}
            {!isPlaying && !isGameOver && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center text-center p-12 z-10">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="max-w-md"
                >
                  <div className="w-20 h-20 rounded-3xl bg-emerald-accent/20 flex items-center justify-center mb-8 mx-auto border border-emerald-accent/20">
                    <game.icon className="w-10 h-10 text-emerald-accent" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase italic">{game.title}</h2>
                  <p className="text-zinc-500 mb-10 text-sm font-medium leading-relaxed">{game.description}</p>
                  <button 
                    onClick={startGame}
                    className="group bg-emerald-accent text-forest-950 px-12 py-5 rounded-full font-black text-[12px] uppercase tracking-[0.3em] hover:bg-cyber-lime transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-4 mx-auto"
                  >
                    Initialize Neural Link <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </div>
            )}

            {isGameOver && (
              <div className="absolute inset-0 bg-red-950/90 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-12 z-10">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                  <h2 className="text-6xl md:text-8xl font-black text-white mb-6 uppercase tracking-tighter italic">NEURAL DISCONNECT</h2>
                  <div className="bg-black/40 rounded-3xl p-8 mb-10 border border-white/5 inline-block">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-black mb-2">Sync Data Integrity</p>
                    <div className="text-7xl font-black text-white font-mono italic">{Math.floor(score).toLocaleString()}</div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button 
                      onClick={startGame}
                      className="flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all hover:scale-105"
                    >
                      <RotateCcw className="w-4 h-4" /> Re-Initialize
                    </button>
                    <Link 
                      to="/dashboard"
                      className="flex items-center gap-4 bg-white/5 text-white px-10 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white/10 border border-white/10 transition-all"
                    >
                      Exit Arena
                    </Link>
                  </div>
                </motion.div>
              </div>
            )}

            {/* HUD */}
            {isPlaying && (
              <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none z-10">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-4"
                >
                  <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em] mb-1">Velocity Score</p>
                  <p className="text-4xl font-mono font-black text-white italic">{Math.floor(score)}</p>
                </motion.div>
                
                <div className="flex flex-col items-end gap-3">
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3">
                    <p className="text-[9px] text-emerald-accent font-black uppercase tracking-[0.3em]">Link Stable</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full xl:w-[400px] flex flex-col gap-8">
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glass-card rounded-[40px] p-10"
          >
            <div className="flex items-center gap-5 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/20">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-2xl font-black italic tracking-tight">OPERATIVE STATS</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-black/40 rounded-3xl p-6 border border-white/5">
                <p className="text-[9px] text-zinc-500 uppercase tracking-[0.3em] font-black mb-2">Personal Best</p>
                <p className="text-3xl font-mono font-black italic">{user?.highScore.toLocaleString()}</p>
              </div>
              
              <div className="bg-black/40 rounded-3xl p-6 border border-white/5">
                <p className="text-[9px] text-zinc-500 uppercase tracking-[0.3em] font-black mb-4">Neural Rig</p>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center ${user?.isPremium ? 'bg-amber-500/10 border-amber-500/50' : 'bg-indigo-500/10 border-indigo-500/50'}`}>
                    <Gamepad2 className={`w-5 h-5 ${user?.isPremium ? 'text-amber-500' : 'text-indigo-500'}`} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider">{user?.isPremium ? 'Titanium Core' : 'Nerv Guard Original'}</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{user?.isPremium ? 'Pro Clearance' : 'Standard Identity'}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-[40px] p-10 relative overflow-hidden group"
          >
            <div className="flex items-center gap-5 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-accent/20 flex items-center justify-center border border-emerald-accent/20">
                <Info className="w-6 h-6 text-emerald-accent" />
              </div>
              <h3 className="text-2xl font-black italic tracking-tight uppercase">Manual</h3>
            </div>
            
            <div className="space-y-5">
              <ControlItem label="Lateral Motion" keys={['A', 'D']} />
              <ControlItem label="Vector Align" keys={['←', '→']} />
              <div className="pt-4 border-t border-white/5 mt-4">
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                  Synchronization requires rapid response to vector shifts. Maintain neural focus to prevent disconnect.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ControlItem({ label, keys }: { label: string, keys: string[] }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400">{label}</span>
      <div className="flex gap-2">
        {keys.map(k => (
          <kbd key={k} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono font-black text-white">{k}</kbd>
        ))}
      </div>
    </div>
  );
}
