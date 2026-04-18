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
        <AppText weight="800" style={styles.title}>{t.surveyTitle}</AppText>
        <View style={styles.stepRow}>
          {STEPS.map((s, i) => (
            <View key={s} style={styles.stepItem}>
              <View style={[styles.stepDot, i <= step && styles.stepDotActive]}>
                <AppText weight="700" style={[styles.stepNum, i <= step && styles.stepNumActive]}>
                  {i < step ? '✓' : `${i + 1}`}
                </AppText>
              </View>
              <AppText style={[styles.stepLabel, i === step && styles.stepLabelActive]}>{s}</AppText>
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {step === 0 && (
          <>
            <AppText weight="700" style={styles.sectionTitle}>{t.surveyQ1}</AppText>
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
            <AppText weight="700" style={styles.sectionTitle}>{t.surveyQ2}</AppText>
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
            <AppText weight="700" style={styles.sectionTitle}>{t.surveyQ3}</AppText>
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
                      <AppText weight="600" style={[styles.prefLabel, selected && styles.prefLabelSelected]}>{label}</AppText>
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
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(step - 1)}>
            <AppText weight="600" style={styles.backBtnText}>{t.back}</AppText>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, step === 0 && { flex: 1 }]}
          onPress={handleNext}
          disabled={saving}
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
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  title: { fontSize: 26, color: Colors.text, lineHeight: 34, marginBottom: 20 },
  stepRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: { backgroundColor: Colors.primary },
  stepNum: { fontSize: 13, color: Colors.textSecondary },
  stepNumActive: { color: '#fff' },
  stepLabel: { fontSize: 11, color: Colors.textSecondary },
  stepLabelActive: { color: Colors.primary },
  body: { flex: 1 },
  bodyContent: { padding: 24, paddingBottom: 32 },
  sectionTitle: { fontSize: 20, color: Colors.text, marginBottom: 6 },
  sectionSubtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryBg },
  chipCustom: { borderStyle: 'dashed' },
  chipEmoji: { fontSize: 16 },
  chipLabel: { fontSize: 13, color: Colors.text },
  chipLabelSelected: { color: Colors.primary },
  chipRemove: { fontSize: 11, color: Colors.primary, marginLeft: 2 },
  customInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  customInput: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  customAddBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  customAddBtnText: { color: '#fff', fontSize: 14 },
  prefList: { gap: 12 },
  prefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  prefCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryBg },
  prefEmoji: { fontSize: 28 },
  prefText: { flex: 1 },
  prefLabel: { fontSize: 16, color: Colors.text },
  prefLabelSelected: { color: Colors.primary },
  prefDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: { borderColor: Colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  footer: { flexDirection: 'row', gap: 12, padding: 20, paddingBottom: 36 },
  backBtn: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backBtnText: { color: Colors.textSecondary, fontSize: 15 },
  nextBtn: { flex: 2, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  nextBtnText: { color: '#fff', fontSize: 16 },
});
