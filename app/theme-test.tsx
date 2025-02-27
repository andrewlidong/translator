import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/components/ThemeProvider';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function ThemeTestScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const toggleTheme = () => {
    setColorScheme(isDark ? 'light' : 'dark');
  };
  
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Theme Test' }} />
      
      <ThemedText style={styles.title}>
        Current Theme: {isDark ? 'Dark' : 'Light'}
      </ThemedText>
      
      <TouchableOpacity 
        style={[styles.button, {backgroundColor: isDark ? '#333' : '#eee'}]} 
        onPress={toggleTheme}
      >
        <Ionicons 
          name={isDark ? 'sunny' : 'moon'} 
          size={24} 
          color={isDark ? '#FFD700' : '#6B8096'} 
        />
        <Text style={{color: isDark ? '#fff' : '#000', marginLeft: 8}}>
          Switch to {isDark ? 'Light' : 'Dark'} Mode
        </Text>
      </TouchableOpacity>
      
      <View style={styles.colorSamples}>
        <View style={[styles.colorBox, {backgroundColor: '#0a7ea4'}]}>
          <Text style={{color: 'white'}}>Primary</Text>
        </View>
        <View style={[styles.colorBox, {backgroundColor: isDark ? '#151718' : '#fff', borderWidth: isDark ? 0 : 1}]}>
          <Text style={{color: isDark ? '#fff' : '#000'}}>Background</Text>
        </View>
        <View style={[styles.colorBox, {backgroundColor: isDark ? '#ECEDEE' : '#11181C'}]}>
          <Text style={{color: isDark ? '#000' : '#fff'}}>Text</Text>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  colorSamples: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  colorBox: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#ccc',
  }
}); 