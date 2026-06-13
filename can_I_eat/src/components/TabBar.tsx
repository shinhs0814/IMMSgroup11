/**
 * Floating pill tab bar — Sunny design.
 * Home · Scan (FAB) · Search
 * FAB floats above the bar outside the clipped region.
 */
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import AppText from './AppText';
import Icon from './Icon';
import { Colors } from '../constants/colors';
import { Radius, Shadow } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

type Tab = 'home' | 'search';

type Props = {
  active: Tab;
  onHome: () => void;
  onScan: () => void;
  onSearch: () => void;
};

function TabItem({ icon, label, active, onPress }: {
  icon: 'home' | 'search'; label: string; active: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <Icon name={icon} size={24} color={active ? Colors.brand : Colors.textSecondary} stroke={active ? 2.6 : 2.2} />
      <AppText weight={active ? '800' : '600'} style={[styles.label, { color: active ? Colors.brand : Colors.textSecondary }]}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
}

export default function TabBar({ active, onHome, onScan, onSearch }: Props) {
  const { t } = useLanguage();
  // Row with a spacer in the middle for the FAB
  const row = (
    <View style={styles.row}>
      <TabItem icon="home" label={t.home} active={active === 'home'} onPress={onHome} />
      <View style={styles.fabSpacer} />
      <TabItem icon="search" label={t.search} active={active === 'search'} onPress={onSearch} />
    </View>
  );

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {/* Bar (clipped to rounded rect) */}
      {Platform.OS === 'ios' ? (
        <BlurView intensity={60} tint="light" style={styles.bar}>
          {row}
        </BlurView>
      ) : (
        <View style={[styles.bar, styles.barSolid]}>
          {row}
        </View>
      )}

      {/* FAB floats above the bar, outside the clipped bar view */}
      <TouchableOpacity style={styles.fab} onPress={onScan} activeOpacity={0.85}>
        <Icon name="scan" size={28} color="#fff" stroke={2.4} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingBottom: 26,
    alignItems: 'center',
    pointerEvents: 'box-none',
  } as any,

  bar: {
    width: '100%',
    borderRadius: Radius.card,
    overflow: 'hidden',
    ...Shadow.card,
  },
  barSolid: {
    backgroundColor: 'rgba(255,255,255,0.97)',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 12,
  },

  item: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  label: {
    fontSize: 11,
  },

  // Spacer keeps the center of the row open for the FAB
  fabSpacer: {
    width: 64,
  },

  // FAB is absolutely positioned above the bar center
  fab: {
    position: 'absolute',
    bottom: 38,   // lifts above the bar (26 paddingBottom + ~12 overlap)
    width: 60,
    height: 60,
    borderRadius: Radius.pill,
    backgroundColor: Colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...Shadow.brand,
  },
});
