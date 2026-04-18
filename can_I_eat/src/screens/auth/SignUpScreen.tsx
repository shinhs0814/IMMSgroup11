import React, { useState } from 'react';
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
import AppText from '../../components/AppText';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

type Props = {
  onSignIn: () => void;
};

export default function SignUpScreen({ onSignIn }: Props) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email.trim(), password, name.trim());
    } catch (e: any) {
      Alert.alert('Sign Up Failed', e.message || 'Something went wrong.');
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
        <AppText weight="400" style={styles.tagline}>Know before you eat</AppText>

        {/* Sign In / Sign Up tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity style={styles.tabInactive} onPress={onSignIn}>
            <AppText weight="500" style={styles.tabTextInactive}>Sign In</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabActive}>
            <AppText weight="700" style={styles.tabTextActive}>Sign Up</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <AppText weight="500" style={styles.label}>Your Name</AppText>
          <TextInput
            style={styles.input}
            placeholder="e.g. Anna"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            placeholderTextColor={Colors.textLight}
          />

          <AppText weight="500" style={styles.label}>E-mail address</AppText>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={Colors.textLight}
          />

          <AppText weight="500" style={styles.label}>Password</AppText>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="At least 6 characters"
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
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleSignUp} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <AppText weight="700" style={styles.btnText}>Create Account</AppText>
          )}
        </TouchableOpacity>

        <AppText style={styles.legalNote}>
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </AppText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 28, alignItems: 'center', paddingBottom: 48 },
  logo: { width: 160, height: 160, marginTop: 40, marginBottom: 4 },
  tagline: { fontSize: 14, color: Colors.textSecondary, marginBottom: 32 },
  tabRow: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
  },
  tabActive: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabInactive: {
    flex: 1,
    backgroundColor: Colors.card,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabTextActive: { color: '#fff', fontSize: 15 },
  tabTextInactive: { color: Colors.textSecondary, fontSize: 15 },
  form: { width: '100%', gap: 4, marginBottom: 24 },
  label: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4, marginTop: 12 },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 4,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: {
    padding: 14,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  eyeIcon: { fontSize: 18 },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: '#fff', fontSize: 16 },
  legalNote: {
    marginTop: 16,
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
});
