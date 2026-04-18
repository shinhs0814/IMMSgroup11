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
} from 'react-native';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import AppText from '../../components/AppText';
import { useFoods } from '../../context/FoodContext';
import { SavedFood } from '../../services/storage';

type Props = {
  onNavigateToAnalysis: (food?: SavedFood) => void;
  onOpenSettings: () => void;
};

export default function HomeScreen({ onNavigateToAnalysis, onOpenSettings }: Props) {
  const { user } = useAuth();
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

  const uncategorized = savedFoods.filter((f) => !f.groupId);
  const foodsInGroup = (groupId: string) => savedFoods.filter((f) => f.groupId === groupId);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    await addGroup(newGroupName.trim());
    setNewGroupName('');
    setShowNewGroup(false);
  };

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    Alert.alert(
      t.deleteGroup,
      t.deleteGroupConfirm,
      [
        { text: t.cancel, style: 'cancel' },
        { text: t.delete, style: 'destructive', onPress: () => removeGroup(groupId) },
      ]
    );
  };

  const handleDeleteFood = (foodId: string, foodName: string) => {
    Alert.alert(t.removeFood, t.removeFoodConfirm, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: () => removeFood(foodId) },
    ]);
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

  const renderFood = (food: SavedFood) => (
    <TouchableOpacity
      key={food.id}
      style={styles.foodCard}
      onPress={() => onNavigateToAnalysis(food)}
      onLongPress={() => setMovingFood(food)}
    >
      {food.imageBase64 ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${food.imageBase64}` }}
          style={styles.foodImage}
        />
      ) : food.imageUrl ? (
        <Image
          source={{ uri: food.imageUrl }}
          style={styles.foodImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.foodImagePlaceholder, { backgroundColor: Colors.border }]}>
          <Text style={{ fontSize: 28 }}>🍽️</Text>
        </View>
      )}
      <View style={styles.foodInfo}>
        <Text style={styles.foodName} numberOfLines={1}>{food.foodName}</Text>
        <View style={styles.foodStatus}>
          <Text style={styles.statusEmoji}>{statusEmoji(food.analysisResult.overallStatus)}</Text>
          <Text style={[styles.statusText, { color: statusColor(food.analysisResult.overallStatus) }]}>
            {food.analysisResult.overallStatus.charAt(0).toUpperCase() +
              food.analysisResult.overallStatus.slice(1)}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteFood(food.id, food.foodName)}>
        <Text style={styles.deleteBtnText}>×</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <AppText weight="800" style={styles.greeting}>{t.hello}, {firstName}! 👋</AppText>
          <AppText weight="400" style={styles.subGreeting}>{t.savedFoods}</AppText>
        </View>
        <TouchableOpacity onPress={onOpenSettings} style={styles.profileBtn}>
          <Text style={styles.profileInitial}>
            {user?.displayName?.charAt(0).toUpperCase() || '?'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loadingFoods} onRefresh={fetchAll} />}
      >
        {/* Create group button */}
        <TouchableOpacity style={styles.newGroupBtn} onPress={() => setShowNewGroup(true)}>
          <Text style={styles.newGroupIcon}>＋</Text>
          <Text style={styles.newGroupText}>{t.newGroup}</Text>
        </TouchableOpacity>

        {/* Named groups */}
        {groups.map((group) => {
          const foods = foodsInGroup(group.id);
          return (
            <View key={group.id} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{group.name}</Text>
                <View style={styles.sectionActions}>
                  <Text style={styles.sectionCount}>{foods.length} {t.items}</Text>
                  <TouchableOpacity onPress={() => handleDeleteGroup(group.id, group.name)}>
                    <Text style={styles.sectionDelete}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {foods.length === 0 ? (
                <Text style={styles.emptyGroup}>{t.noFoodsInGroup}</Text>
              ) : (
                foods.map(renderFood)
              )}
            </View>
          );
        })}

        {/* Uncategorized */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.uncategorized}</Text>
            <Text style={styles.sectionCount}>{uncategorized.length} {t.items}</Text>
          </View>
          {uncategorized.length === 0 && savedFoods.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📷</Text>
              <Text style={styles.emptyTitle}>{t.nothingSaved}</Text>
              <Text style={styles.emptySubtitle}>{t.nothingSavedSub}</Text>
            </View>
          ) : uncategorized.length === 0 ? (
            <Text style={styles.emptyGroup}>{t.noFoodsInGroup}</Text>
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
  greeting: { fontSize: 26, fontWeight: '800', color: Colors.text },
  subGreeting: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: { color: '#fff', fontWeight: '700', fontSize: 18 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  newGroupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    marginBottom: 20,
    justifyContent: 'center',
  },
  newGroupIcon: { fontSize: 18, color: Colors.primary, fontWeight: '700' },
  newGroupText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  sectionActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionCount: { fontSize: 12, color: Colors.textSecondary },
  sectionDelete: { fontSize: 14, color: Colors.textSecondary },
  emptyGroup: { fontSize: 13, color: Colors.textLight, fontStyle: 'italic', paddingVertical: 8 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  foodCard: {
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
  foodImage: { width: 72, height: 72, resizeMode: 'cover' },
  foodImagePlaceholder: { width: 72, height: 72, justifyContent: 'center', alignItems: 'center' },
  foodInfo: { flex: 1, paddingHorizontal: 14, paddingVertical: 12 },
  foodName: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  foodStatus: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusEmoji: { fontSize: 13 },
  statusText: { fontSize: 12, fontWeight: '600' },
  deleteBtn: { paddingHorizontal: 14, paddingVertical: 12 },
  deleteBtnText: { fontSize: 20, color: Colors.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 16 },
  modalInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  modalBtns: { flexDirection: 'row', gap: 12 },
  modalCancel: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  modalCancelText: { fontWeight: '600', color: Colors.textSecondary },
  modalCreate: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: Colors.primary, alignItems: 'center' },
  modalCreateText: { fontWeight: '700', color: '#fff' },
  groupPickerItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  groupPickerText: { fontSize: 15, color: Colors.text },
});
