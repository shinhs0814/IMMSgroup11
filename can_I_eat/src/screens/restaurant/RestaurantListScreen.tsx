import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { useLanguage } from '../../context/LanguageContext';
import { Restaurant } from '../../types/restaurant';
import restaurants from '../../data/restaurants.json';

const ALL_RESTAURANTS = restaurants as Restaurant[];

const REGIONS = [
  ...new Set(ALL_RESTAURANTS.map((r) => r.region).filter(Boolean)),
].sort();

type FilterChipProps = {
  label: string;
  emoji: string;
  active: boolean;
  onPress: () => void;
  activeColor: string;
};

function FilterChip({ label, emoji, active, onPress, activeColor }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && { backgroundColor: activeColor, borderColor: activeColor }]}
      onPress={onPress}
    >
      <Text style={styles.chipEmoji}>{emoji}</Text>
      <Text style={[styles.chipText, active && { color: '#fff' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

type Props = {
  onSelect: (restaurant: Restaurant) => void;
};

export default function RestaurantListScreen({ onSelect }: Props) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [filterVegetarian, setFilterVegetarian] = useState(false);
  const [filterHalal, setFilterHalal] = useState(false);
  const [filterGlutenFree, setFilterGlutenFree] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showRegionPicker, setShowRegionPicker] = useState(false);

  const filtered = useMemo(() => {
    return ALL_RESTAURANTS.filter((r) => {
      if (filterVegetarian && !r.vegetarian) return false;
      if (filterHalal && !r.halal) return false;
      if (filterGlutenFree && !r.glutenFree) return false;
      if (selectedRegion && r.region !== selectedRegion) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (!r.name.toLowerCase().includes(q) && !r.address.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [query, filterVegetarian, filterHalal, filterGlutenFree, selectedRegion]);

  const renderItem = useCallback(
    ({ item }: { item: Restaurant }) => (
      <TouchableOpacity style={styles.card} onPress={() => onSelect(item)}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
          {item.category ? (
            <Text style={styles.cardCategory} numberOfLines={1}>{item.category}</Text>
          ) : null}
          <Text style={styles.cardAddress} numberOfLines={1}>{item.address}</Text>
        </View>
        <View style={styles.cardBadges}>
          {item.vegetarian && <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />}
          {item.halal && <View style={[styles.dot, { backgroundColor: '#2196F3' }]} />}
          {item.glutenFree && <View style={[styles.dot, { backgroundColor: '#FF9800' }]} />}
        </View>
      </TouchableOpacity>
    ),
    [onSelect]
  );

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder={t.restaurantSearchPlaceholder}
          placeholderTextColor={Colors.textLight}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
      </View>

      {/* Filter chips */}
      <View style={styles.chips}>
        <FilterChip
          label={t.restaurantFilterVegetarian}
          emoji="🥗"
          active={filterVegetarian}
          onPress={() => setFilterVegetarian((v) => !v)}
          activeColor="#4CAF50"
        />
        <FilterChip
          label={t.restaurantFilterHalal}
          emoji="🌙"
          active={filterHalal}
          onPress={() => setFilterHalal((v) => !v)}
          activeColor="#2196F3"
        />
        <FilterChip
          label={t.restaurantFilterGlutenFree}
          emoji="🌾"
          active={filterGlutenFree}
          onPress={() => setFilterGlutenFree((v) => !v)}
          activeColor="#FF9800"
        />
        <TouchableOpacity
          style={[styles.chip, selectedRegion && { backgroundColor: Colors.primary, borderColor: Colors.primary }]}
          onPress={() => setShowRegionPicker(true)}
        >
          <Text style={styles.chipEmoji}>📍</Text>
          <Text style={[styles.chipText, selectedRegion && { color: '#fff' }]}>
            {selectedRegion ?? t.restaurantAllRegions}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results count */}
      <Text style={styles.count}>
        {filtered.length} {t.restaurantResults}
      </Text>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => `${item.name}|${item.address}`}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>{t.restaurantNoResults}</Text>
            <Text style={styles.emptySub}>{t.restaurantNoResultsSub}</Text>
          </View>
        }
        keyboardShouldPersistTaps="handled"
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
      />

      {/* Region picker modal */}
      <Modal visible={showRegionPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t.restaurantAllRegions}</Text>
            <ScrollView>
              <TouchableOpacity
                style={styles.regionItem}
                onPress={() => { setSelectedRegion(null); setShowRegionPicker(false); }}
              >
                <Text style={[styles.regionText, !selectedRegion && styles.regionActive]}>
                  {t.restaurantAllRegions}
                </Text>
                {!selectedRegion && <Text style={styles.regionCheck}>✓</Text>}
              </TouchableOpacity>
              {REGIONS.map((region) => (
                <TouchableOpacity
                  key={region}
                  style={styles.regionItem}
                  onPress={() => { setSelectedRegion(region); setShowRegionPicker(false); }}
                >
                  <Text style={[styles.regionText, selectedRegion === region && styles.regionActive]}>
                    {region}
                  </Text>
                  {selectedRegion === region && <Text style={styles.regionCheck}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowRegionPicker(false)}>
              <Text style={styles.modalCloseText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchRow: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  chipEmoji: { fontSize: 13 },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  count: { fontSize: 12, color: Colors.textSecondary, paddingHorizontal: 20, marginBottom: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLeft: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  cardCategory: { fontSize: 12, color: Colors.primary, fontWeight: '600', marginBottom: 3 },
  cardAddress: { fontSize: 12, color: Colors.textSecondary },
  cardBadges: { flexDirection: 'column', gap: 4, marginLeft: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  emptySub: { fontSize: 14, color: Colors.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 16 },
  regionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  regionText: { fontSize: 15, color: Colors.text },
  regionActive: { color: Colors.primary, fontWeight: '700' },
  regionCheck: { fontSize: 15, color: Colors.primary },
  modalClose: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  modalCloseText: { fontWeight: '600', color: Colors.textSecondary },
});
