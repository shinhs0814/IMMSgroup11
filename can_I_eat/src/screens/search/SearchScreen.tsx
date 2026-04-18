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

type Props = {
  onResult: (result: AnalysisResult, imageUrl: string | null) => void;
  onCancel: () => void;
};

export default function SearchScreen({ onResult, onCancel }: Props) {
  const { dietaryProfile } = useAuth();
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || !dietaryProfile) return;
    setLoading(true);
    try {
      // Run food analysis + image fetch in parallel
      const [result, imageFromQuery] = await Promise.all([
        analyzeFoodText(query.trim(), dietaryProfile, LANGUAGE_NAMES[language]),
        fetchFoodImageUrl(query.trim()),
      ]);

      // If the original query (e.g. "허니버터칩") didn't find an image,
      // retry with the English name that Claude always returns (e.g. "Honey Butter Chip")
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t.searchTitle}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Illustration */}
        <View style={styles.illustration}>
          <Text style={styles.illustrationEmoji}>🔍</Text>
          <Text style={styles.illustrationSub}>
            Search any food in any language
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
            autoFocus
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 60 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 36,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  backBtnText: { fontSize: 18, color: Colors.text },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
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
