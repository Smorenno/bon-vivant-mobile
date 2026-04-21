import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setSession(null);
          router.replace('/(onboarding)/splash');
          return;
        }
        if (event === 'TOKEN_REFRESHED') {
          setSession(session);
          return;
        }
        setSession(session);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const inApp = segments[0] === '(app)';
    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';

    if (!session && inApp) {
      router.replace('/(onboarding)/splash');
      return;
    }
    if (session && (inAuth || inOnboarding)) {
      router.replace('/(app)');
      return;
    }
  }, [session, isLoading, segments]);

  return <Slot />;
}
