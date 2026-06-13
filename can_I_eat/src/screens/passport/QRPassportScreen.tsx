import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { Radius, Shadow } from '../../constants/theme';
import AppText from '../../components/AppText';
import Icon from '../../components/Icon';
import { ALLERGIES, DIETARY_RESTRICTIONS, DIETARY_PREFERENCES } from '../../constants/dietary';

type Props = {
  onBack: () => void;
};

export default function QRPassportScreen({ onBack }: Props) {
  const { user, dietaryProfile } = useAuth();
  const { t } = useLanguage();
  const qrRef = useRef<any>(null);

  if (!dietaryProfile) return null;

  const allergyLabels = ALLERGIES
    .filter((a) => dietaryProfile.allergies.includes(a.id))
    .map((a) => `${a.emoji} ${(t as any)[`allergy_${a.id}`] || a.label}`);

  const restrictionLabels = DIETARY_RESTRICTIONS
    .filter((r) => dietaryProfile.restrictions.includes(r.id))
    .map((r) => `${r.emoji} ${(t as any)[`restriction_${r.id}`] || r.label}`);

  const preferenceLabels = DIETARY_PREFERENCES
    .filter((p) => dietaryProfile.preferences.includes(p.id))
    .map((p) => `${p.emoji} ${(t as any)[`pref_${p.id}`] || p.label}`);

  const hasNothing = allergyLabels.length === 0 && restrictionLabels.length === 0 && preferenceLabels.length === 0;

  const qrLines: string[] = [`${t.authNameLabel} : ${user?.displayName || 'User'}`];
  if (allergyLabels.length > 0) qrLines.push(`🚨 ${t.allergiesTitle} : ${allergyLabels.join(', ')}`);
  if (restrictionLabels.length > 0) qrLines.push(`⚠️ ${t.restrictionsTitle} : ${restrictionLabels.join(', ')}`);
  if (preferenceLabels.length > 0) qrLines.push(`🌿 ${t.preferencesTitle} : ${preferenceLabels.join(', ')}`);
  if (hasNothing) qrLines.push(`✅ ${t.safeLabel}`);
  const qrPayload = qrLines.join('\n');

  const handleShare = async () => {
    try {
      const lines: string[] = [`🍽️ ${user?.displayName || 'User'}'s Dietary Profile`, ''];
      if (allergyLabels.length > 0) { lines.push('🚨 Allergies:'); allergyLabels.forEach((l) => lines.push(`  • ${l}`)); lines.push(''); }
      if (restrictionLabels.length > 0) { lines.push('⚠️ Dietary Restrictions:'); restrictionLabels.forEach((l) => lines.push(`  • ${l}`)); lines.push(''); }
      if (preferenceLabels.length > 0) { lines.push('🌿 Dietary Preferences:'); preferenceLabels.forEach((l) => lines.push(`  • ${l}`)); }
      if (hasNothing) lines.push('✅ No dietary restrictions');
      lines.push('', 'Shared via Can I Eat? 🍱');
      await Share.share({ message: lines.join('\n') });
    } catch {
      Alert.alert(t.errorTitle, t.couldNotShareProfile);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Icon name="chevronLeft" size={22} color={Colors.text} stroke={2.4} />
        </TouchableOpacity>
        <AppText weight="800" display style={styles.headerTitle}>{t.qrPassportTitle}</AppText>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Passport card */}
        <View style={styles.card}>
          <AppText weight="800" display style={styles.passportTitle}>🍱 Can I Eat?</AppText>
          <AppText weight="600" style={styles.passportSubtitle}>{t.dietaryPassport}</AppText>
          <AppText weight="700" display style={styles.userName}>{user?.displayName || 'User'}</AppText>
          <View style={styles.qrContainer}>
            <QRCode
              value={qrPayload}
              size={180}
              color={Colors.text}
              backgroundColor="#FFFFFF"
              getRef={(ref) => (qrRef.current = ref)}
            />
          </View>
          <AppText style={styles.qrHint}>{t.scanToView}</AppText>
        </View>

        {/* Dietary info */}
        <View style={styles.infoCard}>
          {hasNothing ? (
            <View style={styles.noRestrictRow}>
              <AppText style={{ fontSize: 20 }}>✅</AppText>
              <AppText weight="600" style={styles.noRestrictText}>{t.noRestrictions}</AppText>
            </View>
          ) : (
            <>
              {allergyLabels.length > 0 && (
                <View style={styles.tagSection}>
                  <AppText weight="700" display style={styles.tagSectionTitle}>🚨 {t.allergiesTitle}</AppText>
                  <View style={styles.tagRow}>
                    {allergyLabels.map((label) => (
                      <View key={label} style={styles.tagUnsafe}>
                        <AppText weight="700" style={styles.tagTextUnsafe}>{label}</AppText>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {restrictionLabels.length > 0 && (
                <View style={styles.tagSection}>
                  <AppText weight="700" display style={styles.tagSectionTitle}>⚠️ {t.restrictionsTitle}</AppText>
                  <View style={styles.tagRow}>
                    {restrictionLabels.map((label) => (
                      <View key={label} style={styles.tagCaution}>
                        <AppText weight="700" style={styles.tagTextCaution}>{label}</AppText>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {preferenceLabels.length > 0 && (
                <View style={styles.tagSection}>
                  <AppText weight="700" display style={styles.tagSectionTitle}>🌿 {t.preferencesTitle}</AppText>
                  <View style={styles.tagRow}>
                    {preferenceLabels.map((label) => (
                      <View key={label} style={styles.tagSafe}>
                        <AppText weight="700" style={styles.tagTextSafe}>{label}</AppText>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
        </View>

        {/* Share button */}
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
          <Icon name="share" size={19} color="#fff" stroke={2.2} />
          <AppText weight="800" style={styles.shareBtnText}>{t.shareMyProfile}</AppText>
        </TouchableOpacity>
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
    gap: 14,
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
  headerTitle: { fontSize: 22, color: Colors.text },

  content: { padding: 20, paddingBottom: 40 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: 24,
    alignItems: 'center',
    marginBottom: 14,
    ...Shadow.card,
  },
  passportTitle: { fontSize: 22, color: Colors.brand },
  passportSubtitle: {
    fontSize: 11, color: Colors.textSecondary,
    marginTop: 2, marginBottom: 12,
    letterSpacing: 1.5,
  },
  userName: { fontSize: 20, color: Colors.text, marginBottom: 20 },
  qrContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: Radius.sm,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: 12,
    ...Shadow.soft,
  },
  qrHint: { fontSize: 12, color: Colors.textSecondary },

  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: 20,
    marginBottom: 16,
    gap: 16,
    ...Shadow.soft,
  },
  noRestrictRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  noRestrictText: { fontSize: 15, color: Colors.text },

  tagSection: { gap: 8 },
  tagSectionTitle: { fontSize: 14, color: Colors.text },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagUnsafe: {
    backgroundColor: Colors.unsafeBg, borderRadius: Radius.pill,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  tagTextUnsafe: { fontSize: 13, color: Colors.unsafe },
  tagCaution: {
    backgroundColor: Colors.cautionBg, borderRadius: Radius.pill,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  tagTextCaution: { fontSize: 13, color: Colors.caution },
  tagSafe: {
    backgroundColor: Colors.safeBg, borderRadius: Radius.pill,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  tagTextSafe: { fontSize: 13, color: Colors.safe },

  shareBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.brand,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    ...Shadow.brand,
  },
  shareBtnText: { color: '#fff', fontSize: 16 },
});
