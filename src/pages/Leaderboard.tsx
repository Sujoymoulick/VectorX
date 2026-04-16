import { useEffect, useState } from 'react';
import { Trophy, Medal, Loader2 } from 'lucide-react';
import { User } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('high_score', { ascending: false })
          .limit(10);

        if (data) {
          setLeaders(data.map(p => ({
            uid: p.id,
            email: '', // Email is private, don't show it here
            displayName: p.display_name,
            role: p.role,
            isPremium: p.is_premium,
            highScore: p.high_score,
            createdAt: p.created_at,
          })));
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 mb-6">
          <Trophy className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Global Leaderboard</h1>
        <p className="text-zinc-400">The fastest racers in the world.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-zinc-500 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <p>Loading ranking...</p>
          </div>
        ) : leaders.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <p>No scores recorded yet.</p>
            <p className="text-sm mt-1">Be the first to set a high score!</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {leaders.map((user, index) => (
              <div key={user.uid} className="flex items-center justify-between p-6 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="w-8 text-center">
                    {index === 0 ? <Medal className="w-8 h-8 text-amber-400 mx-auto" /> :
                     index === 1 ? <Medal className="w-8 h-8 text-zinc-300 mx-auto" /> :
                     index === 2 ? <Medal className="w-8 h-8 text-amber-700 mx-auto" /> :
                     <span className="text-xl font-bold text-zinc-500">#{index + 1}</span>}
                  </div>
                  <div>
                    <p { ...{ "className": "font-semibold text-lg flex items-center gap-2" } }>
                      {user.displayName}
                      {user.isPremium && <span className="text-[10px] uppercase tracking-wider bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">Pro</span>}
                    </p>
                    <p className="text-sm text-zinc-400">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono">
                  {user.highScore.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
