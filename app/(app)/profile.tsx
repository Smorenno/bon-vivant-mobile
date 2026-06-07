import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { storage } from '@/services/storage';
import { supabase } from '@/services/supabase'; // DEV ONLY — borrar junto con el bloque __DEV__ de abajo
import Button from '@/components/ui/Button';
import { Colors } from '@/constants/colors';

export default function Profile() {
  const router = useRouter();
  const signOut = useAuthStore((s) => s.signOut);
  const setGuest = useAuthStore((s) => s.setGuest); // DEV ONLY — borrar junto con el bloque __DEV__ de abajo

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Button
          label="Sign out"
          onPress={signOut}
          variant="secondary"
          style={styles.button}
        />
        {/* DEV ONLY — borrar este bloque entero antes de release */}
        {__DEV__ && (
          <Button
            label="[DEV] Reset onboarding"
            variant="ghost"
            onPress={async () => {
              await supabase.auth.signOut();
              await storage.resetOnboarding();
              setGuest(false);
              router.replace('/(onboarding)/splash');
            }}
            style={styles.devButton}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 32,
  },
  button: {
    width: 280,
    marginBottom: 12,
  },
  devButton: { // DEV ONLY — borrar junto con el bloque __DEV__ de arriba
    width: 280,
    marginTop: 32,
    opacity: 0.5,
  },
});
