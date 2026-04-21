import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { storage } from '@/services/storage';
import { supabase } from '@/services/supabase';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const [seen, { data }] = await Promise.all([
        storage.getOnboardingSeen(),
        supabase.auth.getSession(),
      ]);

      if (!seen) {
        router.replace('/(onboarding)/splash');
      } else if (data.session) {
        router.replace('/(app)');
      } else {
        router.replace('/(app)');
      }
    }
    init();
  }, []);

  return null;
}
