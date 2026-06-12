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
import Icon from '../../components/Icon';
import StatusPill from '../../components/StatusPill';
import { Colors, verdictColors } from '../../constants/colors';
import { Radius, Shadow } from '../../constants/theme';
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
          <Icon name="chevronLeft" size={22} color={Colors.text} stroke={2.4} />
        </TouchableOpacity>
        <AppText weight="700" display style={styles.headerTitle}>{t.menuAnalysisTitle}</AppText>
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
                  borderColor: verdictColors(item.overallStatus as 'safe'|'caution'|'unsafe')?.solid,
                },
              ]}
              onPress={() => setExpanded(expanded === idx ? null : idx)}
              activeOpacity={0.8}
            >
              <View style={[styles.boxLabel, { backgroundColor: verdictColors(item.overallStatus as 'safe'|'caution'|'unsafe')?.solid }]}>
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
          {(['safe', 'caution', 'unsafe'] as const).map((s) => {
            const vc = verdictColors(s)!;
            const count = s === 'safe' ? safeCount : s === 'caution' ? cautionCount : unsafeCount;
            const label = s === 'safe' ? 'Safe' : s === 'caution' ? 'Caution' : 'Avoid';
            return (
              <View key={s} style={styles.summaryChip}>
                <AppText weight="800" display style={[styles.summaryNum, { color: vc.fg }]}>{count}</AppText>
                <AppText style={styles.summaryLabel}>{label}</AppText>
              </View>
            );
          })}
          <View style={styles.summaryDivider} />
          <AppText style={styles.itemCount}>{items.length} {t.menuItemCount}</AppText>
        </View>

        {/* Item list */}
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <AppText style={styles.emptyText}>{t.menuNoItems}</AppText>
          </View>
        ) : (
          <View style={styles.itemList}>
            {items.map((item, idx) => {
              const vc = verdictColors(item.overallStatus as 'safe' | 'caution' | 'unsafe')!;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.itemCard, { borderLeftColor: vc.solid }]}
                  onPress={() => setExpanded(expanded === idx ? null : idx)}
                  activeOpacity={0.85}
                >
                  {/* Item header */}
                  <View style={styles.itemHeader}>
                    <View style={styles.itemNames}>
                      <AppText weight="700" display style={styles.itemOriginal}>{item.originalName}</AppText>
                      {item.translatedName !== item.originalName && (
                        <AppText style={styles.itemTranslated}>{item.translatedName}</AppText>
                      )}
                    </View>
                    <View style={styles.itemActions}>
                      <TouchableOpacity
                        style={styles.saveIconBtn}
                        onPress={(e) => { e.stopPropagation?.(); setSavingItemIdx(savedItems.has(idx) ? null : idx); }}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Icon name={savedItems.has(idx) ? 'saved' : 'save'} size={18} color={savedItems.has(idx) ? Colors.brand : Colors.textSecondary} stroke={2} />
                      </TouchableOpacity>
                      <StatusPill verdict={item.overallStatus as 'safe' | 'caution' | 'unsafe'} size="sm" />
                    </View>
                  </View>

                  <AppText style={styles.itemSummary}>{item.summary}</AppText>

                  {/* Flags */}
                  {item.flags.length > 0 && (
                    <View style={styles.flagsRow}>
                      {item.flags.map((f, fi) => {
                        const fvc = verdictColors(f.severity as 'safe' | 'caution' | 'unsafe')!;
                        return (
                          <View key={fi} style={[styles.flagChip, { backgroundColor: fvc.soft }]}>
                            <AppText style={[styles.flagText, { color: fvc.fg }]}>{f.ingredient}</AppText>
                          </View>
                        );
                      })}
                    </View>
                  )}

                  {/* Expanded ingredients */}
                  {expanded === idx && (
                    <View style={styles.ingredientsBox}>
                      <AppText weight="700" style={styles.ingredientsTitle}>Ingredients</AppText>
                      {item.ingredients.map((ing, ii) => (
                        <AppText key={ii} style={styles.ingredientItem}>• {ing}</AppText>
                      ))}
                    </View>
                  )}

                  <AppText style={styles.tapHint}>
                    {expanded === idx ? '▲ collapse' : `▼ ${t.menuTapToExpand}`}
                  </AppText>
                </TouchableOpacity>
              );
            })}
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
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 14,
    backgroundColor: Colors.surface,
    ...Shadow.soft,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, color: Colors.text },

  imageWrapper: { width: SCREEN_WIDTH, height: IMAGE_HEIGHT, position: 'relative', backgroundColor: '#000' },
  image: { width: SCREEN_WIDTH, height: IMAGE_HEIGHT },
  box: { position: 'absolute', borderWidth: 2.5, borderRadius: Radius.xs },
  boxLabel: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 5, paddingVertical: 3,
    borderBottomLeftRadius: Radius.xs - 2, borderBottomRightRadius: Radius.xs - 2,
  },
  boxLabelText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  toggleBtn: { alignSelf: 'center', padding: 8, marginTop: 10 },
  toggleText: { color: Colors.textSecondary, fontSize: 13 },

  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 0,
    padding: 16,
    gap: 16,
    backgroundColor: Colors.surface,
    borderRadius: Radius.sm,
    ...Shadow.soft,
  },
  summaryChip: { flex: 1, alignItems: 'center' },
  summaryNum: { fontSize: 22, color: Colors.text },
  summaryLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  summaryDivider: { width: 1, alignSelf: 'stretch', backgroundColor: Colors.surfaceAlt },
  itemCount: { fontSize: 12, color: Colors.textSecondary, paddingLeft: 4 },

  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center' },

  itemList: { padding: 16, gap: 12 },
  itemCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.sm,
    padding: 16,
    borderLeftWidth: 5,
    ...Shadow.soft,
  },
  itemHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 10 },
  itemNames: { flex: 1 },
  itemActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  saveIconBtn: { padding: 2 },
  itemOriginal: { fontSize: 16, color: Colors.text },
  itemTranslated: { fontSize: 12.5, color: Colors.textSecondary, marginTop: 2 },
  itemSummary: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: 8 },

  flagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  flagChip: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: Radius.xs },
  flagText: { fontSize: 11, fontWeight: '700' },

  ingredientsBox: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.xs,
    padding: 12,
    marginTop: 8,
    marginBottom: 4,
    gap: 4,
  },
  ingredientsTitle: { fontSize: 13, color: Colors.text, marginBottom: 4 },
  ingredientItem: { fontSize: 12.5, color: Colors.textSecondary },
  tapHint: { fontSize: 11, color: Colors.textSecondary, marginTop: 8, textAlign: 'right' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(59,45,39,0.4)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.card,
    borderTopRightRadius: Radius.card,
    padding: 24, paddingBottom: 40, maxHeight: '60%',
  },
  modalTitle: { fontSize: 19, color: Colors.text, marginBottom: 16 },
  groupItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.surfaceAlt },
  groupItemText: { fontSize: 15, color: Colors.text },
  modalCancel: {
    marginTop: 10, padding: 14, borderRadius: Radius.pill,
    borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center',
  },
  modalCancelText: { fontWeight: '600', color: Colors.textSecondary },
});
