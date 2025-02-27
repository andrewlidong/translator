import { Text, TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'defaultSemiBold' | 'title' | 'subtitle' | 'small';
};

export function ThemedText(props: ThemedTextProps) {
  const { style, lightColor, darkColor, type = 'default', ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  let textStyle = {};
  switch (type) {
    case 'title':
      textStyle = { fontSize: 24, fontWeight: 'bold' };
      break;
    case 'subtitle':
      textStyle = { fontSize: 18, fontWeight: '500' };
      break;
    case 'defaultSemiBold':
      textStyle = { fontSize: 16, fontWeight: '600' };
      break;
    case 'small':
      textStyle = { fontSize: 14 };
      break;
    default:
      textStyle = { fontSize: 16 };
  }

  return <Text style={[{ color }, textStyle, style]} {...otherProps} />;
}
