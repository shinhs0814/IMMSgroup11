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
import { Radius, Shadow } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import AppText from '../../components/AppText';
import Icon from '../../components/Icon';
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
    restaurant.vegetarian && { label: t.restaurantFilterVegetarian, color: '#1BB377', emoji: '🥗' },
    restaurant.halal && { label: t.restaurantFilterHalal, color: '#2A8DD4', emoji: '🌙' },
    restaurant.glutenFree && { label: t.restaurantFilterGlutenFree, color: '#F0A019', emoji: '🌾' },
  ].filter(Boolean) as { label: string; color: string; emoji: string }[];

  const isInfoAvailable = (val: string) =>
    val && val.trim() !== '' && val.trim() !== '정보없음';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Icon name="chevronLeft" size={22} color={Colors.text} stroke={2.4} />
        </TouchableOpacity>
        <AppText weight="700" display style={styles.headerTitle} numberOfLines={1}>
          {restaurant.name}
        </AppText>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.emojiTile}>
              <Text style={{ fontSize: 32 }}>{(restaurant as any).emoji || '🍽️'}</Text>
            </View>
            <View style={styles.heroInfo}>
              <AppText weight="800" display style={styles.restaurantName}>{restaurant.name}</AppText>
              <View style={styles.metaRow}>
                {restaurant.category ? (
                  <AppText weight="700" style={styles.category}>{restaurant.category}</AppText>
                ) : null}
                {(restaurant as any).rating ? (
                  <AppText weight="800" display style={styles.rating}>★ {(restaurant as any).rating}</AppText>
                ) : null}
              </View>
            </View>
          </View>
          {badges.length > 0 && (
            <View style={styles.badges}>
              {badges.map((b) => (
                <View key={b.label} style={[styles.badge, { backgroundColor: b.color + '1A' }]}>
                  <Text style={{ fontSize: 12 }}>{b.emoji}</Text>
                  <AppText weight="700" style={[styles.badgeText, { color: b.color }]}>{b.label}</AppText>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Icon name="home" size={20} color={Colors.brand} stroke={2} />
            </View>
            <View style={styles.infoContent}>
              <AppText weight="800" style={styles.infoLabel}>{t.restaurantAddress}</AppText>
              <AppText weight="700" style={styles.infoValue}>
                {isInfoAvailable(restaurant.address) ? restaurant.address : t.restaurantInfoNotAvailable}
              </AppText>
              {isInfoAvailable(restaurant.district) && (
                <AppText style={styles.infoSub}>{restaurant.district}</AppText>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Icon name="clock" size={20} color={Colors.brand} stroke={2} />
            </View>
            <View style={styles.infoContent}>
              <AppText weight="800" style={styles.infoLabel}>{t.restaurantHours}</AppText>
              <View style={styles.hoursRow}>
                <AppText style={styles.hoursLabel}>{t.restaurantWeekdays}</AppText>
                <AppText weight="700" style={styles.hoursValue}>
                  {isInfoAvailable(restaurant.weekdayHours) ? restaurant.weekdayHours : t.restaurantInfoNotAvailable}
                </AppText>
              </View>
              <View style={styles.hoursRow}>
                <AppText style={styles.hoursLabel}>{t.restaurantWeekends}</AppText>
                <AppText weight="700" style={styles.hoursValue}>
                  {isInfoAvailable(restaurant.weekendHours) ? restaurant.weekendHours : t.restaurantInfoNotAvailable}
                </AppText>
              </View>
            </View>
          </View>

          {isInfoAvailable(restaurant.phone) && (
            <>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.infoRow} onPress={callPhone} activeOpacity={0.7}>
                <View style={styles.iconBox}>
                  <Icon name="bell" size={20} color={Colors.brand} stroke={2} />
                </View>
                <View style={styles.infoContent}>
                  <AppText weight="800" style={styles.infoLabel}>{t.restaurantPhone}</AppText>
                  <AppText weight="700" style={[styles.infoValue, styles.phoneLink]}>{restaurant.phone}</AppText>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Directions button */}
        {isInfoAvailable(restaurant.address) && (
          <TouchableOpacity style={styles.mapsBtn} onPress={openMaps} activeOpacity={0.85}>
            <Icon name="mapPin" size={19} color="#fff" stroke={2.2} />
            <AppText weight="800" style={styles.mapsBtnText}>{t.restaurantDirections}</AppText>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 18,
    gap: 12,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: Radius.card,
    borderBottomRightRadius: Radius.card,
    ...Shadow.soft,
  },
  backBtn: {
    width: 42, height: 42, borderRadius: Radius.pill,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  headerTitle: { flex: 1, fontSize: 19, color: Colors.text },

  scroll: { padding: 20, paddingBottom: 60 },

  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: 20,
    marginBottom: 14,
    ...Shadow.soft,
  },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  emojiTile: {
    width: 60, height: 60, borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  heroInfo: { flex: 1, minWidth: 0 },
  restaurantName: { fontSize: 21, color: Colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 3 },
  category: { fontSize: 13, color: Colors.brand },
  rating: { fontSize: 13, color: Colors.text },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 11, paddingVertical: 6, borderRadius: Radius.pill,
  },
  badgeText: { fontSize: 12.5 },

  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: 18,
    marginBottom: 16,
    gap: 16,
    ...Shadow.soft,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 13 },
  iconBox: {
    width: 38, height: 38, borderRadius: Radius.xs,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  infoContent: { flex: 1 },
  infoLabel: {
    fontSize: 11, color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3,
  },
  infoValue: { fontSize: 14.5, color: Colors.text, lineHeight: 21 },
  infoSub: { fontSize: 12.5, color: Colors.textSecondary, marginTop: 2 },
  phoneLink: { color: Colors.brand },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  hoursLabel: { fontSize: 13, color: Colors.textSecondary },
  hoursValue: { fontSize: 13, color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.surfaceAlt },

  mapsBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.brand,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    ...Shadow.brand,
  },
  mapsBtnText: { color: '#fff', fontSize: 15.5 },
});
