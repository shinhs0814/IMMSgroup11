import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { useLanguage } from '../../context/LanguageContext';
import { Restaurant } from '../../types/restaurant';

type Props = {
  restaurant: Restaurant;
  onBack: () => void;
};

export default function RestaurantDetailScreen({ restaurant, onBack }: Props) {
  const { t } = useLanguage();

  const openMaps = () => {
    const query = encodeURIComponent(restaurant.address);
    const url = `https://maps.google.com/?q=${query}`;
    Linking.openURL(url).catch(() =>
      Alert.alert(t.errorTitle, t.restaurantCouldNotOpenMaps)
    );
  };

  const callPhone = () => {
    if (!restaurant.phone) return;
    Linking.openURL(`tel:${restaurant.phone}`).catch(() =>
      Alert.alert(t.errorTitle, t.restaurantPhone)
    );
  };

  const badges = [
    restaurant.vegetarian && { label: t.restaurantFilterVegetarian, color: '#4CAF50', bg: '#E8F5E9', emoji: '🥗' },
    restaurant.halal && { label: t.restaurantFilterHalal, color: '#2196F3', bg: '#E3F2FD', emoji: '🌙' },
    restaurant.glutenFree && { label: t.restaurantFilterGlutenFree, color: '#FF9800', bg: '#FFF3E0', emoji: '🌾' },
  ].filter(Boolean) as { label: string; color: string; bg: string; emoji: string }[];

  const isInfoAvailable = (val: string) =>
    val && val.trim() !== '' && val.trim() !== '정보없음';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{restaurant.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Name + category */}
        <View style={styles.nameCard}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          {restaurant.category ? (
            <Text style={styles.category}>{restaurant.category}</Text>
          ) : null}
          {badges.length > 0 && (
            <View style={styles.badges}>
              {badges.map((b) => (
                <View key={b.label} style={[styles.badge, { backgroundColor: b.bg }]}>
                  <Text style={styles.badgeEmoji}>{b.emoji}</Text>
                  <Text style={[styles.badgeText, { color: b.color }]}>{b.label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Address */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{t.restaurantAddress}</Text>
              <Text style={styles.infoValue}>
                {isInfoAvailable(restaurant.address) ? restaurant.address : t.restaurantInfoNotAvailable}
              </Text>
              {isInfoAvailable(restaurant.district) && (
                <Text style={styles.infoSub}>{restaurant.district}</Text>
              )}
            </View>
          </View>

          {/* Hours */}
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🕐</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{t.restaurantHours}</Text>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursLabel}>{t.restaurantWeekdays}</Text>
                <Text style={styles.hoursValue}>
                  {isInfoAvailable(restaurant.weekdayHours)
                    ? restaurant.weekdayHours
                    : t.restaurantInfoNotAvailable}
                </Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursLabel}>{t.restaurantWeekends}</Text>
                <Text style={styles.hoursValue}>
                  {isInfoAvailable(restaurant.weekendHours)
                    ? restaurant.weekendHours
                    : t.restaurantInfoNotAvailable}
                </Text>
              </View>
            </View>
          </View>

          {/* Phone */}
          {isInfoAvailable(restaurant.phone) && (
            <>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.infoRow} onPress={callPhone}>
                <Text style={styles.infoIcon}>📞</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{t.restaurantPhone}</Text>
                  <Text style={[styles.infoValue, styles.phoneLink]}>{restaurant.phone}</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Google Maps button */}
        {isInfoAvailable(restaurant.address) && (
          <TouchableOpacity style={styles.mapsBtn} onPress={openMaps}>
            <Text style={styles.mapsBtnText}>🗺  {t.restaurantDirections}</Text>
          </TouchableOpacity>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: { fontSize: 18, color: Colors.text },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.text, flex: 1, textAlign: 'center', marginHorizontal: 8 },
  scroll: { padding: 20, paddingBottom: 60 },
  nameCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  restaurantName: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  category: { fontSize: 14, color: Colors.textSecondary, marginBottom: 12 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  badgeEmoji: { fontSize: 12 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  infoIcon: { fontSize: 20, marginTop: 2 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  infoValue: { fontSize: 15, color: Colors.text, lineHeight: 22 },
  infoSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  phoneLink: { color: Colors.primary },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  hoursLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  hoursValue: { fontSize: 13, color: Colors.text, flex: 1, textAlign: 'right' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 14 },
  mapsBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  mapsBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
