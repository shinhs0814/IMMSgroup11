import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AppText from '../../components/AppText';
import { Colors } from '../../constants/colors';
import { Radius, Shadow } from '../../constants/theme';
import { ALLERGIES, DIETARY_RESTRICTIONS, DIETARY_PREFERENCES } from '../../constants/dietary';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function SurveyScreen() {
  const { user, updateDietaryProfile } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState(0);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [customAllergyInput, setCustomAllergyInput] = useState('');
  const [saving, setSaving] = useState(false);

  const STEPS = [t.surveyStep1, t.surveyStep2, t.surveyStep3];

  const toggle = (id: string, list: string[], setList: (v: string[]) => void, exclusive?: boolean) => {
    if (exclusive) {
      setList([id]);
    } else {
      setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
    }
  };

  const addCustomAllergy = () => {
    const val = customAllergyInput.trim();
    if (!val) return;
    const key = `custom:${val.toLowerCase()}`;
    if (!selectedAllergies.includes(key)) {
      setSelectedAllergies([...selectedAllergies, key]);
    }
    setCustomAllergyInput('');
  };

  const removeCustomAllergy = (key: string) => {
    setSelectedAllergies(selectedAllergies.filter((a) => a !== key));
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await updateDietaryProfile({
        name: user?.displayName || '',
        allergies: selectedAllergies,
        restrictions: selectedRestrictions,
        preferences: selectedPreferences,
      });
    } catch {
      Alert.alert('Error', 'Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const customAllergies = selectedAllergies.filter((a) => a.startsWith('custom:'));
  const standardAllergies = selectedAllergies.filter((a) => !a.startsWith('custom:'));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText weight="800" display style={styles.title}>{t.surveyTitle}</AppText>
        <View style={styles.stepRow}>
          {STEPS.map((s, i) => (
            <View key={s} style={styles.stepItem}>
              <View style={[styles.stepBar, (i <= step) && styles.stepBarActive]} />
              <AppText weight={i === step ? '700' : '600'} style={[styles.stepLabel, i === step && styles.stepLabelActive]}>{s}</AppText>
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {step === 0 && (
          <>
            <AppText weight="700" display style={styles.sectionTitle}>{t.surveyQ1}</AppText>
            <AppText style={styles.sectionSubtitle}>{t.selectAllApply}</AppText>
            <View style={styles.grid}>
              {ALLERGIES.map((item) => {
                const selected = standardAllergies.includes(item.id);
                const label = (t as any)[`allergy_${item.id}`] || item.label;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => toggle(item.id, selectedAllergies, setSelectedAllergies)}
                  >
                    <AppText style={styles.chipEmoji}>{item.emoji}</AppText>
                    <AppText weight={selected ? '600' : '500'} style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                      {label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
              {/* Custom allergy chips */}
              {customAllergies.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.chip, styles.chipSelected, styles.chipCustom]}
                  onPress={() => removeCustomAllergy(key)}
                >
                  <AppText style={styles.chipEmoji}>⚠️</AppText>
                  <AppText weight="600" style={[styles.chipLabel, styles.chipLabelSelected]}>
                    {key.replace('custom:', '')}
                  </AppText>
                  <AppText style={styles.chipRemove}>✕</AppText>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom allergy input */}
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
              <TouchableOpacity style={styles.customAddBtn} onPress={addCustomAllergy}>
                <AppText weight="700" style={styles.customAddBtnText}>{t.customAllergyAdd}</AppText>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === 1 && (
          <>
            <AppText weight="700" display style={styles.sectionTitle}>{t.surveyQ2}</AppText>
            <AppText style={styles.sectionSubtitle}>{t.selectAllApply}</AppText>
            <View style={styles.grid}>
              {DIETARY_RESTRICTIONS.map((item) => {
                const selected = selectedRestrictions.includes(item.id);
                const label = (t as any)[`restriction_${item.id}`] || item.label;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => toggle(item.id, selectedRestrictions, setSelectedRestrictions)}
                  >
                    <AppText style={styles.chipEmoji}>{item.emoji}</AppText>
                    <AppText weight={selected ? '600' : '500'} style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                      {label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <AppText weight="700" display style={styles.sectionTitle}>{t.surveyQ3}</AppText>
            <AppText style={styles.sectionSubtitle}>{t.selectOne}</AppText>
            <View style={styles.prefList}>
              {DIETARY_PREFERENCES.map((item) => {
                const selected = selectedPreferences.includes(item.id);
                const label = (t as any)[`pref_${item.id}`] || item.label;
                const desc = (t as any)[`pref_${item.id}_desc`] || item.description;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.prefCard, selected && styles.prefCardSelected]}
                    onPress={() => toggle(item.id, selectedPreferences, setSelectedPreferences, true)}
                  >
                    <AppText style={styles.prefEmoji}>{item.emoji}</AppText>
                    <View style={styles.prefText}>
                      <AppText weight="600" display style={[styles.prefLabel, selected && styles.prefLabelSelected]}>{label}</AppText>
                      <AppText style={styles.prefDesc}>{desc}</AppText>
                    </View>
                    <View style={[styles.radio, selected && styles.radioSelected]}>
                      {selected && <View style={styles.radioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(step - 1)} activeOpacity={0.7}>
            <AppText weight="700" style={styles.backBtnText}>{t.back}</AppText>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, step === 0 && { flex: 1 }]}
          onPress={handleNext}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <AppText weight="700" style={styles.nextBtnText}>
              {step === STEPS.length - 1 ? t.letsGo : t.next}
            </AppText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 22,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: Radius.card,
    borderBottomRightRadius: Radius.card,
    ...Shadow.soft,
  },
  title: { fontSize: 24, color: Colors.text, lineHeight: 32, marginBottom: 18 },

  // Wide progress bars
  stepRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  stepItem: { flex: 1, gap: 5 },
  stepBar: { width: '100%', height: 6, borderRadius: Radius.pill, backgroundColor: Colors.surfaceAlt },
  stepBarActive: { backgroundColor: Colors.brand },
  stepLabel: { fontSize: 11.5, color: Colors.textSecondary, textAlign: 'center' },
  stepLabelActive: { color: Colors.brand },

  body: { flex: 1 },
  bodyContent: { padding: 22, paddingBottom: 32 },
  sectionTitle: { fontSize: 19, color: Colors.text, marginBottom: 5 },
  sectionSubtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 18 },

  // Chip grid (allergies/restrictions)
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: 16 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.surfaceAlt,
  },
  chipSelected: { borderColor: Colors.brand, backgroundColor: Colors.brandSoft },
  chipCustom: { borderStyle: 'dashed' },
  chipEmoji: { fontSize: 15 },
  chipLabel: { fontSize: 13.5, color: Colors.text },
  chipLabelSelected: { color: Colors.brand },
  chipRemove: { fontSize: 11, color: Colors.brand, marginLeft: 2 },

  customInputRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  customInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xs,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14.5,
    color: Colors.text,
    ...Shadow.soft,
  },
  customAddBtn: {
    backgroundColor: Colors.brand,
    borderRadius: Radius.xs,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: 'center',
    ...Shadow.brand,
  },
  customAddBtnText: { color: '#fff', fontSize: 14 },

  // Preference cards (step 3)
  prefList: { gap: 12 },
  prefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 14,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.surfaceAlt,
  },
  prefCardSelected: { borderColor: Colors.brand, backgroundColor: Colors.brandSoft },
  prefEmoji: { fontSize: 26 },
  prefText: { flex: 1 },
  prefLabel: { fontSize: 15.5, color: Colors.text },
  prefLabelSelected: { color: Colors.brand },
  prefDesc: { fontSize: 12.5, color: Colors.textSecondary, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: { borderColor: Colors.brand },
  radioDot: { width: 10, height: 10, borderRadius: Radius.pill, backgroundColor: Colors.brand },

  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingBottom: 36,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceAlt,
  },
  backBtn: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  backBtnText: { color: Colors.textSecondary, fontSize: 15 },
  nextBtn: {
    flex: 2,
    backgroundColor: Colors.brand,
    borderRadius: Radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
    ...Shadow.brand,
  },
  nextBtnText: { color: '#fff', fontSize: 16 },
});
