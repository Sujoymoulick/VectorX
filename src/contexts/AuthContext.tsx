import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

export type User = {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  isPremium: boolean;
  highScore: number;
  createdAt: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<{ error: any | null }>;
  register: (email: string, password?: string) => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
  updateHighScore: (score: number) => Promise<void>;
  upgradeToPremium: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: any | null }>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await fetchProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(supabaseUser: SupabaseUser) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const newProfile = {
          id: supabaseUser.id,
          display_name: supabaseUser.email?.split('@')[0] || 'Racer',
          role: 'user',
          is_premium: false,
          high_score: 0,
        };
        const { data: createdData, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createdData) {
          mapAndSetUser(createdData, supabaseUser.email!);
        }
      } else if (data) {
        mapAndSetUser(data, supabaseUser.email!);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }

  function mapAndSetUser(profile: any, email: string) {
    setUser({
      uid: profile.id,
      email: email,
      displayName: profile.display_name,
      role: profile.role,
      isPremium: profile.is_premium,
      highScore: profile.high_score,
      createdAt: profile.created_at,
    });
  }

  const login = async (email: string, password = 'password123') => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const register = async (email: string, password = 'password123') => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateHighScore = async (score: number) => {
    if (!user) return;
    if (score > user.highScore) {
      const { error } = await supabase
        .from('profiles')
        .update({ high_score: score })
        .eq('id', user.uid);
      
      if (!error) {
        setUser(prev => prev ? { ...prev, highScore: score } : null);
      }
    }
  };

  const upgradeToPremium = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ is_premium: true })
      .eq('id', user.uid);
    
    if (!error) {
      setUser(prev => prev ? { ...prev, isPremium: true } : null);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    });
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateHighScore, upgradeToPremium, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
