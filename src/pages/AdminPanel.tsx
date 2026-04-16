import { useEffect, useState } from 'react';
import { ShieldAlert, Users, Trash2, Loader2 } from 'lucide-react';
import { User } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setUsers(data.map(p => ({
          uid: p.id,
          email: 'Hidden', // Email is in auth.users, fetchable only via admin API
          displayName: p.display_name,
          role: p.role,
          isPremium: p.is_premium,
          highScore: p.high_score,
          createdAt: p.created_at,
        })));
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteUser = async (id: string) => {
    // Note: Actual user deletion from auth requires Supabase Admin API/Edge Function.
    // Here we can at least remove their profile record if RLS allows or if it's a soft delete.
    const confirmDelete = window.confirm('Are you sure you want to remove this user profile? This will not delete their auth account but will remove their stats.');
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (!error) {
      setUsers(prev => prev.filter(u => u.uid !== id));
    } else {
      alert('Error deleting profile: ' + error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-zinc-400">Manage users and platform settings.</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-zinc-400" />
          <h2 className="text-xl font-bold">Registered Users ({users.length})</h2>
        </div>
        
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-zinc-500 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-950/50 text-zinc-400 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">High Score</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium">{user.displayName}</p>
                      <p className="text-sm text-zinc-500">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${user.role === 'admin' ? 'bg-red-500/10 text-red-400' : 'bg-zinc-800 text-zinc-300'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${user.isPremium ? 'bg-indigo-500/10 text-indigo-400' : 'bg-zinc-800 text-zinc-300'}`}>
                        {user.isPremium ? 'Pro' : 'Free'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono">{user.highScore.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteUser(user.uid)}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Delete user profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
