import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/components/ThemeProvider';

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  
  const toggleTheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={toggleTheme}
    >
      <Ionicons 
        name={colorScheme === 'dark' ? 'sunny' : 'moon'} 
        size={24} 
        color={colorScheme === 'dark' ? '#FFD700' : '#6B8096'} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginRight: 8,
  },
}); 