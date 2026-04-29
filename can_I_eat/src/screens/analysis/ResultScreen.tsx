import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { AnalysisResult } from '../../services/anthropic';
import { useFoods } from '../../context/FoodContext';
import { useLanguage } from '../../context/LanguageContext';
import { SavedFood, logMeal } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';

type Props = {
  result: AnalysisResult;
  imageBase64?: string;
  imageUrl?: string;       // remote URL for text-search results (e.g. from Wikipedia)
  savedFood?: SavedFood;   // if viewing a saved food
  onBack: () => void;
  onSaved?: () => void;
};

export default function ResultScreen({ result, imageBase64, imageUrl, savedFood, onBack, onSaved }: Props) {
  const { groups, addFood } = useFoods();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [saved, setSaved] = useState(!!savedFood);
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const [logged, setLogged] = useState(false);

  const handleLogMeal = async () => {
    if (!user || logged) return;
    try {
      await logMeal(user.uid, result.foodName, result, imageBase64, imageUrl);
      setLogged(true);
      Alert.alert('', t.mealLogged);
    } catch {
      Alert.alert('', t.mealLogFailed);
    }
  };

  const statusConfig = {
    safe: { color: Colors.safe, bg: '#EFF8F0', emoji: '✅', label: t.safeLabel },
    caution: { color: Colors.caution, bg: '#FFF8EC', emoji: '⚠️', label: t.cautionLabel },
    unsafe: { color: Colors.unsafe, bg: '#FEECEC', emoji: '🚫', label: t.unsafeLabel },
  }[result.overallStatus];

  const handleSave = (groupId: string | null) => {
    setShowGroupPicker(false);
    addFood(groupId, result.foodName, result, imageBase64, imageUrl).then(() => {
      setSaved(true);
      onSaved?.();
    });
  };

  const flagSeverityColor = (s: string) => {
    if (s === 'safe') return Colors.safe;
    if (s === 'caution') return Colors.caution;
    return Colors.unsafe;
  };

  const flagSeverityBg = (s: string) => {
    if (s === 'safe') return '#EFF8F0';
    if (s === 'caution') return '#FFF8EC';
    return '#FEECEC';
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Image: prefer camera base64, then remote URL, then placeholder */}
        {imageBase64 ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
            style={styles.image}
          />
        ) : imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ fontSize: 64 }}>🍽️</Text>
          </View>
        )}

        {/* Back + Heart */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn} onPress={onBack}>
            <Text style={styles.iconBtnText}>←</Text>
          </TouchableOpacity>
          {!savedFood && (
            <TouchableOpacity
              style={[styles.iconBtn, saved && styles.iconBtnSaved]}
              onPress={() => !saved && setShowGroupPicker(true)}
            >
              <Text style={styles.heartIcon}>{saved ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          {/* Food name + status */}
          <Text style={styles.foodName}>{result.foodName}</Text>
          {result.originalName && (
            <Text style={styles.originalName}>
              {result.originalName}
              {result.labelLanguage ? `  ·  ${result.labelLanguage}` : ''}
            </Text>
          )}
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <Text style={styles.statusEmoji}>{statusConfig.emoji}</Text>
            <Text style={[styles.statusLabel, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>

          <Text style={styles.summary}>{result.summary}</Text>

          {/* Type badge */}
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {result.type === 'label' ? '📋 Nutrition Label' : '🍽️ Food Image'}
            </Text>
          </View>

          {/* Flags */}
          {result.flags && result.flags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.ingredientAnalysis}</Text>
              {result.flags.map((flag, i) => (
                <View
                  key={i}
                  style={[styles.flagCard, { backgroundColor: flagSeverityBg(flag.severity) }]}
                >
                  <View style={styles.flagHeader}>
                    <Text style={[styles.flagIngredient, { color: flagSeverityColor(flag.severity) }]}>
                      {flag.severity === 'safe' ? '✅' : flag.severity === 'caution' ? '⚠️' : '🚫'}{' '}
                      {flag.ingredient}
                    </Text>
                  </View>
                  <Text style={styles.flagReason}>{flag.reason}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Ingredients list */}
          {result.ingredients && result.ingredients.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.ingredientsTitle}</Text>
              <Text style={styles.ingredientsList}>{result.ingredients.join(', ')}</Text>
            </View>
          )}

          {/* Calories */}
          {result.calories && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.caloriesTitle}</Text>
              <Text style={styles.caloriesText}>{result.calories}</Text>
            </View>
          )}

          {/* Nutrition highlights */}
          {result.nutritionHighlights && result.nutritionHighlights.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.nutritionTitle}</Text>
              {result.nutritionHighlights.map((h, i) => (
                <Text key={i} style={styles.nutritionItem}>• {h}</Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action buttons (bottom) */}
      {!savedFood && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveBtn, saved && styles.saveBtnSaved]}
            onPress={() => !saved && setShowGroupPicker(true)}
            disabled={saved}
          >
            <Text style={styles.saveBtnIcon}>{saved ? '❤️' : '🤍'}</Text>
            <Text style={[styles.saveBtnText, saved && styles.saveBtnTextSaved]}>{saved ? t.savedToLibrary : t.saveToMyFoods}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.logBtn, logged && styles.logBtnDone]}
            onPress={handleLogMeal}
            disabled={logged}
          >
            <Text style={styles.logBtnIcon}>{logged ? '✅' : '🍽️'}</Text>
            <Text style={styles.logBtnText}>{logged ? t.mealLoggedBtn : t.logMealBtn}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Group picker modal */}
      <Modal visible={showGroupPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t.saveToGroup}</Text>
            <FlatList
              data={[{ id: null, name: 'Uncategorized' }, ...groups]}
              keyExtractor={(item) => item.id || 'none'}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.groupItem}
                  onPress={() => handleSave(item.id)}
                >
                  <Text style={styles.groupItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowGroupPicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  image: { width: '100%', height: 280, resizeMode: 'cover' },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 52,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconBtnSaved: { backgroundColor: '#FEF0E7' },
  iconBtnText: { fontSize: 18, color: Colors.text },
  heartIcon: { fontSize: 20 },
  card: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 24,
    minHeight: 200,
  },
  foodName: { fontSize: 26, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  originalName: { fontSize: 14, color: Colors.textSecondary, marginBottom: 12 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  statusEmoji: { fontSize: 18 },
  statusLabel: { fontSize: 16, fontWeight: '700' },
  summary: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 16 },
  typeBadge: {
    backgroundColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  typeBadgeText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 10 },
  flagCard: { borderRadius: 12, padding: 12, marginBottom: 8 },
  flagHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  flagIngredient: { fontSize: 14, fontWeight: '700' },
  flagReason: { fontSize: 13, color: Colors.text, lineHeight: 18 },
  ingredientsList: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  caloriesText: { fontSize: 18, fontWeight: '700', color: Colors.primary },
  nutritionItem: { fontSize: 13, color: Colors.textSecondary, lineHeight: 22 },
  footer: { padding: 20, paddingBottom: 36, backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.border },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
  },
  saveBtnSaved: { backgroundColor: '#FEF0E7', shadowOpacity: 0 },
  saveBtnTextSaved: { color: Colors.primary },
  saveBtnIcon: { fontSize: 20 },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  logBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginTop: 10,
  },
  logBtnDone: { borderColor: Colors.safe, backgroundColor: '#EFF8F0' },
  logBtnIcon: { fontSize: 18 },
  logBtnText: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, maxHeight: '60%' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 16 },
  groupItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  groupItemText: { fontSize: 15, color: Colors.text },
  modalCancel: { marginTop: 12, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  modalCancelText: { fontWeight: '600', color: Colors.textSecondary },
});
