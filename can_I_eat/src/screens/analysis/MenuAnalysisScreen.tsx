import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  FlatList,
} from 'react-native';
import AppText from '../../components/AppText';
import { Colors } from '../../constants/colors';
import { useLanguage } from '../../context/LanguageContext';
import { useFoods } from '../../context/FoodContext';
import { MenuAnalysisItem } from '../../services/anthropic';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.75;

type Props = {
  items: MenuAnalysisItem[];
  imageBase64: string;
  onBack: () => void;
};

const STATUS_COLOR: Record<string, string> = {
  safe: Colors.safe ?? '#16a34a',
  caution: Colors.caution ?? '#d97706',
  unsafe: Colors.unsafe ?? '#dc2626',
};

const STATUS_BG: Record<string, string> = {
  safe: '#dcfce7',
  caution: '#fef3c7',
  unsafe: '#fee2e2',
};

export default function MenuAnalysisScreen({ items, imageBase64, onBack }: Props) {
  const { t } = useLanguage();
  const { groups, addFood } = useFoods();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showBoxes, setShowBoxes] = useState(true);
  const [savingItemIdx, setSavingItemIdx] = useState<number | null>(null);
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set());

  const handleSaveItem = (groupId: string | null) => {
    if (savingItemIdx === null) return;
    const item = items[savingItemIdx];
    const analysisResult = {
      foodName: item.translatedName || item.originalName,
      originalName: item.originalName,
      type: 'food_image' as const,
      overallStatus: item.overallStatus,
      summary: item.summary,
      ingredients: item.ingredients,
      flags: item.flags,
    };
    addFood(groupId, analysisResult.foodName, analysisResult).then(() => {
      setSavedItems(prev => new Set(prev).add(savingItemIdx));
      setSavingItemIdx(null);
    });
  };

  const safeCount = items.filter(i => i.overallStatus === 'safe').length;
  const unsafeCount = items.filter(i => i.overallStatus === 'unsafe').length;
  const cautionCount = items.filter(i => i.overallStatus === 'caution').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <AppText style={styles.backText}>← Back</AppText>
        </TouchableOpacity>
        <AppText weight="700" style={styles.headerTitle}>{t.menuAnalysisTitle}</AppText>
        <View style={styles.backBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image with bounding box overlays */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
            style={styles.image}
            resizeMode="cover"
          />
          {showBoxes && items.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.box,
                {
                  left: item.box.x * SCREEN_WIDTH,
                  top: item.box.y * IMAGE_HEIGHT,
                  width: item.box.w * SCREEN_WIDTH,
                  height: Math.max(item.box.h * IMAGE_HEIGHT, 28),
                  borderColor: STATUS_COLOR[item.overallStatus],
                },
              ]}
              onPress={() => setExpanded(expanded === idx ? null : idx)}
              activeOpacity={0.8}
            >
              <View style={[styles.boxLabel, { backgroundColor: STATUS_COLOR[item.overallStatus] }]}>
                <AppText style={styles.boxLabelText} numberOfLines={1}>
                  {item.translatedName !== item.originalName
                    ? `${item.originalName} · ${item.translatedName}`
                    : item.originalName}
                </AppText>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Toggle boxes */}
        <TouchableOpacity style={styles.toggleBtn} onPress={() => setShowBoxes(v => !v)}>
          <AppText style={styles.toggleText}>{showBoxes ? '🔲 Hide labels' : '🔲 Show labels'}</AppText>
        </TouchableOpacity>

        {/* Summary bar */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryChip}>
            <AppText style={[styles.summaryNum, { color: STATUS_COLOR.safe }]}>{safeCount}</AppText>
            <AppText style={styles.summaryLabel}>Safe</AppText>
          </View>
          <View style={styles.summaryChip}>
            <AppText style={[styles.summaryNum, { color: STATUS_COLOR.caution }]}>{cautionCount}</AppText>
            <AppText style={styles.summaryLabel}>Caution</AppText>
          </View>
          <View style={styles.summaryChip}>
            <AppText style={[styles.summaryNum, { color: STATUS_COLOR.unsafe }]}>{unsafeCount}</AppText>
            <AppText style={styles.summaryLabel}>Unsafe</AppText>
          </View>
          <AppText style={styles.itemCount}>{items.length} {t.menuItemCount}</AppText>
        </View>

        {/* Item list */}
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <AppText style={styles.emptyText}>{t.menuNoItems}</AppText>
          </View>
        ) : (
          <View style={styles.itemList}>
            {items.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.itemCard, { borderLeftColor: STATUS_COLOR[item.overallStatus] }]}
                onPress={() => setExpanded(expanded === idx ? null : idx)}
                activeOpacity={0.85}
              >
                {/* Item header */}
                <View style={styles.itemHeader}>
                  <View style={styles.itemNames}>
                    <AppText weight="700" style={styles.itemOriginal}>{item.originalName}</AppText>
                    {item.translatedName !== item.originalName && (
                      <AppText style={styles.itemTranslated}>
                        {t.menuTranslation}: {item.translatedName}
                      </AppText>
                    )}
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.saveIconBtn}
                      onPress={(e) => { e.stopPropagation?.(); setSavingItemIdx(savedItems.has(idx) ? null : idx); }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <AppText style={styles.saveIcon}>{savedItems.has(idx) ? '❤️' : '🤍'}</AppText>
                    </TouchableOpacity>
                    <View style={[styles.statusBadge, { backgroundColor: STATUS_BG[item.overallStatus] }]}>
                      <AppText style={[styles.statusText, { color: STATUS_COLOR[item.overallStatus] }]}>
                        {item.overallStatus === 'safe' ? '✓' : item.overallStatus === 'caution' ? '!' : '✗'}
                      </AppText>
                    </View>
                  </View>
                </View>

                <AppText style={styles.itemSummary}>{item.summary}</AppText>

                {/* Flags */}
                {item.flags.length > 0 && (
                  <View style={styles.flagsRow}>
                    {item.flags.map((f, fi) => (
                      <View key={fi} style={[styles.flagChip, { backgroundColor: STATUS_BG[f.severity] }]}>
                        <AppText style={[styles.flagText, { color: STATUS_COLOR[f.severity] }]}>
                          {f.ingredient}
                        </AppText>
                      </View>
                    ))}
                  </View>
                )}

                {/* Expanded ingredients */}
                {expanded === idx && (
                  <View style={styles.ingredientsBox}>
                    <AppText weight="700" style={styles.ingredientsTitle}>Ingredients:</AppText>
                    {item.ingredients.map((ing, ii) => (
                      <AppText key={ii} style={styles.ingredientItem}>• {ing}</AppText>
                    ))}
                  </View>
                )}

                <AppText style={styles.tapHint}>
                  {expanded === idx ? '▲ collapse' : `▼ ${t.menuTapToExpand}`}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Group picker modal */}
      <Modal visible={savingItemIdx !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <AppText weight="700" style={styles.modalTitle}>{t.saveToGroup}</AppText>
            <FlatList
              data={[{ id: null as string | null, name: t.uncategorized }, ...groups]}
              keyExtractor={(item) => item.id || 'none'}
              renderItem={({ item: g }) => (
                <TouchableOpacity style={styles.groupItem} onPress={() => handleSaveItem(g.id)}>
                  <AppText style={styles.groupItemText}>{g.name}</AppText>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCancel} onPress={() => setSavingItemIdx(null)}>
              <AppText style={styles.modalCancelText}>{t.cancel}</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { width: 64 },
  backText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
  headerTitle: { fontSize: 17, color: Colors.text },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    position: 'relative',
    backgroundColor: '#000',
  },
  image: { width: SCREEN_WIDTH, height: IMAGE_HEIGHT },
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 4,
  },
  boxLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  boxLabelText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  toggleBtn: { alignSelf: 'center', padding: 8, marginTop: 8 },
  toggleText: { color: Colors.textSecondary, fontSize: 13 },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryChip: { alignItems: 'center' },
  summaryNum: { fontSize: 20, fontWeight: '800' },
  summaryLabel: { fontSize: 11, color: Colors.textSecondary },
  itemCount: { marginLeft: 'auto', fontSize: 12, color: Colors.textSecondary },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center' },
  itemList: { padding: 16, gap: 12 },
  itemCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  itemNames: { flex: 1 },
  itemActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  saveIconBtn: { padding: 2 },
  saveIcon: { fontSize: 18 },
  itemOriginal: { fontSize: 16, color: Colors.text },
  itemTranslated: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  statusText: { fontSize: 14, fontWeight: '800' },
  itemSummary: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 8 },
  flagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  flagChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  flagText: { fontSize: 11, fontWeight: '600' },
  ingredientsBox: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    marginBottom: 4,
    gap: 4,
  },
  ingredientsTitle: { fontSize: 13, color: Colors.text, marginBottom: 4 },
  ingredientItem: { fontSize: 13, color: Colors.textSecondary },
  tapHint: { fontSize: 11, color: Colors.textSecondary, marginTop: 6, textAlign: 'right' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, maxHeight: '60%' },
  modalTitle: { fontSize: 20, color: Colors.text, marginBottom: 16 },
  groupItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  groupItemText: { fontSize: 15, color: Colors.text },
  modalCancel: { marginTop: 10, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  modalCancelText: { fontWeight: '600', color: Colors.textSecondary },
});
