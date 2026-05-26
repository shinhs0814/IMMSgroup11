import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AppText from '../../components/AppText';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { analyzeFoodImage, analyzeMenu, AnalysisResult, MenuAnalysisItem } from '../../services/anthropic';
import { LANGUAGE_NAMES } from '../../constants/translations';
import { classifyKoreanVegan, disagreesWithLLM } from '../../utils/koreanVeganClassifier';

type ScanMode = 'food' | 'label' | 'menu';

type Props = {
  onResult: (result: AnalysisResult, imageBase64: string, foodName: string) => void;
  onMenuResult: (items: MenuAnalysisItem[], imageBase64: string) => void;
  onCancel: () => void;
};

export default function CameraScreen({ onResult, onMenuResult, onCancel }: Props) {
  const { dietaryProfile } = useAuth();
  const { t, language } = useLanguage();
  const [mode, setMode] = useState<ScanMode | null>(null);
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
      const uiLanguage = LANGUAGE_NAMES[language];

      if (mode === 'menu') {
        const items = await analyzeMenu(base64, 'image/jpeg', profile, uiLanguage);
        onMenuResult(items, base64);
      } else {
        const result = await analyzeFoodImage(base64, 'image/jpeg', profile, uiLanguage);

        const isKoreanLabel = result.labelLanguage?.toLowerCase().includes('korean');
        const isVeganOrVeg = profile.preferences.some(p => p === 'vegan' || p === 'vegetarian');
        if (isKoreanLabel && isVeganOrVeg && result.originalIngredients?.length) {
          const ingredientText = result.originalIngredients.join(', ');
          const classifierResult = classifyKoreanVegan(ingredientText);
          if (disagreesWithLLM(result.overallStatus, classifierResult)) {
            result.veganWarning = {
              detectedAnimal: classifierResult.detectedAnimal,
              detectedAmbiguous: classifierResult.detectedAmbiguous,
              reason: classifierResult.reason,
            };
          }
        }

        onResult(result, base64, result.foodName);
      }
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
      Alert.alert(t.permissionRequiredTitle, t.cameraPermissionMsg);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      quality: 0.9,
      allowsEditing: mode !== 'menu',
      aspect: mode !== 'menu' ? [4, 3] : undefined,
    });
    if (!result.canceled && result.assets[0]) {
      await processImage(result.assets[0].uri);
    }
  };

  const openAlbum = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.permissionRequiredTitle, t.photoLibraryPermissionMsg);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.9,
      allowsEditing: mode !== 'menu',
      aspect: mode !== 'menu' ? [4, 3] : undefined,
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

  // Mode picker
  if (!mode) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={onCancel}>
          <AppText style={styles.backBtnText}>✕</AppText>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <AppText style={styles.emoji}>📷</AppText>
          <AppText weight="800" style={styles.title}>{t.scanYourFood}</AppText>
          <AppText style={styles.subtitle}>{t.scanSubtitle}</AppText>

          <View style={styles.modeGrid}>
            <TouchableOpacity style={styles.modeCard} onPress={() => setMode('food')}>
              <AppText style={styles.modeEmoji}>🍽️</AppText>
              <AppText weight="700" style={styles.modeTitle}>{t.modeFood}</AppText>
              <AppText style={styles.modeDesc}>{t.modeFoodDesc}</AppText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modeCard} onPress={() => setMode('label')}>
              <AppText style={styles.modeEmoji}>🏷️</AppText>
              <AppText weight="700" style={styles.modeTitle}>{t.modeLabel}</AppText>
              <AppText style={styles.modeDesc}>{t.modeLabelDesc}</AppText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modeCard, styles.modeCardFull]} onPress={() => setMode('menu')}>
              <AppText style={styles.modeEmoji}>📋</AppText>
              <AppText weight="700" style={styles.modeTitle}>{t.modeMenu}</AppText>
              <AppText style={styles.modeDesc}>{t.modeMenuDesc}</AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.tips}>
            <AppText weight="700" style={styles.tipsTitle}>{t.tipsTitle}</AppText>
            <AppText style={styles.tipItem}>• {t.tipLabel}</AppText>
            <AppText style={styles.tipItem}>• {t.tipFood}</AppText>
            <AppText style={styles.tipItem}>• {t.tipBlurry}</AppText>
            <AppText style={styles.tipItem}>• {t.menuScanNote}</AppText>
          </View>
        </ScrollView>
      </View>
    );
  }

  const modeLabel = mode === 'food' ? t.modeFood : mode === 'label' ? t.modeLabel : t.modeMenu;
  const modeEmoji = mode === 'food' ? '🍽️' : mode === 'label' ? '🏷️' : '📋';

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => setMode(null)}>
        <AppText style={styles.backBtnText}>←</AppText>
      </TouchableOpacity>

      <View style={styles.content}>
        <AppText style={styles.emoji}>{modeEmoji}</AppText>
        <AppText weight="800" style={styles.title}>{modeLabel}</AppText>
        <AppText style={styles.subtitle}>
          {mode === 'menu' ? t.modeMenuDesc : mode === 'label' ? t.modeLabelDesc : t.modeFoodDesc}
        </AppText>

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
  content: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 28, paddingTop: 80 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 28, color: Colors.text, marginBottom: 10 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 36 },
  modeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 32, width: '100%', justifyContent: 'center' },
  modeCard: {
    width: '44%',
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  modeCardFull: { width: '94%', flexDirection: 'row', justifyContent: 'center', gap: 16 },
  modeEmoji: { fontSize: 40 },
  modeTitle: { fontSize: 15, color: Colors.text, textAlign: 'center' },
  modeDesc: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center' },
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
