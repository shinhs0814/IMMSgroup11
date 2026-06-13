import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AppText from '../../components/AppText';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FamilyMember } from '../../services/storage';
import { analyzeFoodImage, analyzeMenu, AnalysisResult, MenuAnalysisItem } from '../../services/anthropic';
import { LANGUAGE_NAMES } from '../../constants/translations';
import { classifyKoreanVegan, disagreesWithLLM } from '../../utils/koreanVeganClassifier';

type ScanMode = 'food' | 'label' | 'menu' | 'barcode';

type Props = {
  onResult: (result: AnalysisResult, imageBase64: string, foodName: string) => void;
  onMenuResult: (items: MenuAnalysisItem[], imageBase64: string) => void;
  onCancel: () => void;
};

// AbortSignal.timeout() is not supported on all Android/Hermes versions — use this instead
function timeoutSignal(ms: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

async function fetchFromOpenFoodFacts(barcode: string): Promise<{ name: string; ingredients: string } | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`, { signal: timeoutSignal(6000) });
    const data = await res.json();
    if (data.status !== 1) return null;
    const p = data.product;
    const name = p.product_name || p.product_name_en || p.product_name_ko || '';
    const ingredients = p.ingredients_text || p.ingredients_text_en || p.ingredients_text_ko || '';
    if (!name) return null;
    return { name, ingredients };
  } catch {
    return null;
  }
}

async function fetchFromUPCItemDB(barcode: string): Promise<{ name: string; ingredients: string } | null> {
  try {
    const res = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`, { signal: timeoutSignal(6000) });
    const data = await res.json();
    if (data.code !== 'OK' || !data.items?.length) return null;
    const item = data.items[0];
    const name = item.title || '';
    const ingredients = item.description || '';
    if (!name) return null;
    return { name, ingredients };
  } catch {
    return null;
  }
}

async function fetchFromKoreanFoodDB(barcode: string): Promise<{ name: string; ingredients: string } | null> {
  // Open Food Facts Korea mirror
  try {
    const res = await fetch(`https://kr.openfoodfacts.org/api/v0/product/${barcode}.json`, { signal: timeoutSignal(6000) });
    const data = await res.json();
    if (data.status !== 1) return null;
    const p = data.product;
    const name = p.product_name_ko || p.product_name || '';
    const ingredients = p.ingredients_text_ko || p.ingredients_text || '';
    if (!name) return null;
    return { name, ingredients };
  } catch {
    return null;
  }
}

async function fetchFromFoodSafetyKorea(barcode: string): Promise<{ name: string; ingredients: string } | null> {
  // 식품안전나라 (Ministry of Food and Drug Safety, Korea) — official Korean food DB
  const apiKey = process.env.EXPO_PUBLIC_FOOD_SAFETY_KOREA_API_KEY;
  if (!apiKey) return null;
  try {
    // Step 1: look up barcode → product report number + product name
    const c005Res = await fetch(
      `https://openapi.foodsafetykorea.go.kr/api/${apiKey}/C005/json/1/1/BAR_CD=${barcode}`,
      { signal: timeoutSignal(6000) }
    );
    const c005Data = await c005Res.json();
    if (!c005Data?.C005?.row?.length) return null;
    const row = c005Data.C005.row[0];
    const name = row.PRDLST_NM || '';
    const reportNo = row.PRDLST_REPORT_NO || '';
    if (!name) return null;

    // Step 2: look up report number → ingredients
    let ingredients = '';
    if (reportNo) {
      const c002Res = await fetch(
        `https://openapi.foodsafetykorea.go.kr/api/${apiKey}/C002/json/1/100/PRDLST_REPORT_NO=${reportNo}`,
        { signal: timeoutSignal(6000) }
      );
      const c002Data = await c002Res.json();
      if (c002Data?.C002?.row?.length) {
        ingredients = c002Data.C002.row.map((r: any) => r.RAWMTRL_NM).join(', ');
      }
    }

    return { name, ingredients };
  } catch {
    return null;
  }
}

