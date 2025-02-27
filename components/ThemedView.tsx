import { StyleSheet, View, ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export function ThemedView(props: ViewProps & { lightColor?: string; darkColor?: string }) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
