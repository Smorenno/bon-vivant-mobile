import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { storage } from '@/services/storage';
import { useAuthStore } from '@/stores/authStore';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();
  const isGuest = useAuthStore((s) => s.isGuest);
  const setGuest = useAuthStore((s) => s.setGuest);

  useEffect(() => {
    Promise.all([
      supabase.auth.getSession(),
      storage.getGuestMode(),
    ]).then(([{ data: { session: initialSession } }, guestMode]) => {
      setSession(initialSession);
      if (guestMode) setGuest(true);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (event === 'SIGNED_OUT') {
          setSession(null);
          // Onboarding already seen — go to login, not splash
          router.replace('/(auth)/login');
          return;
        }
        if (event === 'SIGNED_IN' && newSession) {
          // OAuth or any sign-in clears guest mode
          storage.clearGuestMode().then(() => setGuest(false));
        }
        setSession(newSession);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const inApp = segments[0] === '(app)';
    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';

    // Guests are allowed into /(app) without a session
    if (!session && !isGuest && inApp) {
      router.replace('/(auth)/login');
      return;
    }
    if (session && (inAuth || inOnboarding)) {
      router.replace('/(app)');
      return;
    }
  }, [session, isGuest, isLoading, segments]);

  return <Slot />;
}