async function fetchFromNaverShopping(barcode: string): Promise<{ name: string; ingredients: string } | null> {
  const clientId = process.env.EXPO_PUBLIC_NAVER_CLIENT_ID;
  const clientSecret = process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  try {
    const res = await fetch(
      `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(barcode)}&display=1`,
      {
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
        signal: timeoutSignal(6000),
      }
    );
    const data = await res.json();
    if (!data.items?.length) return null;
    const item = data.items[0];
    // Strip HTML tags from title
    const name = item.title?.replace(/<[^>]+>/g, '') || '';
    if (!name) return null;
    return { name, ingredients: '' };
  } catch {
    return null;
  }
}

async function fetchProductByBarcode(barcode: string): Promise<{ name: string; ingredients: string } | null> {
  // Check Korean barcode prefix (880 = South Korea)
  const isKoreanBarcode = barcode.startsWith('880');

  if (isKoreanBarcode) {
    // 1. Naver Shopping — best Korean product coverage
    const naver = await fetchFromNaverShopping(barcode);
    if (naver) return naver;
    // 2. 식품안전나라 — official Korean government DB
    const fsk = await fetchFromFoodSafetyKorea(barcode);
    if (fsk) return fsk;
    // 3. Open Food Facts Korea mirror
    const korean = await fetchFromKoreanFoodDB(barcode);
    if (korean) return korean;
  }

  // 3. Open Food Facts (global)
  const off = await fetchFromOpenFoodFacts(barcode);
  if (off) return off;

  // 4. Naver Shopping (also strong for non-Korean products sold in Korea)
  const naver2 = await fetchFromNaverShopping(barcode);
  if (naver2) return naver2;

  // 5. UPC Item DB fallback (global)
  const upc = await fetchFromUPCItemDB(barcode);
  if (upc) return upc;

  return null;
}

