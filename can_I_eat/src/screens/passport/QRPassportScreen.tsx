import React, { useRef } from 'react';
import {
  View,
  Text,
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
import {
  ALLERGIES,
  DIETARY_RESTRICTIONS,
  DIETARY_PREFERENCES,
} from '../../constants/dietary';

type Props = {
  onBack: () => void;
};

export default function QRPassportScreen({ onBack }: Props) {
  const { user, dietaryProfile } = useAuth();
  const { t } = useLanguage();
  const qrRef = useRef<any>(null);

  if (!dietaryProfile) return null;

  // Build QR payload as human-readable text in current UI language
  const qrLines: string[] = [
    `${t.authNameLabel} : ${user?.displayName || 'User'}`,
  ];
  if (allergyLabels.length > 0) {
    qrLines.push(`🚨 ${t.allergiesTitle} : ${allergyLabels.map(l => l).join(', ')}`);
  }
  if (restrictionLabels.length > 0) {
    qrLines.push(`⚠️ ${t.restrictionsTitle} : ${restrictionLabels.map(l => l).join(', ')}`);
  }
  if (preferenceLabels.length > 0) {
    qrLines.push(`🌿 ${t.preferencesTitle} : ${preferenceLabels.map(l => l).join(', ')}`);
  }
  if (hasNothing) {
    qrLines.push(`✅ ${t.safeLabel}`);
  }
  const qrPayload = qrLines.join('\n');

  // Get human-readable labels in current UI language
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

  const handleShare = async () => {
    try {
      const lines: string[] = [];
      lines.push(`🍽️ ${user?.displayName || 'User'}'s Dietary Profile`);
      lines.push('');
      if (allergyLabels.length > 0) {
        lines.push('🚨 Allergies:');
        allergyLabels.forEach((l) => lines.push(`  • ${l}`));
        lines.push('');
      }
      if (restrictionLabels.length > 0) {
        lines.push('⚠️ Dietary Restrictions:');
        restrictionLabels.forEach((l) => lines.push(`  • ${l}`));
        lines.push('');
      }
      if (preferenceLabels.length > 0) {
        lines.push('🌿 Dietary Preferences:');
        preferenceLabels.forEach((l) => lines.push(`  • ${l}`));
      }
      if (hasNothing) {
        lines.push('✅ No dietary restrictions');
      }
      lines.push('');
      lines.push('Shared via Can I Eat? 🍱');

      await Share.share({ message: lines.join('\n') });
    } catch {
      Alert.alert('Error', 'Could not share profile.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Passport</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.passportTitle}>🍱 Can I Eat?</Text>
          <Text style={styles.passportSubtitle}>Dietary Passport</Text>
          <Text style={styles.userName}>{user?.displayName || 'User'}</Text>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <QRCode
              value={qrPayload}
              size={180}
              color={Colors.text}
              backgroundColor="#FFFFFF"
              getRef={(ref) => (qrRef.current = ref)}
            />
          </View>
          <Text style={styles.qrHint}>Scan to view my dietary profile</Text>
        </View>

        {/* Dietary Info */}
        <View style={styles.infoCard}>
          {hasNothing ? (
            <View style={styles.row}>
              <Text style={styles.checkmark}>✅</Text>
              <Text style={styles.infoText}>No dietary restrictions</Text>
            </View>
          ) : (
            <>
              {allergyLabels.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🚨 Allergies</Text>
                  {allergyLabels.map((label) => (
                    <View key={label} style={styles.tagRow}>
                      <View style={[styles.tag, styles.tagDanger]}>
                        <Text style={styles.tagTextDanger}>{label}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {restrictionLabels.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>⚠️ Restrictions</Text>
                  {restrictionLabels.map((label) => (
                    <View key={label} style={styles.tagRow}>
                      <View style={[styles.tag, styles.tagWarning]}>
                        <Text style={styles.tagTextWarning}>{label}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {preferenceLabels.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🌿 Preferences</Text>
                  {preferenceLabels.map((label) => (
                    <View key={label} style={styles.tagRow}>
                      <View style={[styles.tag, styles.tagSuccess]}>
                        <Text style={styles.tagTextSuccess}>{label}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </View>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareBtnText}>📤  Share My Profile</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { width: 64 },
  backText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },

  content: { padding: 20, paddingBottom: 40 },

  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  passportTitle: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  passportSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  userName: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 20 },

  qrContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  qrHint: { fontSize: 12, color: Colors.textSecondary },

  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkmark: { fontSize: 20 },
  infoText: { fontSize: 15, color: Colors.text },

  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  tagRow: { marginBottom: 6 },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagDanger: { backgroundColor: '#FEE2E2' },
  tagWarning: { backgroundColor: '#FEF3C7' },
  tagSuccess: { backgroundColor: '#D1FAE5' },
  tagTextDanger: { color: '#DC2626', fontSize: 13, fontWeight: '600' },
  tagTextWarning: { color: '#D97706', fontSize: 13, fontWeight: '600' },
  tagTextSuccess: { color: '#059669', fontSize: 13, fontWeight: '600' },

  shareBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shareBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
