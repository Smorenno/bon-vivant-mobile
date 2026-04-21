// TODO: reemplazar este archivo completo con la home real — eliminar antes de producción
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { storage } from '@/services/storage';
import { Colors } from '@/constants/colors';

export default function AppIndex() {
  const router = useRouter();

  async function resetOnboarding() {
    await storage.clear();
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>App home (placeholder)</Text>
        <TouchableOpacity style={styles.btn} onPress={resetOnboarding}>
          <Text style={styles.btnText}>🔄 Reset onboarding</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 18, color: Colors.textSecondary, marginBottom: 32 },
  btn: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  btnText: { fontSize: 15, color: Colors.text, fontWeight: '600' },
});
