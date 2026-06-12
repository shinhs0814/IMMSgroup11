import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import Icon from './Icon';
import { verdictColors } from '../constants/colors';
import { Radius } from '../constants/theme';

type Verdict = 'safe' | 'caution' | 'unsafe';

const LABELS: Record<Verdict, string> = { safe: 'Safe', caution: 'Caution', unsafe: 'Avoid' };
const ICONS:  Record<Verdict, 'check' | 'alert' | 'ban'> = { safe: 'check', caution: 'alert', unsafe: 'ban' };

type Props = {
  verdict: Verdict;
  size?: 'sm' | 'md';
};

export default function StatusPill({ verdict, size = 'md' }: Props) {
  const c   = verdictColors(verdict)!;
  const sm  = size === 'sm';
  return (
    <View style={[styles.pill, { backgroundColor: c.bg, paddingVertical: sm ? 4 : 6, paddingHorizontal: sm ? 9 : 12 }]}>
      <Icon name={ICONS[verdict]} size={sm ? 13 : 15} color={c.fg} stroke={2.6} />
      <AppText weight="800" style={{ fontSize: sm ? 12 : 13.5, color: c.fg, letterSpacing: 0.1 }}>
        {LABELS[verdict]}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
});
