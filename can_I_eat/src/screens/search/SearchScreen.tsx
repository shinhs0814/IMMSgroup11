import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { analyzeFoodText, AnalysisResult } from '../../services/anthropic';
import { LANGUAGE_NAMES } from '../../constants/translations';
import { fetchFoodImageUrl } from '../../services/imageSearch';
import RestaurantListScreen from '../restaurant/RestaurantListScreen';
import { Restaurant } from '../../types/restaurant';

type Props = {
  onResult: (result: AnalysisResult, imageUrl: string | null) => void;
  onCancel: () => void;
  onRestaurantSelect: (restaurant: Restaurant) => void;
};

export default function SearchScreen({ onResult, onCancel, onRestaurantSelect }: Props) {
  const { dietaryProfile } = useAuth();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'food' | 'restaurants'>('food');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || !dietaryProfile) return;
    setLoading(true);
    try {
      const [result, imageFromQuery] = await Promise.all([
        analyzeFoodText(query.trim(), dietaryProfile, LANGUAGE_NAMES[language]),
        fetchFoodImageUrl(query.trim()),
      ]);

      let imageUrl = imageFromQuery;
      if (!imageUrl && result.englishName && result.englishName !== query.trim()) {
        imageUrl = await fetchFoodImageUrl(result.englishName);
      }

      onResult(result, imageUrl);
    } catch (err: any) {
      Alert.alert(t.analysisFailedTitle, err.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t.searchTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab toggle */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'food' && styles.tabBtnActive]}
          onPress={() => setActiveTab('food')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'food' && styles.tabBtnTextActive]}>
            🍽️  {t.searchFood}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'restaurants' && styles.tabBtnActive]}
          onPress={() => setActiveTab('restaurants')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'restaurants' && styles.tabBtnTextActive]}>
            🏪  {t.searchRestaurants}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'food' ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.foodScroll}
            keyboardShouldPersistTaps="handled"
          >
            {/* Illustration */}
            <View style={styles.illustration}>
              <Text style={styles.illustrationEmoji}>🔍</Text>
              <Text style={styles.illustrationSub}>
                {t.searchAnyLanguage}
              </Text>
            </View>

            {/* Input + Button */}
            <View style={styles.inputSection}>
              <TextInput
                style={styles.input}
                placeholder={t.searchPlaceholder}
                placeholderTextColor={Colors.textLight}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoFocus={activeTab === 'food'}
              />
              <TouchableOpacity
                style={[styles.searchBtn, (!query.trim() || loading) && styles.searchBtnDisabled]}
                onPress={handleSearch}
                disabled={!query.trim() || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.searchBtnText}>{t.searchButton}</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Tips */}
            <View style={styles.tips}>
              <Text style={styles.tipsTitle}>💡 Tips</Text>
              <Text style={styles.tipItem}>• {t.searchTipMultilingual}</Text>
              <Text style={styles.tipItem}>• {t.searchTipDishes}</Text>
              <Text style={styles.tipItem}>• {t.searchTipRecipes}</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <RestaurantListScreen onSelect={onRestaurantSelect} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: { fontSize: 18, color: Colors.text },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  tabBtnActive: {
    backgroundColor: Colors.primaryBg,
    borderColor: Colors.primary,
  },
  tabBtnText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  tabBtnTextActive: { color: Colors.primary },
  foodScroll: { padding: 24 },
  illustration: { alignItems: 'center', marginBottom: 36 },
  illustrationEmoji: { fontSize: 80, marginBottom: 12 },
  illustrationSub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  inputSection: { gap: 12, marginBottom: 28 },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  searchBtnDisabled: { opacity: 0.5 },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  tips: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  tipsTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  tipItem: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
});
