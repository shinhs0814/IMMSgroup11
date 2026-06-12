import React from 'react';
import { Text, TextProps, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { getFontFamily, FontWeight } from '../constants/fonts';

type Props = TextProps & {
  weight?: FontWeight;
  /** true = Baloo 2 (headings/numbers), false = Nunito (body/UI copy) */
  display?: boolean;
};

export default function AppText({ weight = '400', display = false, style, children, ...props }: Props) {
  const { language } = useLanguage();
  const fontFamily = getFontFamily(language, weight, display);

  const flatStyle = StyleSheet.flatten(style as StyleProp<TextStyle>) || {};
  const { fontWeight: _ignored, ...restStyle } = flatStyle;

  return (
    <Text style={[{ fontFamily }, restStyle]} {...props}>
      {children}
    </Text>
  );
}
