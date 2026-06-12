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
  Share,
} from 'react-native';
import { Colors, verdictColors } from '../../constants/colors';
import { Radius, Shadow } from '../../constants/theme';
import { AnalysisResult } from '../../services/anthropic';
import { useFoods } from '../../context/FoodContext';
import { useLanguage } from '../../context/LanguageContext';
import { LANGUAGE_NAMES } from '../../constants/translations';
import { SavedFood, logMeal } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { analyzeFamilyCompatibility, FamilyCompatibilityResult } from '../../services/anthropic';
import AppText from '../../components/AppText';
import Icon from '../../components/Icon';
import StatusPill from '../../components/StatusPill';
import PlateFace from '../../components/PlateFace';

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
  const { t, language } = useLanguage();
  const { user, familyMembers, dietaryProfile } = useAuth();
  const [saved, setSaved] = useState(!!savedFood);
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const [logged, setLogged] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedLogDate, setSelectedLogDate] = useState(new Date().toISOString().slice(0, 10));
  const [familyCheck, setFamilyCheck] = useState<FamilyCompatibilityResult[] | null>(null);
  const [familyCheckLoading, setFamilyCheckLoading] = useState(false);

  // Build a list of the last 30 days for the date picker
  const recentDates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });

  // Load family compatibility check when family members exist
  React.useEffect(() => {
    if (!familyMembers.length) return;
    setFamilyCheckLoading(true);
    const profiles = familyMembers.map((m) => ({
      name: `${m.emoji} ${m.name}`,
      allergies: m.allergies,
      restrictions: m.restrictions,
      preferences: m.preferences,
    }));
    analyzeFamilyCompatibility(
      result.foodName,
      result.ingredients ?? [],
      result.flags ?? [],
      profiles,
      LANGUAGE_NAMES[language] ?? 'English'
    )
      .then(setFamilyCheck)
      .catch(() => setFamilyCheck(null))
      .finally(() => setFamilyCheckLoading(false));
  }, [result.foodName]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogMeal = async () => {
    if (!user) return;
    try {
      await logMeal(user.uid, result.foodName, result, imageBase64, imageUrl, selectedLogDate);
      setLogged(true);
      setShowDatePicker(false);
      Alert.alert('', t.mealLogged);
    } catch {
      Alert.alert('', t.mealLogFailed);
    }
  };

  const verdict = (result.overallStatus === 'safe' || result.overallStatus === 'caution' || result.overallStatus === 'unsafe')
    ? result.overallStatus : 'caution';
  const vc = verdictColors(verdict)!;
  const verdictWord = verdict === 'safe' ? t.safeLabel : verdict === 'caution' ? t.cautionLabel : t.unsafeLabel;
  const plateMood: 'happy' | 'wary' | 'sad' = verdict === 'safe' ? 'happy' : verdict === 'caution' ? 'wary' : 'sad';
  const verdictIcon: 'shieldCheck' | 'alert' | 'ban' = verdict === 'safe' ? 'shieldCheck' : verdict === 'caution' ? 'alert' : 'ban';

  // legacy — keep share working
  const statusConfig = { color: vc.fg, bg: vc.bg, emoji: verdict === 'safe' ? '✅' : verdict === 'caution' ? '⚠️' : '🚫', label: verdictWord };

  const handleShare = async () => {
    try {
      const verdictLine = `${statusConfig.emoji} ${statusConfig.label}`;
      const lines: string[] = [
        `🍱 Can I Eat? — ${result.foodName}`,
        result.originalName ? `(${result.originalName})` : '',
        '',
        verdictLine,
        '',
        result.summary,
      ].filter((l) => l !== undefined) as string[];

      const topFlags = (result.flags ?? []).filter((f) => f.severity === 'unsafe').slice(0, 3);
      if (topFlags.length > 0) {
        lines.push('');
        topFlags.forEach((f) => lines.push(`🚫 ${f.ingredient}: ${f.reason}`));
      }

      lines.push('');
      lines.push('Checked with Can I Eat? 🍱');

      await Share.share({ message: lines.join('\n') });
    } catch {
      Alert.alert('Error', 'Could not share result.');
    }
  };

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
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} bounces>

        {/* ── HERO: colored wash ── */}
        <View style={[styles.hero, { backgroundColor: vc.bg }]}>
          {/* Verdict icon circle */}
          <View style={[styles.iconCircle, { shadowColor: vc.solid }]}>
            <Icon name={verdictIcon} size={38} color={vc.solid} stroke={2.4} />
          </View>
          {/* Verdict word */}
          <AppText weight="800" display style={[styles.verdictWord, { color: vc.fg }]}>
            {verdictWord}
          </AppText>
          {/* Food name + sub */}
          <AppText weight="700" display style={styles.heroFoodName}>{result.foodName}</AppText>
          {(result.originalName || result.labelLanguage) && (
            <AppText style={styles.heroSub}>
              {result.originalName}{result.labelLanguage ? `  ·  ${result.labelLanguage}` : ''}
            </AppText>
          )}
          {/* PlateFace mascot peeking */}
          <View style={styles.plateFaceWrap}>
            <PlateFace size={92} mood={plateMood} plate="#fff" rim={vc.ring} pupil={vc.solid} />
          </View>
        </View>

        {/* ── DETAIL SHEET ── */}
        <View style={styles.sheet}>
          {/* Summary */}
          <AppText weight="600" style={styles.summary}>{result.summary}</AppText>

          {/* Flags — "What's inside" */}
          {result.flags && result.flags.length > 0 && (
            <View style={styles.section}>
              <AppText weight="700" display style={styles.sectionTitle}>{t.ingredientAnalysis}</AppText>
              {result.flags.map((flag, i) => {
                const fv = (flag.severity === 'safe' || flag.severity === 'caution' || flag.severity === 'unsafe') ? flag.severity : 'caution';
                const fc = verdictColors(fv)!;
                return (
                  <View key={i} style={[styles.flagRow, { backgroundColor: fc.soft }]}>
                    <View style={[styles.flagIconBox, { backgroundColor: Colors.surface }]}>
                      <Icon name={fv === 'safe' ? 'check' : fv === 'caution' ? 'alert' : 'ban'} size={18} color={fc.solid} stroke={2.5} />
                    </View>
                    <View style={styles.flagText}>
                      <AppText weight="700" style={[styles.flagIngredient, { color: Colors.text }]}>{flag.ingredient}</AppText>
                      <AppText style={styles.flagReason}>{flag.reason}</AppText>
                    </View>
                    <Icon name={fv === 'safe' ? 'check' : fv === 'caution' ? 'alert' : 'ban'} size={19} color={fc.solid} stroke={2.6} />
                  </View>
                );
              })}
            </View>
          )}

          {/* Family check */}
          {(familyCheckLoading || (familyCheck && familyCheck.length > 0)) && (
            <View style={styles.section}>
              <AppText weight="700" display style={styles.sectionTitle}>
                <Icon name="users" size={16} color={Colors.brand} stroke={2.2} /> {' '}Family Check
              </AppText>
              <View style={styles.familyCard}>
                {familyCheckLoading ? (
                  <AppText style={styles.familyLoading}>Checking family members…</AppText>
                ) : (
                  familyCheck!.map((item, i) => {
                    const fv2 = (item.status === 'safe' || item.status === 'caution' || item.status === 'unsafe') ? item.status : 'caution';
                    return (
                      <View key={i} style={[styles.familyRow, i > 0 && styles.familyRowBorder]}>
                        <AppText style={styles.familyEmoji}>{item.name.split(' ')[0]}</AppText>
                        <View style={styles.familyRowText}>
                          <AppText weight="700" style={styles.familyName}>{item.name.replace(/^\S+\s/, '')}</AppText>
                          <AppText style={styles.familyReason}>{item.reason}</AppText>
                        </View>
                        <StatusPill verdict={fv2} size="sm" />
                      </View>
                    );
                  })
                )}
              </View>
            </View>
          )}

          {/* Korean vegan classifier warning */}
          {result.veganWarning && (
            <View style={styles.veganWarningBanner}>
              <AppText weight="700" style={styles.veganWarningTitle}>🧪 Korean Vegan Classifier Warning</AppText>
              <AppText style={styles.veganWarningText}>
                AI marked this as safe, but our rule-based classifier detected animal ingredients in the Korean label:
              </AppText>
              {result.veganWarning.detectedAnimal.map((d, i) => (
                <AppText key={i} weight="600" style={styles.veganWarningItem}>🔴 {d.canonical} ({d.english})</AppText>
              ))}
              {result.veganWarning.detectedAmbiguous.map((d, i) => (
                <AppText key={i} weight="600" style={styles.veganWarningItem}>🟡 {d.canonical} ({d.english}) — source unclear</AppText>
              ))}
            </View>
          )}

          {/* Calories + Ingredients */}
          {(result.calories || (result.ingredients && result.ingredients.length > 0)) && (
            <View style={styles.section}>
              <View style={styles.calRow}>
                {result.calories && (
                  <View style={[styles.calBox, { flex: result.ingredients?.length ? 0.4 : 1 }]}>
                    <AppText weight="700" style={styles.calLabel}>{t.caloriesTitle?.toUpperCase()}</AppText>
                    <AppText weight="800" display style={styles.calValue}>{result.calories}</AppText>
                  </View>
                )}
              </View>
              {result.ingredients && result.ingredients.length > 0 && (
                <>
                  <AppText weight="700" display style={styles.sectionTitle}>{t.ingredientsTitle}</AppText>
                  <AppText style={styles.ingredientsList}>{result.ingredients.join(', ')}</AppText>
                </>
              )}
            </View>
          )}

          {/* Nutrition highlights */}
          {result.nutritionHighlights && result.nutritionHighlights.length > 0 && (
            <View style={styles.section}>
              <AppText weight="700" display style={styles.sectionTitle}>{t.nutritionTitle}</AppText>
              {result.nutritionHighlights.map((h, i) => (
                <AppText key={i} style={styles.nutritionItem}>• {h}</AppText>
              ))}
            </View>
          )}

          {/* Action buttons */}
          <View style={styles.actions}>
            {!savedFood && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtnPrimary, saved && styles.actionBtnDone]}
                  onPress={() => !saved && setShowGroupPicker(true)}
                  disabled={saved}
                  activeOpacity={0.85}
                >
                  <Icon name={saved ? 'check' : 'save'} size={18} color={saved ? Colors.safe : '#fff'} stroke={2.5} />
                  <AppText weight="800" style={[styles.actionBtnPrimaryText, saved && { color: Colors.safe }]}>
                    {saved ? t.savedToLibrary : t.saveToMyFoods}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtnOutline} onPress={handleShare} activeOpacity={0.8}>
                  <Icon name="share" size={18} color={Colors.brand} stroke={2.5} />
                  <AppText weight="800" style={styles.actionBtnOutlineText}>Share</AppText>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              style={[styles.actionBtnLog, logged && styles.actionBtnLogDone]}
              onPress={() => !logged && setShowDatePicker(true)}
              disabled={logged}
              activeOpacity={0.8}
            >
              <Icon name={logged ? 'check' : 'calendar'} size={18} color={logged ? Colors.safe : Colors.text} stroke={2.4} />
              <AppText weight="800" style={[styles.actionBtnLogText, logged && { color: Colors.safe }]}>
                {logged ? t.mealLoggedBtn : t.logMealChooseDate}
              </AppText>
            </TouchableOpacity>
          </View>

          {/* AI Disclaimer */}
          <View style={styles.disclaimer}>
            <Icon name="info" size={14} color={Colors.textSecondary} stroke={2} />
            <AppText style={styles.disclaimerText}>{t.aiDisclaimerText}</AppText>
          </View>
        </View>
      </ScrollView>

      {/* Floating top-bar buttons (back + share) */}
      <View style={styles.topBar} pointerEvents="box-none">
        <TouchableOpacity style={styles.overlayBtn} onPress={onBack}>
          <Icon name="chevronLeft" size={22} color={vc.fg} stroke={2.4} />
        </TouchableOpacity>
        {!savedFood && (
          <TouchableOpacity
            style={[styles.overlayBtn, saved && { backgroundColor: Colors.safeSoft }]}
            onPress={() => !saved && setShowGroupPicker(true)}
          >
            <Icon name={saved ? 'saved' : 'save'} size={20} color={saved ? Colors.safe : vc.fg} stroke={2.2} />
          </TouchableOpacity>
        )}
      </View>

      {/* Date picker modal */}
      <Modal visible={showDatePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t.logMealDateTitle}</Text>
            <FlatList
              data={recentDates}
              keyExtractor={(item) => item}
              style={{ maxHeight: 260 }}
              renderItem={({ item }) => {
                const isSelected = item === selectedLogDate;
                const isToday = item === new Date().toISOString().slice(0, 10);
                return (
                  <TouchableOpacity
                    style={[styles.dateItem, isSelected && styles.dateItemSelected]}
                    onPress={() => setSelectedLogDate(item)}
                  >
                    <Text style={[styles.dateItemText, isSelected && styles.dateItemTextSelected]}>
                      {item}{isToday ? '  (Today)' : ''}
                    </Text>
                    {isSelected && <Text style={styles.dateItemCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity style={styles.logConfirmBtn} onPress={handleLogMeal}>
              <Text style={styles.logConfirmText}>{t.logMealConfirm}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowDatePicker(false)}>
              <Text style={styles.modalCancelText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Group picker modal */}
      <Modal visible={showGroupPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t.saveToGroup}</Text>
            <FlatList
              data={[{ id: null, name: t.uncategorized }, ...groups]}
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
              <Text style={styles.modalCancelText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // Floating back/save overlay
  topBar: {
    position: 'absolute', top: 52, left: 16, right: 16, zIndex: 10,
    flexDirection: 'row', justifyContent: 'space-between',
  } as any,
  overlayBtn: {
    width: 42, height: 42, borderRadius: Radius.pill,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },

  // Hero wash
  hero: {
    paddingTop: 110, paddingBottom: 0, paddingHorizontal: 24,
    alignItems: 'center', position: 'relative',
  },
  iconCircle: {
    width: 76, height: 76, borderRadius: Radius.pill,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
    shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  verdictWord: { fontSize: 30, lineHeight: 34, marginBottom: 14, textAlign: 'center' },
  heroFoodName: { fontSize: 19, color: Colors.text, textAlign: 'center', lineHeight: 24 },
  heroSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 3, textAlign: 'center' },
  plateFaceWrap: { marginTop: 8, marginBottom: -10, zIndex: 1 },

  // Detail sheet
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    marginTop: -16, padding: 20, paddingTop: 24,
  },
  summary: { fontSize: 15, color: Colors.text, lineHeight: 23, marginBottom: 24 },

  section: { marginBottom: 22 },
  sectionTitle: { fontSize: 16, color: Colors.text, marginBottom: 10 },

  // Flag rows (Sunny style: soft bg, white icon box)
  flagRow: {
    flexDirection: 'row', alignItems: 'center', gap: 11,
    padding: 11, borderRadius: Radius.sm, marginBottom: 8,
  },
  flagIconBox: {
    width: 38, height: 38, borderRadius: Radius.xs,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  flagText: { flex: 1, minWidth: 0 },
  flagIngredient: { fontSize: 14.5, marginBottom: 2 },
  flagReason: { fontSize: 12.5, color: Colors.textSecondary, lineHeight: 17 },

  // Family check
  familyCard: {
    borderRadius: Radius.card, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.surfaceAlt,
  },
  familyLoading: { fontSize: 13, color: Colors.textSecondary, padding: 14, fontStyle: 'italic' },
  familyRow: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 12, paddingHorizontal: 14, backgroundColor: Colors.surface },
  familyRowBorder: { borderTopWidth: 1, borderTopColor: Colors.surfaceAlt },
  familyEmoji: { fontSize: 24, flexShrink: 0 },
  familyRowText: { flex: 1, minWidth: 0 },
  familyName: { fontSize: 14.5, color: Colors.text },
  familyReason: { fontSize: 12.5, color: Colors.textSecondary, lineHeight: 17 },

  // Vegan warning
  veganWarningBanner: {
    backgroundColor: Colors.cautionSoft, borderRadius: Radius.sm, padding: 14,
    marginBottom: 20, borderLeftWidth: 4, borderLeftColor: Colors.cautionSolid, gap: 6,
  },
  veganWarningTitle: { fontSize: 13, color: Colors.caution, marginBottom: 4 },
  veganWarningText: { fontSize: 12, color: Colors.text, lineHeight: 18 },
  veganWarningItem: { fontSize: 13, color: Colors.caution },

  // Calories
  calRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  calBox: { backgroundColor: Colors.surfaceAlt, borderRadius: Radius.card, padding: 14 },
  calLabel: { fontSize: 11.5, color: Colors.textSecondary, letterSpacing: 0.4, marginBottom: 4 },
  calValue: { fontSize: 22, color: Colors.text },
  ingredientsList: { fontSize: 13.5, color: Colors.textSecondary, lineHeight: 21 },
  nutritionItem: { fontSize: 13, color: Colors.textSecondary, lineHeight: 22 },

  // Action buttons
  actions: { gap: 10, marginTop: 8, marginBottom: 20 },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionBtnPrimary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.brand, borderRadius: Radius.pill, paddingVertical: 14,
    ...Shadow.brand,
  },
  actionBtnDone: { backgroundColor: Colors.safeSoft, shadowOpacity: 0 },
  actionBtnPrimaryText: { fontSize: 14.5, color: '#fff' },
  actionBtnOutline: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.6, borderColor: Colors.brand, borderRadius: Radius.pill, paddingVertical: 14,
    backgroundColor: Colors.surface,
  },
  actionBtnOutlineText: { fontSize: 14.5, color: Colors.brand },
  actionBtnLog: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.surfaceAlt, borderRadius: Radius.pill, paddingVertical: 14,
    borderWidth: 1.6, borderColor: Colors.surfaceAlt,
  },
  actionBtnLogDone: { borderColor: Colors.safeRing, backgroundColor: Colors.safeSoft },
  actionBtnLogText: { fontSize: 14.5, color: Colors.text },

  // Disclaimer
  disclaimer: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 7,
    marginTop: 4, padding: 4,
  },
  disclaimerText: { flex: 1, fontSize: 11.5, color: Colors.textSecondary, lineHeight: 16 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(59,45,39,0.4)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.card, borderTopRightRadius: Radius.card,
    padding: 24, paddingBottom: 40, maxHeight: '60%',
  },
  modalTitle: { fontSize: 19, color: Colors.text, marginBottom: 16 },
  groupItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.surfaceAlt },
  groupItemText: { fontSize: 15, color: Colors.text },
  modalCancel: {
    marginTop: 12, padding: 14, borderRadius: Radius.pill,
    borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center',
  },
  modalCancelText: { fontWeight: '600', color: Colors.textSecondary },
  dateItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Colors.surfaceAlt, paddingHorizontal: 4,
  },
  dateItemSelected: { backgroundColor: Colors.brandSoft, borderRadius: Radius.xs, paddingHorizontal: 8, marginHorizontal: -4 },
  dateItemText: { fontSize: 15, color: Colors.text },
  dateItemTextSelected: { color: Colors.brand },
  dateItemCheck: { fontSize: 16, color: Colors.brand },
  logConfirmBtn: {
    marginTop: 16, backgroundColor: Colors.brand, borderRadius: Radius.pill,
    paddingVertical: 14, alignItems: 'center', ...Shadow.brand,
  },
  logConfirmText: { color: '#fff', fontSize: 15 },
});
