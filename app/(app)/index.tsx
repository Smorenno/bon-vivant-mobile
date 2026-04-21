import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';
import { Colors } from '@/constants/colors';

export default function Home() {
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <Button
          label="Sign out"
          onPress={signOut}
          variant="secondary"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.text, marginBottom: 32 },
  button: { width: 200 },
});
