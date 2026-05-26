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
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import AppText from '../../components/AppText';
import {
  MealRecord,
  getMealsByDate,
  getRecordedDates,
  deleteMealRecord,
} from '../../services/storage';

type Props = {
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

export default function MealHistoryScreen({ onOpenSettings }: Props) {
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

  const statusColor = (status: string) => {
    if (status === 'safe') return Colors.safe;
    if (status === 'caution') return Colors.caution;
    return Colors.unsafe;
  };

  const statusEmoji = (status: string) => {
    if (status === 'safe') return '✅';
    if (status === 'caution') return '⚠️';
    return '🚫';
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
        <View>
          <AppText weight="800" style={styles.title}>{t.mealHistoryTitle}</AppText>
          <AppText weight="400" style={styles.subtitle}>{t.mealHistorySubtitle}</AppText>
        </View>
        <TouchableOpacity onPress={onOpenSettings} style={styles.profileBtn}>
          <Text style={styles.profileInitial}>
            {user?.displayName?.charAt(0).toUpperCase() || '?'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date navigator */}
      <View style={styles.dateNav}>
        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => setSelectedDate(addDays(selectedDate, -1))}
        >
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekRow}
        >
          {weekDates.map((d) => {
            const isSelected = d === selectedDate;
            const hasRecord = recordedDates.has(d);
            const isFuture = d > today;
            return (
              <TouchableOpacity
                key={d}
                style={[styles.dayDot, isSelected && styles.dayDotSelected]}
                onPress={() => !isFuture && setSelectedDate(d)}
                disabled={isFuture}
              >
                <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected, isFuture && styles.dayFuture]}>
                  {d.slice(8)}
                </Text>
                {hasRecord && !isSelected && <View style={styles.recordDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          style={[styles.arrowBtn, !canGoForward && styles.arrowDisabled]}
          onPress={() => canGoForward && setSelectedDate(addDays(selectedDate, 1))}
          disabled={!canGoForward}
        >
          <Text style={[styles.arrowText, !canGoForward && styles.arrowTextDisabled]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Selected date label */}
      <View style={styles.dateLabelRow}>
        <Text style={styles.dateLabel}>
          {isToday ? `${t.mealHistoryToday} (${formatDate(selectedDate)})` : formatDate(selectedDate)}
        </Text>
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
          <ActivityIndicator color={Colors.primary} style={styles.loader} />
        ) : meals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>{t.mealHistoryEmpty}</Text>
            <Text style={styles.emptySubtitle}>{t.mealHistoryEmptySub}</Text>
          </View>
        ) : (
          meals.map((meal) => (
            <View key={meal.id} style={styles.mealCard}>
              {meal.imageBase64 ? (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${meal.imageBase64}` }}
                  style={styles.mealImage}
                />
              ) : meal.imageUrl ? (
                <Image source={{ uri: meal.imageUrl }} style={styles.mealImage} resizeMode="cover" />
              ) : (
                <View style={[styles.mealImage, styles.mealImagePlaceholder]}>
                  <Text style={{ fontSize: 26 }}>🍽️</Text>
                </View>
              )}

              <View style={styles.mealInfo}>
                <Text style={styles.mealName} numberOfLines={1}>{meal.foodName}</Text>
                <View style={styles.statusRow}>
                  <Text style={styles.statusEmoji}>
                    {statusEmoji(meal.analysisResult.overallStatus)}
                  </Text>
                  <Text style={[styles.statusText, { color: statusColor(meal.analysisResult.overallStatus) }]}>
                    {meal.analysisResult.overallStatus.charAt(0).toUpperCase() +
                      meal.analysisResult.overallStatus.slice(1)}
                  </Text>
                </View>
                {meal.eatenAt?.toDate && (
                  <Text style={styles.timeText}>
                    {meal.eatenAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                )}
              </View>

              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(meal)}>
                <Text style={styles.deleteBtnText}>×</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: { color: '#fff', fontWeight: '700', fontSize: 18 },

  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: Colors.card,
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  arrowBtn: { paddingHorizontal: 8 },
  arrowDisabled: { opacity: 0.3 },
  arrowText: { fontSize: 28, color: Colors.primary, lineHeight: 32 },
  arrowTextDisabled: { color: Colors.textLight },
  weekRow: { flexDirection: 'row', gap: 4, paddingHorizontal: 4 },
  dayDot: {
    width: 36,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotSelected: { backgroundColor: Colors.primary },
  dayLabel: { fontSize: 14, fontWeight: '600', color: Colors.text },
  dayLabelSelected: { color: '#fff' },
  dayFuture: { color: Colors.textLight },
  recordDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 3,
  },

  dateLabelRow: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 6 },
  dateLabel: { fontSize: 16, fontWeight: '700', color: Colors.text },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  loader: { marginTop: 60 },

  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 52, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 18 },

  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mealImage: { width: 72, height: 72, resizeMode: 'cover' },
  mealImagePlaceholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.border },
  mealInfo: { flex: 1, paddingHorizontal: 14, paddingVertical: 10 },
  mealName: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  statusEmoji: { fontSize: 12 },
  statusText: { fontSize: 12, fontWeight: '600' },
  timeText: { fontSize: 11, color: Colors.textSecondary },
  deleteBtn: { paddingHorizontal: 14, paddingVertical: 12 },
  deleteBtnText: { fontSize: 20, color: Colors.textSecondary },
});
