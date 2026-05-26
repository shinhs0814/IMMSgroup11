import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AppText from '../../components/AppText';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { analyzeFoodImage, analyzeMenu, AnalysisResult, MenuAnalysisItem } from '../../services/anthropic';
import { LANGUAGE_NAMES } from '../../constants/translations';
import { classifyKoreanVegan, disagreesWithLLM } from '../../utils/koreanVeganClassifier';

type ScanMode = 'food' | 'label' | 'menu' | 'barcode';

type Props = {
  onResult: (result: AnalysisResult, imageBase64: string, foodName: string) => void;
  onMenuResult: (items: MenuAnalysisItem[], imageBase64: string) => void;
  onCancel: () => void;
};

async function fetchProductByBarcode(barcode: string): Promise<{ name: string; ingredients: string } | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await res.json();
    if (data.status !== 1) return null;
    const p = data.product;
    const name = p.product_name || p.product_name_en || '';
    const ingredients = p.ingredients_text || p.ingredients_text_en || '';
    if (!name) return null;
    return { name, ingredients };
  } catch {
    return null;
  }
}

export default function CameraScreen({ onResult, onMenuResult, onCancel }: Props) {
  const { dietaryProfile } = useAuth();
  const { t, language } = useLanguage();
  const [mode, setMode] = useState<ScanMode | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [barcodeScanned, setBarcodeScanned] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

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

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (barcodeScanned) return;
    setBarcodeScanned(true);
    setMode(null);
    setAnalyzing(true);
    setStatusText(t.barcodeScanning);
    try {
      const product = await fetchProductByBarcode(data);
      if (!product) {
        Alert.alert('', t.barcodeNotFound, [{ text: 'OK', onPress: () => setBarcodeScanned(false) }]);
        setAnalyzing(false);
        setStatusText('');
        return;
      }
      setStatusText(t.analyzingAI);
      const profile = dietaryProfile || { name: '', allergies: [], restrictions: [], preferences: [] };
      const uiLanguage = LANGUAGE_NAMES[language];
      const prompt = `Product: ${product.name}\nIngredients: ${product.ingredients}`;
      const result = await analyzeFoodImage(null, null, profile, uiLanguage, prompt);
      onResult(result, '', result.foodName);
    } catch (e: any) {
      Alert.alert(t.analysisFailedTitle, e.message || 'Please try again.');
      setBarcodeScanned(false);
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
      allowsEditing: false,
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
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      await processImage(result.assets[0].uri);
    }
  };

  const openBarcodeScanner = async () => {
    if (!cameraPermission?.granted) {
      const { granted } = await requestCameraPermission();
      if (!granted) {
        Alert.alert(t.permissionRequiredTitle, t.cameraPermissionMsg);
        return;
      }
    }
    setBarcodeScanned(false);
    setMode('barcode');
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

  // Live barcode camera view
  if (mode === 'barcode') {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setMode(null)}>
          <AppText style={styles.backBtnText}>←</AppText>
        </TouchableOpacity>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'] }}
          onBarcodeScanned={handleBarcodeScanned}
        />
        <View style={styles.barcodeOverlay}>
          <View style={styles.barcodeFrame} />
          <AppText style={styles.barcodeHint}>🔍 {t.barcodeScanning}</AppText>
        </View>
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

            <TouchableOpacity style={styles.modeCard} onPress={() => setMode('menu')}>
              <AppText style={styles.modeEmoji}>📋</AppText>
              <AppText weight="700" style={styles.modeTitle}>{t.modeMenu}</AppText>
              <AppText style={styles.modeDesc}>{t.modeMenuDesc}</AppText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modeCard} onPress={openBarcodeScanner}>
              <AppText style={styles.modeEmoji}>📦</AppText>
              <AppText weight="700" style={styles.modeTitle}>{t.modeBarcode}</AppText>
              <AppText style={styles.modeDesc}>{t.modeBarcodeDesc}</AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.warningBanner}>
            <AppText weight="700" style={styles.warningText}>{t.menuScanNote}</AppText>
          </View>

          <View style={styles.tips}>
            <AppText weight="700" style={styles.tipsTitle}>{t.tipsTitle}</AppText>
            <AppText style={styles.tipItem}>• {t.tipLabel}</AppText>
            <AppText style={styles.tipItem}>• {t.tipFood}</AppText>
            <AppText style={styles.tipItem}>• {t.tipBlurry}</AppText>
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
  warningBanner: { backgroundColor: '#FFF3CD', borderRadius: 14, padding: 14, width: '100%', borderLeftWidth: 4, borderLeftColor: '#D97706', marginBottom: 12 },
  warningText: { fontSize: 13, color: '#92400E', lineHeight: 20 },
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
  barcodeOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeFrame: {
    width: 260,
    height: 160,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  barcodeHint: {
    marginTop: 20,
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
