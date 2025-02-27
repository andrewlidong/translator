import { Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SpeechTranslator } from '@/components/SpeechTranslator';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HomeScreen() {
  const router = useRouter();
  
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          headerRight: () => <ThemeToggle />,
          title: "Speech Translator",
          headerShown: true,
        }} 
      />
      <SpeechTranslator />
      
      <TouchableOpacity 
        style={styles.testButton}
        onPress={() => router.push('/theme-test')}
      >
        <ThemedText>Test Theme Toggle</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  testButton: {
    backgroundColor: '#0a7ea4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
});
