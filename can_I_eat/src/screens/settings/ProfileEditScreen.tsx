import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Radius, Shadow } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import AppText from '../../components/AppText';
import Icon from '../../components/Icon';
import { ALLERGIES, DIETARY_RESTRICTIONS, DIETARY_PREFERENCES } from '../../constants/dietary';

type Props = {
  onBack: () => void;
};

export default function ProfileEditScreen({ onBack }: Props) {
  const { dietaryProfile, updateDietaryProfile, deleteAccount } = useAuth();
  const { t } = useLanguage();

  const [allergies, setAllergies] = useState<string[]>(dietaryProfile?.allergies || []);
  const [restrictions, setRestrictions] = useState<string[]>(dietaryProfile?.restrictions || []);
  const [preferences, setPreferences] = useState<string[]>(dietaryProfile?.preferences || []);
  const [saving, setSaving] = useState(false);
  const [customAllergyInput, setCustomAllergyInput] = useState('');

  const addCustomAllergy = () => {
    const val = customAllergyInput.trim();
    if (!val) return;
    const key = `custom:${val.toLowerCase()}`;
    if (!allergies.includes(key)) setAllergies([...allergies, key]);
    setCustomAllergyInput('');
  };

  const removeCustomAllergy = (key: string) => {
    setAllergies(allergies.filter((a) => a !== key));
  };

  const toggle = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    id: string
  ) => {
    setList((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDietaryProfile({ allergies, restrictions, preferences, name: dietaryProfile?.name || '' });
      Alert.alert('✅', t.profileUpdated, [{ text: t.ok, onPress: onBack }]);
    } catch {
      Alert.alert('Error', 'Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderChip = (
    item: { id: string; label: string; emoji: string },
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    prefix: 'allergy' | 'restriction' | 'pref'
  ) => {
    const active = list.includes(item.id);
    const label = (t as any)[`${prefix}_${item.id}`] || item.label;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.chip, active && styles.chipActive]}
        onPress={() => toggle(list, setList, item.id)}
        activeOpacity={0.75}
      >
        <AppText style={styles.chipEmoji}>{item.emoji}</AppText>
        <AppText weight={active ? '700' : '600'} style={[styles.chipLabel, active && styles.chipLabelActive]}>
          {label}
        </AppText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Icon name="chevronLeft" size={22} color={Colors.text} stroke={2.4} />
        </TouchableOpacity>
        <AppText weight="800" display style={styles.title}>{t.myProfileTitle}</AppText>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Allergies */}
        <View style={styles.section}>
          <AppText weight="700" display style={styles.sectionTitle}>🤧 {t.allergiesTitle}</AppText>
          <View style={styles.chips}>
            {ALLERGIES.map((item) => renderChip(item, allergies, setAllergies, 'allergy'))}
            {allergies.filter((a) => a.startsWith('custom:')).map((key) => (
              <TouchableOpacity
                key={key}
                style={[styles.chip, styles.chipActive]}
                onPress={() => removeCustomAllergy(key)}
                activeOpacity={0.75}
              >
                <AppText style={styles.chipEmoji}>⚠️</AppText>
                <AppText weight="700" style={[styles.chipLabel, styles.chipLabelActive]}>
                  {key.replace('custom:', '')}
                </AppText>
                <AppText style={styles.chipRemove}>✕</AppText>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.customInputRow}>
            <TextInput
              style={styles.customInput}
              placeholder={t.customAllergyPlaceholder}
              placeholderTextColor={Colors.textLight}
              value={customAllergyInput}
              onChangeText={setCustomAllergyInput}
              onSubmitEditing={addCustomAllergy}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.customAddBtn} onPress={addCustomAllergy} activeOpacity={0.85}>
              <AppText weight="700" style={styles.customAddBtnText}>{t.customAllergyAdd}</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Restrictions */}
        <View style={styles.section}>
          <AppText weight="700" display style={styles.sectionTitle}>⚠️ {t.restrictionsTitle}</AppText>
          <View style={styles.chips}>
            {DIETARY_RESTRICTIONS.map((item) => renderChip(item, restrictions, setRestrictions, 'restriction'))}
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <AppText weight="700" display style={styles.sectionTitle}>🥗 {t.preferencesTitle}</AppText>
          <View style={styles.chips}>
            {DIETARY_PREFERENCES.map((item) => renderChip(item, preferences, setPreferences, 'pref'))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <AppText weight="800" style={styles.saveBtnText}>{t.saveChanges}</AppText>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deactivateBtn}
          onPress={() => {
            Alert.alert(t.deactivateTitle, t.deactivateMsg, [
              { text: t.cancel, style: 'cancel' },
              {
                text: t.deleteEverything,
                style: 'destructive',
                onPress: () => {
                  Alert.alert(t.deactivateConfirmTitle, t.deactivateConfirmMsg, [
                    { text: t.cancel, style: 'cancel' },
                    {
                      text: t.yesDeleteAccount,
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await deleteAccount();
                        } catch (err: any) {
                          if (err.code === 'auth/requires-recent-login') {
                            Alert.alert(t.reloginRequired, t.reloginMsg);
                          } else {
                            Alert.alert(t.analysisFailedTitle, 'Could not delete account. Please try again.');
                          }
                        }
                      },
                    },
                  ]);
                },
              },
            ]);
          }}
          activeOpacity={0.8}
        >
          <AppText weight="600" style={styles.deactivateBtnText}>{t.deactivateAccount}</AppText>
        </TouchableOpacity>
      </View>
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
  title: { fontSize: 22, color: Colors.text },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 16, color: Colors.text, marginBottom: 14 },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: Radius.pill,
    borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
  },
  chipActive: { borderColor: Colors.brand, backgroundColor: Colors.brandSoft },
  chipEmoji: { fontSize: 15 },
  chipLabel: { fontSize: 13, color: Colors.textSecondary },
  chipLabelActive: { color: Colors.brand },
  chipRemove: { fontSize: 11, color: Colors.brand, marginLeft: 2 },

  customInputRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  customInput: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.xs,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14, color: Colors.text,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  customAddBtn: {
    backgroundColor: Colors.brand,
    borderRadius: Radius.xs,
    paddingHorizontal: 16, paddingVertical: 10,
    justifyContent: 'center',
  },
  customAddBtnText: { color: '#fff', fontSize: 14 },

  footer: {
    padding: 20, paddingBottom: 36,
    backgroundColor: Colors.surface,
    borderTopWidth: 1, borderTopColor: Colors.surfaceAlt,
  },
  saveBtn: {
    backgroundColor: Colors.brand,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    ...Shadow.brand,
  },
  saveBtnDisabled: { opacity: 0.6, shadowOpacity: 0 },
  saveBtnText: { color: '#fff', fontSize: 16 },
  deactivateBtn: {
    borderRadius: Radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.unsafe,
  },
  deactivateBtnText: { color: Colors.unsafe, fontSize: 14 },
});
