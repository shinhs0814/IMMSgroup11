import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AppText from '../../components/AppText';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { analyzeFoodImage, AnalysisResult } from '../../services/anthropic';
import { LANGUAGE_NAMES } from '../../constants/translations';

type Props = {
  onResult: (result: AnalysisResult, imageBase64: string, foodName: string) => void;
  onCancel: () => void;
};

export default function CameraScreen({ onResult, onCancel }: Props) {
  const { dietaryProfile } = useAuth();
  const { t, language } = useLanguage();
  const [analyzing, setAnalyzing] = useState(false);
  const [statusText, setStatusText] = useState('');

  const processImage = async (uri: string) => {
    setAnalyzing(true);
    setStatusText(t.analyzingCompressing);
    try {
      const compressed = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      const base64 = compressed.base64!;
      setStatusText(t.analyzingAI);

      const profile = dietaryProfile || { name: '', allergies: [], restrictions: [], preferences: [] };
      const result = await analyzeFoodImage(base64, 'image/jpeg', profile, LANGUAGE_NAMES[language]);

      onResult(result, base64, result.foodName);
    } catch (e: any) {
      Alert.alert(t.analysisFailedTitle, e.message || 'Please try again with a clearer image.');
    } finally {
      setAnalyzing(false);
      setStatusText('');
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed to take photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      quality: 0.9,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) {
      await processImage(result.assets[0].uri);
    }
  };

  const openAlbum = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Photo library access is needed.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.9,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) {
      await processImage(result.assets[0].uri);
    }
  };

  if (analyzing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <AppText weight="700" style={styles.loadingText}>{statusText}</AppText>
        <AppText style={styles.loadingSubtext}>{t.analyzingProfile}</AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={onCancel}>
        <AppText style={styles.backBtnText}>✕</AppText>
      </TouchableOpacity>

      <View style={styles.content}>
        <AppText style={styles.emoji}>📷</AppText>
        <AppText weight="800" style={styles.title}>{t.scanYourFood}</AppText>
        <AppText style={styles.subtitle}>{t.scanSubtitle}</AppText>

        <View style={styles.options}>
          <TouchableOpacity style={styles.optionCard} onPress={openCamera}>
            <AppText style={styles.optionEmoji}>📸</AppText>
            <AppText weight="700" style={styles.optionTitle}>{t.scanOptionTakePhoto}</AppText>
            <AppText style={styles.optionDesc}>{t.scanOptionUseCamera}</AppText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={openAlbum}>
            <AppText style={styles.optionEmoji}>🖼️</AppText>
            <AppText weight="700" style={styles.optionTitle}>{t.scanOptionAlbum}</AppText>
            <AppText style={styles.optionDesc}>{t.scanOptionGallery}</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.tips}>
          <AppText weight="700" style={styles.tipsTitle}>{t.tipsTitle}</AppText>
          <AppText style={styles.tipItem}>• {t.tipLabel}</AppText>
          <AppText style={styles.tipItem}>• {t.tipFood}</AppText>
          <AppText style={styles.tipItem}>• {t.tipBlurry}</AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  backBtn: {
    position: 'absolute',
    top: 56,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backBtnText: { fontSize: 18, color: Colors.textSecondary },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 28, color: Colors.text, marginBottom: 10 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 36 },
  options: { flexDirection: 'row', gap: 16, marginBottom: 36, width: '100%' },
  optionCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  optionEmoji: { fontSize: 40 },
  optionTitle: { fontSize: 16, color: Colors.text },
  optionDesc: { fontSize: 12, color: Colors.textSecondary },
  tips: { backgroundColor: Colors.primaryBg, borderRadius: 16, padding: 16, width: '100%', gap: 4 },
  tipsTitle: { fontSize: 13, color: Colors.primary, marginBottom: 4 },
  tipItem: { fontSize: 13, color: Colors.text, lineHeight: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.background,
    padding: 28,
  },
  loadingText: { fontSize: 18, color: Colors.text },
  loadingSubtext: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});
