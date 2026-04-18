import React from 'react';
import { Text, TextProps, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { getFontFamily, FontWeight } from '../constants/fonts';

type Props = TextProps & {
  weight?: FontWeight;
};

/**
 * Drop-in replacement for React Native <Text> that automatically
 * applies Jost (Futura-like) for Latin scripts and NanumGothic for Korean.
 *
 * Usage:
 *   <AppText weight="700" style={styles.title}>Hello</AppText>
 *
 * The `weight` prop controls which font variant is loaded.
 * Any fontWeight inside `style` is ignored in favour of the `weight` prop.
 */
export default function AppText({ weight = '400', style, children, ...props }: Props) {
  const { language } = useLanguage();
  const fontFamily = getFontFamily(language, weight);

  // Flatten so we can strip fontWeight (custom font files handle weight via family name)
  const flatStyle = StyleSheet.flatten(style as StyleProp<TextStyle>) || {};
  const { fontWeight: _ignored, ...restStyle } = flatStyle;

  return (
    <Text style={[{ fontFamily }, restStyle]} {...props}>
      {children}
    </Text>
  );
}
