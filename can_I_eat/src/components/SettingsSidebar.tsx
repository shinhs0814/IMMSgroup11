import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, verdictColors } from '../constants/colors';
import { Radius, Shadow } from '../constants/theme';
import AppText from './AppText';
import Icon from './Icon';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AppLanguage, LANGUAGE_LABELS } from '../constants/translations';
import { ALLERGIES, DIETARY_RESTRICTIONS, DIETARY_PREFERENCES } from '../constants/dietary';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.87;

type Props = {
  visible: boolean;
  onClose: () => void;
  onMyProfile: () => void;
  onQRPassport?: () => void;
  onFamilyProfiles?: () => void;
};

export default function SettingsSidebar({ visible, onClose, onMyProfile, onQRPassport, onFamilyProfiles }: Props) {
  const { user, activeProfile, logOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mountedRef = useRef(false);

  useEffect(() => {
    if (visible) {
      mountedRef.current = true;
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SIDEBAR_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible && !mountedRef.current) return null;

  const handleSignOut = () => {
    onClose();
    setTimeout(() => {
      Alert.alert(t.signOut, '', [
        { text: t.cancel, style: 'cancel' },
        { text: t.signOut, style: 'destructive', onPress: logOut },
      ]);
    }, 300);
  };

  const languages: AppLanguage[] = ['en', 'ko', 'es', 'fr', 'ja'];

  // Build diet chips from active profile
  const getDietChips = () => {
    if (!activeProfile) return [];
    const chips: Array<{ emoji: string; label: string; type: string }> = [];
    (activeProfile.allergies || []).forEach((id: string) => {
      if (id.startsWith('custom:')) {
        chips.push({ emoji: '⚠️', label: id.replace('custom:', ''), type: 'allergy' });
      } else {
        const a = ALLERGIES.find((x) => x.id === id);
        if (a) chips.push({ emoji: a.emoji, label: a.label, type: 'allergy' });
      }
    });
    (activeProfile.restrictions || []).forEach((id: string) => {
      const r = DIETARY_RESTRICTIONS.find((x) => x.id === id);
      if (r) chips.push({ emoji: r.emoji, label: r.label, type: 'restriction' });
    });
    (activeProfile.preferences || []).forEach((id: string) => {
      const p = DIETARY_PREFERENCES.find((x) => x.id === id);
      if (p) chips.push({ emoji: p.emoji, label: p.label, type: 'pref' });
    });
    return chips;
  };

  const sectionTitle = (text: string) => (
    <AppText weight="700" display style={styles.sectionLabel}>{text}</AppText>
  );

  const unsafeVc = verdictColors('unsafe')!;
  const dietChips = getDietChips();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'box-none' : 'none'}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* Sidebar panel */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        {/* Gradient header */}
        <LinearGradient
          colors={['#EC6A56', '#F2856F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Icon name="x" size={20} color="#fff" stroke={2.2} />
          </TouchableOpacity>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <AppText weight="800" display style={styles.avatarText}>
                {user?.displayName?.charAt(0).toUpperCase() || '?'}
              </AppText>
            </View>
            <View style={styles.userInfo}>
              <AppText weight="800" display style={styles.userName}>{user?.displayName || ''}</AppText>
              <AppText style={styles.userEmail} numberOfLines={1}>{user?.email || ''}</AppText>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => { onClose(); setTimeout(onMyProfile, 280); }}
            activeOpacity={0.85}
          >
            <AppText weight="800" style={styles.editProfileText}>{t.editProfile}</AppText>
          </TouchableOpacity>
        </LinearGradient>

        {/* Scrollable body */}
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>

          {/* Dietary profile */}
          {sectionTitle(t.myDietaryProfile)}
          <View style={styles.dietCard}>
            {dietChips.length > 0 ? (
              <View style={styles.chipRow}>
                {dietChips.map((chip, i) => (
                  <View key={i} style={styles.dietChip}>
                    <AppText weight="700" style={styles.dietChipText}>{chip.emoji} {chip.label}</AppText>
                  </View>
                ))}
                <TouchableOpacity style={styles.addChipBtn}>
                  <Icon name="plus" size={14} color={Colors.brand} stroke={2.6} />
                  <AppText weight="800" style={styles.addChipText}>{t.add}</AppText>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.chipRow}>
                <AppText style={styles.noDietText}>{t.noDietProfile}</AppText>
                <TouchableOpacity style={styles.addChipBtn} onPress={() => { onClose(); setTimeout(onMyProfile, 280); }}>
                  <Icon name="plus" size={14} color={Colors.brand} stroke={2.6} />
                  <AppText weight="800" style={styles.addChipText}>{t.setUp}</AppText>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* QR passport */}
          {sectionTitle(t.foodPassport)}
          {onQRPassport && (
            <TouchableOpacity style={styles.passportCard} onPress={onQRPassport} activeOpacity={0.88}>
              <View style={styles.passportQRBox}>
                <Icon name="scan" size={22} color="#2F6B57" stroke={2} />
              </View>
              <View style={styles.passportInfo}>
                <AppText weight="800" display style={styles.passportTitle}>{t.myFoodPassport}</AppText>
                <AppText style={styles.passportSub}>{t.passportSub}</AppText>
              </View>
              <Icon name="chevronRight" size={19} color="rgba(255,255,255,0.85)" stroke={2} />
            </TouchableOpacity>
          )}

          {/* Family */}
          {onFamilyProfiles && (
            <>
              {sectionTitle(t.family)}
              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => { onClose(); setTimeout(onFamilyProfiles!, 280); }}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconBox}>
                  <Icon name="users" size={18} color={Colors.brand} stroke={2} />
                </View>
                <AppText weight="600" style={styles.menuText}>{t.familyProfiles}</AppText>
                <Icon name="chevronRight" size={17} color={Colors.textSecondary} stroke={2} />
              </TouchableOpacity>
            </>
          )}

          {/* Language */}
          {sectionTitle(`🌐 ${t.language}`)}
          <View style={styles.langGrid}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.langBtn, language === lang && styles.langBtnActive]}
                onPress={() => setLanguage(lang)}
                activeOpacity={0.7}
              >
                <AppText weight={language === lang ? '800' : '600'} style={[styles.langBtnText, language === lang && styles.langBtnTextActive]}>
                  {LANGUAGE_LABELS[lang]}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sign out */}
          <TouchableOpacity
            style={[styles.signOutBtn, { borderColor: unsafeVc.ring, backgroundColor: unsafeVc.soft }]}
            onPress={handleSignOut}
            activeOpacity={0.85}
          >
            <AppText weight="800" style={[styles.signOutText, { color: unsafeVc.fg }]}>{t.signOut}</AppText>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(40,25,20,0.45)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: Colors.bg,
    ...Shadow.card,
    flexDirection: 'column',
  },

  // Header
  header: {
    paddingTop: 58,
    paddingHorizontal: 22,
    paddingBottom: 22,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 56,
    right: 18,
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: Radius.pill,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  avatarText: { color: Colors.brand, fontSize: 28 },
  userInfo: { flex: 1, minWidth: 0 },
  userName: { fontSize: 22, color: '#fff' },
  userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  editProfileBtn: {
    marginTop: 16,
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: Radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  editProfileText: { color: Colors.brand, fontSize: 13.5 },

  // Body
  body: { flex: 1 },
  bodyContent: { padding: 20, paddingBottom: 40, gap: 0 },

  sectionLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 2,
  },

  // Diet card
  dietCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.sm,
    padding: 14,
    ...Shadow.soft,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  dietChip: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  dietChipText: { fontSize: 13, color: Colors.text },
  addChipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.brandSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  addChipText: { color: Colors.brand, fontSize: 13 },
  noDietText: { fontSize: 13, color: Colors.textSecondary, flex: 1 },

  // Passport card
  passportCard: {
    borderRadius: Radius.sm,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#2F6B57',
    ...Shadow.soft,
  },
  passportQRBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.xs,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  passportInfo: { flex: 1, minWidth: 0 },
  passportTitle: { fontSize: 17, color: '#fff' },
  passportSub: { fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 3, lineHeight: 17 },

  // Menu row
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.sm,
    paddingVertical: 13,
    paddingHorizontal: 14,
    gap: 12,
    ...Shadow.soft,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.xs,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: { flex: 1, fontSize: 15, color: Colors.text },

  // Language
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.surfaceAlt,
    backgroundColor: Colors.surface,
  },
  langBtnActive: { borderColor: Colors.brand, backgroundColor: Colors.brandSoft },
  langBtnText: { fontSize: 14, color: Colors.textSecondary },
  langBtnTextActive: { color: Colors.brand },

  // Sign out
  signOutBtn: {
    marginTop: 22,
    padding: 14,
    borderRadius: Radius.sm,
    borderWidth: 1.6,
    alignItems: 'center',
  },
  signOutText: { fontSize: 14.5 },
});
