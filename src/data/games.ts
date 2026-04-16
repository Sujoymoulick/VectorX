import { Rocket, Satellite, Mountain, Zap, Box, Disc, Target, BoxSelect, Magnet, ShieldAlert, Bug, ArrowDown, Crosshair, Sword, Layout, Music, Cpu, Ghost, Move } from 'lucide-react';

export type GameCategory = 'Space' | 'Sports & Physics' | 'Action & Survival' | 'Abstract & Experimental';
export type EngineType = 'space' | 'combat' | 'physics' | 'abstract';

export interface Game {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  icon: any;
  color: string;
  isPlayable?: boolean;
  engineType: EngineType;
  params?: {
    speed?: number;
    difficulty?: number;
    accentColor?: string;
  };
}

export const GAMES: Game[] = [
  // Space
  {
    id: 'ag-racer',
    title: 'AG-Racer Velocity',
    description: 'High-speed racing on tracks that twist upside down.',
    category: 'Space',
    icon: Rocket,
    color: '#10b981',
    isPlayable: true,
    engineType: 'space',
    params: { speed: 25, accentColor: '#10b981' }
  },
  {
    id: 'zero-g-combat',
    title: 'Zero-G Combat',
    description: '3D dogfighting where there is no "up" or "down."',
    category: 'Space',
    icon: Satellite,
    color: '#10b981',
    isPlayable: true,
    engineType: 'combat',
    params: { difficulty: 0.8, accentColor: '#10b981' }
  },
  {
    id: 'vector-wings',
    title: 'Vector Wings',
    description: 'A flight simulator using only wireframe mountain ranges.',
    category: 'Space',
    icon: Mountain,
    color: '#10b981',
    isPlayable: true,
    engineType: 'space',
    params: { speed: 15, accentColor: '#059669' }
  },
  {
    id: 'orbital-drift',
    title: 'Orbital Drift',
    description: 'A physics game about using gravity wells to sling-shot your ship.',
    category: 'Space',
    icon: Zap,
    color: '#10b981',
    isPlayable: true,
    engineType: 'physics',
    params: { difficulty: 0.5, accentColor: '#10b981' }
  },
  {
    id: 'void-voyager',
    title: 'Void Voyager',
    description: 'A chill, infinite exploration game through a procedurally generated vector galaxy.',
    category: 'Space',
    icon: Satellite,
    color: '#10b981',
    isPlayable: true,
    engineType: 'abstract',
    params: { speed: 10, accentColor: '#10b981' }
  },

  // Sports & Physics
  {
    id: 'vector-disc',
    title: 'Vector Disc',
    description: 'A 3D "Tron-style" disc-throwing game in a zero-gravity arena.',
    category: 'Sports & Physics',
    icon: Disc,
    color: '#3b82f6',
    isPlayable: true,
    engineType: 'physics'
  },
  {
    id: 'neon-hoops',
    title: 'Neon Hoops',
    description: 'A 3D basketball game where the ball moves in a low-gravity arc.',
    category: 'Sports & Physics',
    icon: Target,
    color: '#3b82f6',
    isPlayable: true,
    engineType: 'physics'
  },
  {
    id: 'cyber-squash',
    title: 'Cyber-Squash',
    description: 'Bounce a vector cube off four walls in a first-person 3D room.',
    category: 'Sports & Physics',
    icon: BoxSelect,
    color: '#3b82f6',
    isPlayable: true,
    engineType: 'physics'
  },
  {
    id: 'gravity-pool',
    title: 'Gravity Pool',
    description: 'Billiards, but the table is a 3D wireframe cube.',
    category: 'Sports & Physics',
    icon: Box,
    color: '#3b82f6',
    isPlayable: true,
    engineType: 'physics'
  },
  {
    id: 'magneto-ball',
    title: 'Magneto-Ball',
    description: 'Use polarities to push/pull a metallic sphere through a maze.',
    category: 'Sports & Physics',
    icon: Magnet,
    color: '#3b82f6',
    isPlayable: true,
    engineType: 'physics'
  },

  // Action & Survival
  {
    id: 'grid-breach',
    title: 'Grid Breach',
    description: 'Hack through layers of a 3D security "node" while dodging red security lines.',
    category: 'Action & Survival',
    icon: ShieldAlert,
    color: '#ef4444',
    isPlayable: true,
    engineType: 'combat'
  },
  {
    id: 'vector-swarm',
    title: 'Vector Swarm',
    description: 'Survive as long as possible against a 3D cloud of geometric bees.',
    category: 'Action & Survival',
    icon: Bug,
    color: '#ef4444',
    isPlayable: true,
    engineType: 'combat',
    params: { difficulty: 0.9 }
  },
  {
    id: 'prism-fall',
    title: 'Prism Fall',
    description: 'Free-fall through a vertical tunnel filled with spinning neon blades.',
    category: 'Action & Survival',
    icon: ArrowDown,
    color: '#ef4444',
    isPlayable: true,
    engineType: 'space',
    params: { speed: 40 }
  },
  {
    id: 'laser-defense',
    title: 'Laser Defense',
    description: 'Man a 3D turret to shoot down incoming vector asteroids.',
    category: 'Action & Survival',
    icon: Crosshair,
    color: '#ef4444',
    isPlayable: true,
    engineType: 'combat'
  },
  {
    id: 'silicon-samurai',
    title: 'Silicon Samurai',
    description: 'First-person sword combat using wireframe katanas.',
    category: 'Action & Survival',
    icon: Sword,
    color: '#ef4444',
    isPlayable: true,
    engineType: 'combat'
  },

  // Abstract & Experimental
  {
    id: 'fractal-explorer',
    title: 'Fractal Explorer',
    description: 'A visualizer game where you fly into ever-changing fractal patterns.',
    category: 'Abstract & Experimental',
    icon: Layout,
    color: '#a855f7',
    isPlayable: true,
    engineType: 'abstract'
  },
  {
    id: 'synth-wave-beats',
    title: 'Synth-Wave Beats',
    description: 'A rhythm game where you hit notes on a 3D scrolling vector highway.',
    category: 'Abstract & Experimental',
    icon: Music,
    color: '#a855f7',
    isPlayable: true,
    engineType: 'space',
    params: { speed: 30 }
  },
  {
    id: 'logic-gate',
    title: 'Logic Gate',
    description: 'A puzzle game where you connect 3D nodes to power up a wireframe city.',
    category: 'Abstract & Experimental',
    icon: Cpu,
    color: '#a855f7',
    isPlayable: true,
    engineType: 'physics'
  },
  {
    id: 'the-monolith',
    title: 'The Monolith',
    description: 'A mystery game—navigate a giant, silent 3D wireframe structure.',
    category: 'Abstract & Experimental',
    icon: Ghost,
    color: '#a855f7',
    isPlayable: true,
    engineType: 'abstract'
  },
  {
    id: 'vector-morph',
    title: 'Vector-Morph',
    description: 'Control a shape that must transform to fit through moving 3D holes.',
    category: 'Abstract & Experimental',
    icon: Move,
    color: '#a855f7',
    isPlayable: true,
    engineType: 'space'
  },
  {
    id: 'hyper-cube',
    title: 'Hyper-Cube',
    description: 'A complex 4D-tesseract navigation puzzle.',
    category: 'Abstract & Experimental',
    icon: Box,
    color: '#a855f7',
    isPlayable: true,
    engineType: 'abstract'
  }
];
