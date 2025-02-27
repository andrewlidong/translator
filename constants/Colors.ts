/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#0a7ea4';

export const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    border: '#e0e0e0',
    icon: '#666',
    card: '#f9f9f9',
    error: '#ff3b30',
    success: '#34c759',
    warning: '#ffcc00',
  },
  dark: {
    text: '#fff',
    background: '#121212',
    tint: tintColorDark,
    tabIconDefault: '#666',
    tabIconSelected: tintColorDark,
    border: '#333',
    icon: '#ccc',
    card: '#1e1e1e',
    error: '#ff453a',
    success: '#30d158',
    warning: '#ffd60a',
  },
};
