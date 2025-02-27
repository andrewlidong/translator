import { createContext, useContext, useEffect, useState } from 'react';
import { ColorSchemeName, useColorScheme as _useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for theme preference
const THEME_STORAGE_KEY = 'user_theme_preference';

// Define the context type
type ColorSchemeContextType = {
  colorScheme: ColorSchemeName;
  setColorScheme: (value: ColorSchemeName) => void;
};

// Create the context with default values
const ColorSchemeContext = createContext<ColorSchemeContextType>({
  colorScheme: 'light',
  setColorScheme: () => {},
});

// Provider component that wraps your app and makes theme available
export function ColorSchemeProvider(props: { children: React.ReactNode }) {
  const systemColorScheme = _useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(systemColorScheme);

  // Load saved theme preference on mount
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then(savedTheme => {
        if (savedTheme) {
          setColorScheme(savedTheme as ColorSchemeName);
        }
      })
      .catch(error => {
        console.error('Failed to load theme preference:', error);
      });
  }, []);

  // Save theme preference when it changes
  const setThemeAndSave = (newTheme: ColorSchemeName) => {
    setColorScheme(newTheme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme as string).catch(error => {
      console.error('Failed to save theme preference:', error);
    });
  };

  return {
    ...ColorSchemeContext.Provider,
    props: {
      value: {
        colorScheme,
        setColorScheme: setThemeAndSave
      },
      children: props.children
    }
  };
}

// Hook that lets components access the theme
export function useColorScheme() {
  return useContext(ColorSchemeContext);
} 