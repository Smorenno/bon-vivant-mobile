import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { storage } from '@/services/storage';
import { supabase } from '@/services/supabase';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();

      // Registered users always skip onboarding, even after reinstall
      if (session) {
        router.replace('/(app)');
        return;
      }

      const seen = await storage.getOnboardingSeen();
      if (!seen) {
        router.replace('/(onboarding)/splash');
        return;
      }

      const isGuest = await storage.getGuestMode();
      router.replace(isGuest ? '/(app)' : '/(auth)/login');
    }
    init();
  }, []);

  return null;
}
