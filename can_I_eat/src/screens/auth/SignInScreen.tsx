import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppText from '../../components/AppText';
import { Colors } from '../../constants/colors';
import { Radius, Shadow } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const REMEMBERED_EMAIL_KEY = 'remembered_email';

type Props = {
  onSignUp: () => void;
};

export default function SignInScreen({ onSignUp }: Props) {
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load remembered email on mount
  useEffect(() => {
    AsyncStorage.getItem(REMEMBERED_EMAIL_KEY).then((saved) => {
      if (saved) {
        setEmail(saved);
        setRememberMe(true);
      }
    });
  }, []);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t.authMissingInfoTitle, t.authMissingInfoMsgSignIn);
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      // Save or clear remembered email
      if (rememberMe) {
        await AsyncStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim());
      } else {
        await AsyncStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }
    } catch {
      Alert.alert(t.authSignInFailedTitle, t.authSignInFailedMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <Image
          source={require('../../../assets/logo_3.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <AppText weight="400" style={styles.tagline}>{t.authTagline}</AppText>

        {/* Sign In / Sign Up tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity style={styles.tabActive}>
            <AppText weight="700" style={styles.tabTextActive}>{t.authSignInTab}</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabInactive} onPress={onSignUp}>
            <AppText weight="500" style={styles.tabTextInactive}>{t.authSignUpTab}</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <AppText weight="500" style={styles.label}>{t.authEmailLabel}</AppText>
          <TextInput
            style={styles.input}
            placeholder={t.authEmailPlaceholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={Colors.textLight}
          />

          <AppText weight="500" style={styles.label}>{t.authPasswordLabel}</AppText>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder={t.authPasswordPlaceholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor={Colors.textLight}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
            >
              <AppText style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</AppText>
            </TouchableOpacity>
          </View>

          {/* Remember Me row */}
          <View style={styles.rememberRow}>
            <TouchableOpacity
              style={styles.rememberLeft}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && <AppText style={styles.checkmark}>✓</AppText>}
              </View>
              <AppText weight="500" style={styles.rememberText}>{t.authRememberMe}</AppText>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleSignIn} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <AppText weight="700" style={styles.btnText}>{t.authLoginButton}</AppText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 28, alignItems: 'center', paddingBottom: 48 },
  logo: { width: 160, height: 160, marginTop: 40, marginBottom: 4 },
  tagline: { fontSize: 14, color: Colors.textSecondary, marginBottom: 32 },
  tabRow: {
    flexDirection: 'row',
    borderRadius: Radius.pill,
    overflow: 'hidden',
    marginBottom: 32,
    backgroundColor: Colors.surfaceAlt,
    padding: 4,
    gap: 4,
    width: '100%',
  },
  tabActive: {
    flex: 1,
    backgroundColor: Colors.brand,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: Radius.pill,
    ...Shadow.brand,
  },
  tabInactive: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: Radius.pill,
  },
  tabTextActive: { color: '#fff', fontSize: 15 },
  tabTextInactive: { color: Colors.textSecondary, fontSize: 15 },
  form: { width: '100%', gap: 4, marginBottom: 24 },
  label: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4, marginTop: 12 },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xs,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 4,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: {
    padding: 14,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xs,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  eyeIcon: { fontSize: 18 },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  rememberLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  checkmark: { color: '#fff', fontSize: 12 },
  rememberText: { fontSize: 13, color: Colors.textSecondary },
  forgotText: { fontSize: 13, color: Colors.brand },
  btn: {
    backgroundColor: Colors.brand,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    ...Shadow.brand,
  },
  btnText: { color: '#fff', fontSize: 16 },
});
