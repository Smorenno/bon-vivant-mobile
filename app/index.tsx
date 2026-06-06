import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { storage } from '@/services/storage';
import { supabase } from '@/services/supabase';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const seen = await storage.getOnboardingSeen();
      const { data: { session } } = await supabase.auth.getSession();

      if (!seen) {
        router.replace('/(onboarding)/splash');
      } else if (seen && session) {
        router.replace('/(app)');
      } else {
        router.replace('/(auth)/login');
      }
    }
    init();
  }, []);

  return null;
}
