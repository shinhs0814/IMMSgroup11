import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import AppText from '../components/AppText';
import { Colors } from '../constants/colors';
import { useLanguage } from '../context/LanguageContext';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const { t } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.82)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 48,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(onFinish, 1200);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
      >
        <Image
          source={require('../../assets/logo_3.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <AppText weight="400" style={styles.subtitle}>
          {t.splashTagline}
        </AppText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  logo: {
    width: 220,
    height: 220,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    letterSpacing: 0.2,
  },
});
