import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AppLanguage, LANGUAGE_LABELS } from '../constants/translations';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.78;

type Props = {
  visible: boolean;
  onClose: () => void;
  onMyProfile: () => void;
  onQRPassport?: () => void;
};

export default function SettingsSidebar({ visible, onClose, onMyProfile, onQRPassport }: Props) {
  const { user, logOut } = useAuth();
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

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'box-none' : 'none'}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* Sidebar panel */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        {/* User info */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.displayName || ''}</Text>
          <Text style={styles.userEmail} numberOfLines={1}>{user?.email || ''}</Text>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {/* My Profile */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onClose();
              setTimeout(onMyProfile, 280);
            }}
          >
            <Text style={styles.menuIcon}>👤</Text>
            <Text style={styles.menuText}>{t.myProfile}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          {/* QR Passport */}
          {onQRPassport && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={onQRPassport}
            >
              <Text style={styles.menuIcon}>📋</Text>
              <Text style={styles.menuText}>QR Passport</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          )}

          <View style={styles.divider} />

          {/* Language */}
          <View style={styles.langSection}>
            <View style={styles.langHeader}>
              <Text style={styles.menuIcon}>🌐</Text>
              <Text style={styles.menuText}>{t.language}</Text>
            </View>
            <View style={styles.langGrid}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[styles.langBtn, language === lang && styles.langBtnActive]}
                  onPress={() => setLanguage(lang)}
                >
                  <Text style={[styles.langBtnText, language === lang && styles.langBtnTextActive]}>
                    {LANGUAGE_LABELS[lang]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>🚪  {t.signOut}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: Colors.card,
    paddingTop: 64,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  userSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 8,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 28 },
  userName: { fontSize: 17, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  userEmail: { fontSize: 12, color: Colors.textSecondary, maxWidth: '100%' },
  menu: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  menuIcon: { fontSize: 20, marginRight: 12 },
  menuText: { flex: 1, fontSize: 16, fontWeight: '600', color: Colors.text },
  menuArrow: { fontSize: 22, color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  langSection: { paddingTop: 8 },
  langHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  langGrid: { gap: 8, paddingHorizontal: 8 },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  langBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: '#FEF0E7',
  },
  langBtnText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  langBtnTextActive: { color: Colors.primary, fontWeight: '700' },
  signOutBtn: {
    margin: 20,
    marginBottom: 48,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.unsafe,
    alignItems: 'center',
  },
  signOutText: { color: Colors.unsafe, fontWeight: '700', fontSize: 15 },
});
