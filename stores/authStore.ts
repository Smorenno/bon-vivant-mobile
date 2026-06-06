import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { supabase } from '@/services/supabase';
import { storage } from '@/services/storage';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isOnboarded: boolean;
  isGuest: boolean;
  setSession: (session: Session | null) => void;
  setOnboarded: (val: boolean) => void;
  setGuest: (val: boolean) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: false,
  isOnboarded: false,
  isGuest: false,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setOnboarded: (val) => set({ isOnboarded: val }),
  setGuest: (val) => set({ isGuest: val }),
  signOut: async () => {
    await supabase.auth.signOut();
    await storage.clearGuestMode();
    set({ user: null, session: null, isGuest: false });
    // Navigate to login — onboarding already seen, never go back to splash
    router.replace('/(auth)/login');
  },
}));
