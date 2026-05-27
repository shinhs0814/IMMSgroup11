import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AppText from '../../components/AppText';
import { Colors } from '../../constants/colors';
import { useLanguage } from '../../context/LanguageContext';
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
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showBoxes, setShowBoxes] = useState(true);

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
                  <View style={[styles.statusBadge, { backgroundColor: STATUS_BG[item.overallStatus] }]}>
                    <AppText style={[styles.statusText, { color: STATUS_COLOR[item.overallStatus] }]}>
                      {item.overallStatus === 'safe' ? '✓' : item.overallStatus === 'caution' ? '!' : '✗'}
                    </AppText>
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
});
