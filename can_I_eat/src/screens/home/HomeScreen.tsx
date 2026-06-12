import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  RefreshControl,
  Modal,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, verdictColors } from '../../constants/colors';
import { Radius, Shadow } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import AppText from '../../components/AppText';
import Icon from '../../components/Icon';
import PlateFace from '../../components/PlateFace';
import StatusPill from '../../components/StatusPill';
import { useFoods } from '../../context/FoodContext';
import { SavedFood } from '../../services/storage';
import { ALLERGIES, DIETARY_RESTRICTIONS, DIETARY_PREFERENCES } from '../../constants/dietary';

type Props = {
  onNavigateToAnalysis: (food?: SavedFood) => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onScan: () => void;
};

export default function HomeScreen({ onNavigateToAnalysis, onOpenSettings, onOpenHistory, onScan }: Props) {
  const { user, activeProfile } = useAuth();
  const { t } = useLanguage();
  const { savedFoods, groups, loadingFoods, fetchAll, addGroup, removeGroup, renameGroup, removeFood, moveFood } =
    useFoods();
  const [newGroupName, setNewGroupName] = useState('');
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [movingFood, setMovingFood] = useState<SavedFood | null>(null);

  // FoodContext auto-fetches when user becomes available (handles app restart).
  // This effect handles the case where HomeScreen is revisited after navigation
  // (e.g. returning from Camera/Search after saving a new food).
  useEffect(() => {
    fetchAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const firstName = user?.displayName?.split(' ')[0] || 'there';

  const getDietChips = () => {
    if (!activeProfile) return [];
    const chips: Array<{ emoji: string; label: string }> = [];
    (activeProfile.allergies || []).forEach((id: string) => {
      if (id.startsWith('custom:')) {
        chips.push({ emoji: '⚠️', label: id.replace('custom:', '') });
      } else {
        const a = ALLERGIES.find((x) => x.id === id);
        if (a) chips.push({ emoji: a.emoji, label: a.label });
      }
    });
    (activeProfile.restrictions || []).forEach((id: string) => {
      const r = DIETARY_RESTRICTIONS.find((x) => x.id === id);
      if (r) chips.push({ emoji: r.emoji, label: r.label });
    });
    (activeProfile.preferences || []).forEach((id: string) => {
      const p = DIETARY_PREFERENCES.find((x) => x.id === id);
      if (p) chips.push({ emoji: p.emoji, label: p.label });
    });
    return chips;
  };

  const uncategorized = savedFoods.filter((f) => !f.groupId);
  const foodsInGroup = (groupId: string) => savedFoods.filter((f) => f.groupId === groupId);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    await addGroup(newGroupName.trim());
    setNewGroupName('');
    setShowNewGroup(false);
  };

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm(t.deleteGroupConfirm)) removeGroup(groupId);
      return;
    }
    Alert.alert(t.deleteGroup, t.deleteGroupConfirm, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: () => removeGroup(groupId) },
    ]);
  };

  const handleDeleteFood = (foodId: string, foodName: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm(t.removeFoodConfirm)) removeFood(foodId);
      return;
    }
    Alert.alert(t.removeFood, t.removeFoodConfirm, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: () => removeFood(foodId) },
    ]);
  };

  const renderFood = (food: SavedFood) => {
    const verdict = food.analysisResult.overallStatus as 'safe' | 'caution' | 'unsafe';
    const vc = verdictColors(verdict)!;
    return (
      <TouchableOpacity
        key={food.id}
        style={styles.foodCard}
        onPress={() => onNavigateToAnalysis(food)}
        onLongPress={() => setMovingFood(food)}
        activeOpacity={0.85}
      >
        {food.imageBase64 ? (
          <Image source={{ uri: `data:image/jpeg;base64,${food.imageBase64}` }} style={styles.foodImage} />
        ) : food.imageUrl ? (
          <Image source={{ uri: food.imageUrl }} style={styles.foodImage} resizeMode="cover" />
        ) : (
          <View style={[styles.foodImagePlaceholder, { backgroundColor: vc.soft }]}>
            <Text style={{ fontSize: 26 }}>🍽️</Text>
          </View>
        )}
        <View style={styles.foodInfo}>
          <AppText weight="700" style={styles.foodName} numberOfLines={1}>{food.foodName}</AppText>
          <StatusPill verdict={verdict} size="sm" />
        </View>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteFood(food.id, food.foodName)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="x" size={16} color={Colors.textSecondary} stroke={2.5} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <AppText weight="800" display style={styles.greeting}>{t.hello}, {firstName}! 👋</AppText>
          <AppText weight="600" style={styles.subGreeting}>{t.savedFoods}</AppText>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={onOpenHistory} style={styles.iconBtn} activeOpacity={0.7}>
            <Icon name="calendar" size={20} color={Colors.text} stroke={2.2} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onOpenSettings} style={styles.avatarBtn} activeOpacity={0.85}>
            <AppText weight="800" display style={styles.avatarInitial}>
              {user?.displayName?.charAt(0).toUpperCase() || '?'}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loadingFoods} onRefresh={fetchAll} />}
      >
        {/* Hero scan card */}
        <TouchableOpacity onPress={onScan} style={styles.heroCard} activeOpacity={0.92}>
          <LinearGradient
            colors={['#EC6A56', '#F2856F']}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroContent}>
              <AppText weight="800" display style={styles.heroTitle}>Can I eat it?</AppText>
              <AppText style={styles.heroSub}>Snap a dish, label or menu — get an instant verdict.</AppText>
              <View style={styles.heroBtn}>
                <Icon name="camera" size={16} color={Colors.brand} stroke={2.4} />
                <AppText weight="800" style={styles.heroBtnText}>Scan now</AppText>
              </View>
            </View>
            <View style={styles.heroPlateFace} pointerEvents="none">
              <PlateFace size={120} mood="happy" plate="#FFF4EF" rim="#FBE0D7" pupil="#E79683" cheek="#F7B6A6" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Diet profile card */}
        {activeProfile && (
          <TouchableOpacity onPress={onOpenSettings} style={styles.profileCard} activeOpacity={0.85}>
            <View style={styles.profileCardHeader}>
              <View style={styles.profileIconBox}>
                <Icon name="shieldCheck" size={17} color={Colors.brand} stroke={2.2} />
              </View>
              <AppText weight="700" display style={styles.profileCardTitle}>Your diet profile</AppText>
              <Icon name="chevronRight" size={17} color={Colors.textSecondary} stroke={2} />
            </View>
            {getDietChips().length > 0 && (
              <View style={styles.profileChips}>
                {getDietChips().map((chip, i) => (
                  <View key={i} style={styles.profileChip}>
                    <AppText weight="700" style={styles.profileChipText}>{chip.emoji} {chip.label}</AppText>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* Create group button */}
        <TouchableOpacity style={styles.newGroupBtn} onPress={() => setShowNewGroup(true)} activeOpacity={0.7}>
          <Icon name="plus" size={18} color={Colors.brand} stroke={2.5} />
          <AppText weight="700" style={styles.newGroupText}>{t.newGroup}</AppText>
        </TouchableOpacity>

        {/* Named groups */}
        {groups.map((group) => {
          const foods = foodsInGroup(group.id);
          return (
            <View key={group.id} style={styles.section}>
              <View style={styles.sectionHeader}>
                <AppText weight="700" display style={styles.sectionTitle}>{group.name}</AppText>
                <View style={styles.sectionActions}>
                  <AppText style={styles.sectionCount}>{foods.length} {t.items}</AppText>
                  <TouchableOpacity onPress={() => handleDeleteGroup(group.id, group.name)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Icon name="trash" size={15} color={Colors.textSecondary} stroke={2} />
                  </TouchableOpacity>
                </View>
              </View>
              {foods.length === 0 ? (
                <AppText style={styles.emptyGroup}>{t.noFoodsInGroup}</AppText>
              ) : (
                foods.map(renderFood)
              )}
            </View>
          );
        })}

        {/* Uncategorized */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText weight="700" display style={styles.sectionTitle}>{t.uncategorized}</AppText>
            <AppText style={styles.sectionCount}>{uncategorized.length} {t.items}</AppText>
          </View>
          {uncategorized.length === 0 && savedFoods.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📷</Text>
              <AppText weight="700" display style={styles.emptyTitle}>{t.nothingSaved}</AppText>
              <AppText style={styles.emptySubtitle}>{t.nothingSavedSub}</AppText>
            </View>
          ) : uncategorized.length === 0 ? (
            <AppText style={styles.emptyGroup}>{t.noFoodsInGroup}</AppText>
          ) : (
            uncategorized.map(renderFood)
          )}
        </View>
      </ScrollView>

      {/* New Group Modal */}
      <Modal visible={showNewGroup} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t.newGroupTitle}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={t.newGroupPlaceholder}
              value={newGroupName}
              onChangeText={setNewGroupName}
              autoFocus
              placeholderTextColor={Colors.textLight}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => { setShowNewGroup(false); setNewGroupName(''); }}
              >
                <Text style={styles.modalCancelText}>{t.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCreate} onPress={handleCreateGroup}>
                <Text style={styles.modalCreateText}>{t.create}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Move food modal */}
      <Modal visible={!!movingFood} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t.moveToGroup}</Text>
            <FlatList
              data={[{ id: null, name: t.uncategorized }, ...groups]}
              keyExtractor={(item) => item.id || 'none'}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.groupPickerItem}
                  onPress={async () => {
                    if (movingFood) {
                      await moveFood(movingFood.id, item.id);
                    }
                    setMovingFood(null);
                  }}
                >
                  <Text style={styles.groupPickerText}>{item.name}</Text>
                  {(movingFood?.groupId === item.id) && <Text>✓</Text>}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCancel} onPress={() => setMovingFood(null)}>
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

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 22,
    paddingBottom: 18,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: Radius.card,
    borderBottomRightRadius: Radius.card,
    ...Shadow.soft,
  },
  headerLeft: { flex: 1 },
  greeting: { fontSize: 24, color: Colors.text, lineHeight: 30 },
  subGreeting: { fontSize: 13.5, color: Colors.textSecondary, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 42, height: 42, borderRadius: Radius.pill,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarBtn: {
    width: 42, height: 42, borderRadius: Radius.pill,
    backgroundColor: Colors.brand,
    justifyContent: 'center', alignItems: 'center',
    ...Shadow.brand,
  },
  avatarInitial: { color: '#fff', fontSize: 18 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 110 },

  // Hero scan card
  heroCard: {
    borderRadius: Radius.card,
    overflow: 'hidden',
    marginBottom: 14,
    ...Shadow.brand,
  },
  heroGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingLeft: 22,
    paddingRight: 0,
    minHeight: 148,
  },
  heroContent: { flex: 1, gap: 6 },
  heroTitle: { fontSize: 26, color: '#fff', lineHeight: 32 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 18, marginBottom: 4 },
  heroBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: Radius.pill,
  },
  heroBtnText: { color: Colors.brand, fontSize: 14 },
  heroPlateFace: { width: 120, alignItems: 'center', justifyContent: 'center' },

  // Diet profile card
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.sm,
    paddingHorizontal: 15, paddingVertical: 14,
    marginBottom: 18,
    gap: 11,
    ...Shadow.soft,
  },
  profileCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  profileIconBox: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: Colors.brandSoft,
    justifyContent: 'center', alignItems: 'center',
  },
  profileCardTitle: { flex: 1, fontSize: 14.5, color: Colors.text },
  profileChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  profileChip: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.pill,
    paddingHorizontal: 11, paddingVertical: 6,
  },
  profileChipText: { fontSize: 12.5, color: Colors.text },

  // New group
  newGroupBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: 14, borderRadius: Radius.sm,
    borderWidth: 1.5, borderColor: Colors.brand, borderStyle: 'dashed',
    marginBottom: 22,
  },
  newGroupText: { fontSize: 14, color: Colors.brand },

  // Sections
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, color: Colors.text },
  sectionActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionCount: { fontSize: 12, color: Colors.textSecondary },
  emptyGroup: { fontSize: 13, color: Colors.textLight, fontStyle: 'italic', paddingVertical: 8 },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji: { fontSize: 52, marginBottom: 14 },
  emptyTitle: { fontSize: 20, color: Colors.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },

  // Food card
  foodCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.sm,
    marginBottom: 10,
    overflow: 'hidden',
    ...Shadow.soft,
  },
  foodImage: { width: 72, height: 72, resizeMode: 'cover' },
  foodImagePlaceholder: { width: 72, height: 72, justifyContent: 'center', alignItems: 'center' },
  foodInfo: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, gap: 6 },
  foodName: { fontSize: 15, color: Colors.text },
  deleteBtn: { paddingHorizontal: 14, paddingVertical: 16 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(59,45,39,0.4)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.card, borderTopRightRadius: Radius.card,
    padding: 24, paddingBottom: 40,
  },
  modalTitle: { fontSize: 19, color: Colors.text, marginBottom: 16 },
  modalInput: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.sm,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: Colors.text,
    marginBottom: 16,
  },
  modalBtns: { flexDirection: 'row', gap: 12 },
  modalCancel: {
    flex: 1, padding: 14, borderRadius: Radius.pill,
    borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center',
  },
  modalCancelText: { fontWeight: '600', color: Colors.textSecondary },
  modalCreate: { flex: 1, padding: 14, borderRadius: Radius.pill, backgroundColor: Colors.brand, alignItems: 'center', ...Shadow.brand },
  modalCreateText: { fontWeight: '700', color: '#fff' },
  groupPickerItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.surfaceAlt,
  },
  groupPickerText: { fontSize: 15, color: Colors.text },
});
