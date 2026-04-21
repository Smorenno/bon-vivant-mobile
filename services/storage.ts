import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  setOnboardingSeen: () => AsyncStorage.setItem('has_seen_onboarding', 'true'),
  getOnboardingSeen: async (): Promise<boolean> => {
    const val = await AsyncStorage.getItem('has_seen_onboarding');
    return val === 'true';
  },
  setSelectedCity: (slug: string) => AsyncStorage.setItem('selected_free_city', slug),
  getSelectedCity: () => AsyncStorage.getItem('selected_free_city'),
  clear: () => AsyncStorage.clear(),
};
