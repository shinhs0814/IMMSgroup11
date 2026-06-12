import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Colors, verdictColors } from '../../constants/colors';
import { Radius, Shadow } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import AppText from '../../components/AppText';
import Icon from '../../components/Icon';
import StatusPill from '../../components/StatusPill';
import {
  MealRecord,
  getMealsByDate,
  getRecordedDates,
  deleteMealRecord,
} from '../../services/storage';

type Props = {
  onBack: () => void;
  onOpenSettings: () => void;
};

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${y}.${m}.${d}`;
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr: string, delta: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

export default function MealHistoryScreen({ onOpenSettings, onBack }: Props) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [selectedDate, setSelectedDate] = useState(todayString());
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [recordedDates, setRecordedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadDates = useCallback(async () => {
    if (!user) return;
    const dates = await getRecordedDates(user.uid);
    setRecordedDates(new Set(dates));
  }, [user]);

  const loadMeals = useCallback(async (date: string, isRefresh = false) => {
    if (!user) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await getMealsByDate(user.uid, date);
      setMeals(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadDates();
  }, [loadDates]);

  useEffect(() => {
    loadMeals(selectedDate);
  }, [selectedDate, loadMeals]);

  const handleDelete = (record: MealRecord) => {
    Alert.alert(
      t.mealHistoryDelete,
      t.mealHistoryDeleteConfirm,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: async () => {
            await deleteMealRecord(record.id);
            setMeals((prev) => prev.filter((m) => m.id !== record.id));
            await loadDates();
          },
        },
      ]
    );
  };

  const today = todayString();
  const isToday = selectedDate === today;
  const canGoForward = selectedDate < today;

  // Show 7 day dots around selected date
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i - 3));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Icon name="chevronLeft" size={22} color={Colors.text} stroke={2.4} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <AppText weight="800" display style={styles.title}>{t.mealHistoryTitle}</AppText>
            <AppText style={styles.subtitle}>{t.mealHistorySubtitle}</AppText>
          </View>
          <TouchableOpacity onPress={onOpenSettings} style={styles.profileBtn}>
            <AppText weight="800" display style={styles.profileInitial}>
              {user?.displayName?.charAt(0).toUpperCase() || '?'}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Week strip */}
        <View style={styles.weekStrip}>
          {weekDates.map((d) => {
            const isSelected = d === selectedDate;
            const hasRecord = recordedDates.has(d);
            const isFuture = d > today;
            const dow = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(d + 'T00:00:00').getDay()];
            return (
              <TouchableOpacity
                key={d}
                style={[styles.dayBtn, isSelected && styles.dayBtnSelected]}
                onPress={() => !isFuture && setSelectedDate(d)}
                disabled={isFuture}
                activeOpacity={0.7}
              >
                <AppText style={[styles.dayDow, isSelected && styles.dayDowSelected, isFuture && styles.dayFuture]}>
                  {dow}
                </AppText>
                <AppText weight="800" display style={[styles.dayNum, isSelected && styles.dayNumSelected, isFuture && styles.dayFuture]}>
                  {d.slice(8)}
                </AppText>
                <View style={[styles.recordDot, { backgroundColor: hasRecord ? (isSelected ? '#fff' : Colors.brand) : 'transparent' }]} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Selected date label */}
      <View style={styles.dateLabelRow}>
        <AppText weight="700" display style={styles.dateLabel}>
          {isToday ? `${t.mealHistoryToday}` : `${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(selectedDate + 'T00:00:00').getDay()]}, ${selectedDate.slice(5)}`}
        </AppText>
      </View>

      {/* Meal list */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadMeals(selectedDate, true)}
          />
        }
      >
        {loading ? (
          <ActivityIndicator color={Colors.brand} style={styles.loader} />
        ) : meals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <AppText weight="700" display style={styles.emptyTitle}>{t.mealHistoryEmpty}</AppText>
            <AppText style={styles.emptySubtitle}>{t.mealHistoryEmptySub}</AppText>
          </View>
        ) : (
          meals.map((meal) => {
            const verdict = meal.analysisResult.overallStatus as 'safe' | 'caution' | 'unsafe';
            const vc = verdictColors(verdict)!;
            return (
              <View key={meal.id} style={styles.mealCard}>
                {meal.imageBase64 ? (
                  <Image source={{ uri: `data:image/jpeg;base64,${meal.imageBase64}` }} style={styles.mealImage} />
                ) : meal.imageUrl ? (
                  <Image source={{ uri: meal.imageUrl }} style={styles.mealImage} resizeMode="cover" />
                ) : (
                  <View style={[styles.mealImagePlaceholder, { backgroundColor: vc.soft }]}>
                    <Text style={{ fontSize: 24 }}>🍽️</Text>
                  </View>
                )}
                <View style={styles.mealInfo}>
                  <AppText weight="700" display style={styles.mealName} numberOfLines={1}>{meal.foodName}</AppText>
                  <StatusPill verdict={verdict} size="sm" />
                  {meal.eatenAt?.toDate && (
                    <AppText style={styles.timeText}>
                      {meal.eatenAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </AppText>
                  )}
                </View>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(meal)}>
                  <Icon name="x" size={16} color={Colors.textSecondary} stroke={2.5} />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    paddingTop: 58,
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: Radius.card,
    borderBottomRightRadius: Radius.card,
    ...Shadow.soft,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: { fontSize: 22, color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 1 },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBtn: {
    width: 42,
    height: 42,
    borderRadius: Radius.pill,
    backgroundColor: Colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.brand,
  },
  profileInitial: { color: '#fff', fontSize: 17 },

  // Week strip
  weekStrip: { flexDirection: 'row', gap: 6 },
  dayBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.xs,
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    gap: 2,
  },
  dayBtnSelected: { backgroundColor: Colors.brand },
  dayDow: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  dayDowSelected: { color: 'rgba(255,255,255,0.85)' },
  dayNum: { fontSize: 18, color: Colors.text },
  dayNumSelected: { color: '#fff' },
  dayFuture: { opacity: 0.35 },
  recordDot: { width: 5, height: 5, borderRadius: Radius.pill, marginTop: 1 },

  dateLabelRow: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 6 },
  dateLabel: { fontSize: 17, color: Colors.text },

  scroll: { flex: 1 },
  scrollContent: { padding: 18, paddingBottom: 110 },
  loader: { marginTop: 60 },

  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 52, marginBottom: 14 },
  emptyTitle: { fontSize: 18, color: Colors.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 19 },

  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.sm,
    marginBottom: 10,
    overflow: 'hidden',
    ...Shadow.soft,
  },
  mealImage: { width: 72, height: 72, resizeMode: 'cover' },
  mealImagePlaceholder: { width: 72, height: 72, justifyContent: 'center', alignItems: 'center' },
  mealInfo: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, gap: 6 },
  mealName: { fontSize: 15, color: Colors.text },
  timeText: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  deleteBtn: { paddingHorizontal: 14, paddingVertical: 16 },
});