export default function CameraScreen({ onResult, onMenuResult, onCancel }: Props) {
  const { activeProfile, activeName, familyMembers, activeMemberId, setActiveMember, user } = useAuth();
  const { t, language } = useLanguage();
  const [mode, setMode] = useState<ScanMode | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [barcodeScanned, setBarcodeScanned] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  // Debounce: require the same barcode on 3 consecutive frames before acting
  const scanConfirmRef = useRef<{ code: string; count: number }>({ code: '', count: 0 });
  const [showProfilePicker, setShowProfilePicker] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const processImage = async (uri: string) => {
    setAnalyzing(true);
    setStatusText(t.analyzingCompressing);
    try {
      const compressed = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      // On web, base64 may be missing but the URI is a data: URL containing base64
      let base64 = compressed.base64;
      if (!base64 && compressed.uri?.startsWith('data:')) {
        base64 = compressed.uri.split(',')[1];
      }
      if (!base64) throw new Error('Image compression did not produce base64 output. Try a different image.');
      setStatusText(t.analyzingAI);

      const profile = activeProfile || { name: '', allergies: [], restrictions: [], preferences: [] };
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
      console.error('[processImage error]', e?.message, e);
      const msg = e?.message || 'Please try again with a clearer image.';
      setLastError(msg);
      Alert.alert(t.analysisFailedTitle, msg);
    } finally {
      setAnalyzing(false);
      setStatusText('');
    }
  };

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (barcodeScanned) return;

    // Require 3 consecutive frames of the same barcode before acting
    const ref = scanConfirmRef.current;
    if (ref.code === data) {
      ref.count += 1;
    } else {
      ref.code = data;
      ref.count = 1;
    }
    if (ref.count < 3) return;

    setBarcodeScanned(true);
    setMode(null);
    setAnalyzing(true);
    setStatusText(t.barcodeScanning);
    try {
      const product = await fetchProductByBarcode(data);
      if (!product) {
        setAnalyzing(false);
        setStatusText('');
        Alert.alert(
          '📦 Barcode Detected',
          `Barcode: ${data}\n\nThis product isn't in our database yet. Try the Label Scan mode to photograph the ingredient list instead.`,
          [
            { text: 'Label Scan', onPress: () => setMode('label') },
            { text: 'OK', style: 'cancel', onPress: () => { setBarcodeScanned(false); scanConfirmRef.current = { code: '', count: 0 }; } },
          ]
        );
        return;
      }
      setStatusText(t.analyzingAI);
      const profile = activeProfile || { name: '', allergies: [], restrictions: [], preferences: [] };
      const uiLanguage = LANGUAGE_NAMES[language];
      const prompt = `Product: ${product.name}\nIngredients: ${product.ingredients}`;
      const result = await analyzeFoodImage(null, null, profile, uiLanguage, prompt);
      // Always use the barcode DB name — Claude may paraphrase it differently
      result.foodName = product.name;
      onResult(result, '', product.name);
    } catch (e: any) {
      Alert.alert(t.analysisFailedTitle, e.message || 'Please try again.');
      setBarcodeScanned(false);
      scanConfirmRef.current = { code: '', count: 0 };
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
    scanConfirmRef.current = { code: '', count: 0 };
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

          {/* Profile switcher banner */}
          <TouchableOpacity
            style={styles.profileBanner}
            onPress={() => setShowProfilePicker(true)}
          >
            <AppText style={styles.profileBannerLabel}>{t.scanningFor}</AppText>
            <AppText weight="700" style={styles.profileBannerName} numberOfLines={1}>
              {activeMemberId === null
                ? `👤 ${user?.displayName || t.meLabel}`
                : activeName}
            </AppText>
            <AppText style={styles.profileBannerSwitch}>{t.switchProfile} ▾</AppText>
          </TouchableOpacity>

          {/* Profile picker modal */}
          <Modal visible={showProfilePicker} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={() => setShowProfilePicker(false)}>
              <View style={styles.pickerOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.pickerSheet}>
                    <AppText weight="700" style={styles.pickerTitle}>{t.switchProfile}</AppText>
                    {/* Me */}
                    <TouchableOpacity
                      style={[styles.pickerItem, activeMemberId === null && styles.pickerItemActive]}
                      onPress={() => { setActiveMember(null); setShowProfilePicker(false); }}
                    >
                      <AppText style={styles.pickerItemEmoji}>👤</AppText>
                      <AppText weight="600" style={[styles.pickerItemName, activeMemberId === null && styles.pickerItemNameActive]}>
                        {user?.displayName || t.meLabel}
                      </AppText>
                      {activeMemberId === null && <AppText style={styles.pickerCheck}>✓</AppText>}
                    </TouchableOpacity>
                    {/* Family members */}
                    {familyMembers.map((member: FamilyMember) => (
                      <TouchableOpacity
                        key={member.id}
                        style={[styles.pickerItem, activeMemberId === member.id && styles.pickerItemActive]}
                        onPress={() => { setActiveMember(member.id); setShowProfilePicker(false); }}
                      >
                        <AppText style={styles.pickerItemEmoji}>{member.emoji}</AppText>
                        <AppText weight="600" style={[styles.pickerItemName, activeMemberId === member.id && styles.pickerItemNameActive]}>
                          {member.name}
                        </AppText>
                        {activeMemberId === member.id && <AppText style={styles.pickerCheck}>✓</AppText>}
                      </TouchableOpacity>
                    ))}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

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

          <AppText style={styles.dataAttribution}>
            Barcode data: 식품안전나라 (foodsafetykorea.go.kr) · Open Food Facts (openfoodfacts.org) · UPC Item DB · Naver Shopping
          </AppText>
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

        {lastError && (
          <View style={styles.errorBanner}>
            <AppText weight="700" style={styles.errorText}>⚠️ {lastError}</AppText>
          </View>
        )}

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
  dataAttribution: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center', marginTop: 12, marginBottom: 8, lineHeight: 15, opacity: 0.7 },
  errorBanner: { backgroundColor: '#FEECEC', borderRadius: 12, padding: 12, width: '100%', borderLeftWidth: 3, borderLeftColor: Colors.unsafe, marginBottom: 12 },
  errorText: { fontSize: 12, color: Colors.unsafe, lineHeight: 18 },
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

  // Profile switcher
  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    width: '100%',
    gap: 6,
    marginBottom: 24,
  },
  profileBannerLabel: { fontSize: 12, color: Colors.primary },
  profileBannerName: { flex: 1, fontSize: 14, color: Colors.primary },
  profileBannerSwitch: { fontSize: 12, color: Colors.primary },

  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  pickerTitle: { fontSize: 16, color: Colors.text, marginBottom: 16 },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 4,
  },
  pickerItemActive: { backgroundColor: Colors.primaryBg },
  pickerItemEmoji: { fontSize: 26 },
  pickerItemName: { flex: 1, fontSize: 15, color: Colors.text },
  pickerItemNameActive: { color: Colors.primary },
  pickerCheck: { fontSize: 16, color: Colors.primary },
});
