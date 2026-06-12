import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import AppText from '../../components/AppText';
import Icon from '../../components/Icon';
import { Colors } from '../../constants/colors';
import { Radius, Shadow } from '../../constants/theme';
import { ALLERGIES, DIETARY_RESTRICTIONS, DIETARY_PREFERENCES } from '../../constants/dietary';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FamilyMember } from '../../services/storage';

const AVATAR_OPTIONS = ['👶', '🧒', '👦', '👧', '🧑', '👨', '👩', '🧓', '👴', '👵'];

type Props = {
  onBack: () => void;
};

type EditorState = {
  mode: 'add' | 'edit';
  member?: FamilyMember;
  name: string;
  emoji: string;
  allergies: string[];
  restrictions: string[];
  preferences: string[];
  customAllergyInput: string;
};

const defaultEditor = (): EditorState => ({
  mode: 'add',
  name: '',
  emoji: '👤',
  allergies: [],
  restrictions: [],
  preferences: [],
  customAllergyInput: '',
});

export default function FamilyProfilesScreen({ onBack }: Props) {
  const { familyMembers, addFamilyMember, updateFamilyMember, removeFamilyMember, activeMemberId, setActiveMember, user } = useAuth();
  const { t } = useLanguage();

  const [showEditor, setShowEditor] = useState(false);
  const [editor, setEditor] = useState<EditorState>(defaultEditor());
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditor(defaultEditor()); setShowEditor(true); };

  const openEdit = (member: FamilyMember) => {
    setEditor({
      mode: 'edit', member,
      name: member.name, emoji: member.emoji,
      allergies: [...member.allergies],
      restrictions: [...member.restrictions],
      preferences: [...member.preferences],
      customAllergyInput: '',
    });
    setShowEditor(true);
  };

  const handleDelete = (member: FamilyMember) => {
    const doDelete = async () => { await removeFamilyMember(member.id); };
    if (Platform.OS === 'web') {
      if (window.confirm(t.deleteMemberConfirm)) doDelete();
    } else {
      Alert.alert(t.deleteMember, t.deleteMemberConfirm, [
        { text: t.cancel, style: 'cancel' },
        { text: t.delete, style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  const handleSave = async () => {
    if (!editor.name.trim()) { Alert.alert('', t.memberNameLabel + ' required'); return; }
    setSaving(true);
    try {
      if (editor.mode === 'add') {
        await addFamilyMember(editor.name.trim(), editor.emoji, editor.allergies, editor.restrictions, editor.preferences);
        Alert.alert('✅', t.memberAdded, [{ text: t.ok }]);
      } else if (editor.member) {
        await updateFamilyMember(editor.member.id, {
          name: editor.name.trim(), emoji: editor.emoji,
          allergies: editor.allergies, restrictions: editor.restrictions, preferences: editor.preferences,
        });
        Alert.alert('✅', t.memberUpdated, [{ text: t.ok }]);
      }
      setShowEditor(false);
    } catch {
      Alert.alert(t.analysisFailedTitle, 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleList = (id: string, list: string[], setter: (v: string[]) => void, exclusive?: boolean) => {
    if (exclusive) { setter([id]); }
    else { setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]); }
  };

  const addCustomAllergy = () => {
    const val = editor.customAllergyInput.trim();
    if (!val) return;
    const key = `custom:${val.toLowerCase()}`;
    if (!editor.allergies.includes(key)) {
      setEditor((e) => ({ ...e, allergies: [...e.allergies, key], customAllergyInput: '' }));
    } else {
      setEditor((e) => ({ ...e, customAllergyInput: '' }));
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Icon name="chevronLeft" size={22} color={Colors.text} stroke={2.4} />
        </TouchableOpacity>
        <AppText weight="800" display style={styles.title}>{t.familyProfilesTitle}</AppText>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <AppText style={styles.subtitle}>{t.familyProfilesSubtitle}</AppText>

        {/* Own profile card */}
        <View style={[styles.memberCard, activeMemberId === null && styles.memberCardActive]}>
          <TouchableOpacity
            style={styles.memberTouchable}
            onPress={() => setActiveMember(null)}
            activeOpacity={0.8}
          >
            <AppText style={styles.memberEmoji}>👤</AppText>
            <View style={styles.memberInfo}>
              <AppText weight="700" style={styles.memberName}>
                {user?.displayName || t.meLabel}
              </AppText>
              <AppText style={styles.memberSub}>{t.meLabel}</AppText>
            </View>
            {activeMemberId === null && (
              <Icon name="check" size={18} color={Colors.brand} stroke={2.6} />
            )}
          </TouchableOpacity>
        </View>

        {/* Family member cards */}
        {familyMembers.length === 0 ? (
          <View style={styles.emptyState}>
            <AppText style={styles.emptyEmoji}>👨‍👩‍👧‍👦</AppText>
            <AppText weight="700" display style={styles.emptyTitle}>{t.noFamilyMembers}</AppText>
            <AppText style={styles.emptySubtitle}>{t.noFamilyMembersSub}</AppText>
          </View>
        ) : (
          familyMembers.map((member) => (
            <View key={member.id} style={[styles.memberCard, activeMemberId === member.id && styles.memberCardActive]}>
              <TouchableOpacity
                style={styles.memberTouchable}
                onPress={() => setActiveMember(member.id)}
                activeOpacity={0.8}
              >
                <AppText style={styles.memberEmoji}>{member.emoji}</AppText>
                <View style={styles.memberInfo}>
                  <AppText weight="700" style={styles.memberName}>{member.name}</AppText>
                  <AppText style={styles.memberSub} numberOfLines={1}>
                    {[
                      ...member.allergies.filter((a) => !a.startsWith('custom:')).slice(0, 2),
                      ...member.preferences.slice(0, 1),
                    ].join(', ') || '—'}
                  </AppText>
                </View>
                {activeMemberId === member.id && (
                  <Icon name="check" size={18} color={Colors.brand} stroke={2.6} />
                )}
              </TouchableOpacity>
              <View style={styles.memberActions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => openEdit(member)} activeOpacity={0.7}>
                  <Icon name="edit" size={17} color={Colors.textSecondary} stroke={2} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(member)} activeOpacity={0.7}>
                  <Icon name="trash" size={17} color={Colors.textSecondary} stroke={2} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.addBtn} onPress={openAdd} activeOpacity={0.85}>
          <Icon name="plus" size={18} color="#fff" stroke={2.5} />
          <AppText weight="700" style={styles.addBtnText}>{t.addFamilyMember}</AppText>
        </TouchableOpacity>
      </ScrollView>

      {/* Add / Edit modal */}
      <Modal visible={showEditor} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditor(false)} style={styles.modalCancelBtn}>
              <AppText weight="600" style={styles.modalCancelText}>{t.cancel}</AppText>
            </TouchableOpacity>
            <AppText weight="800" display style={styles.modalTitle}>
              {editor.mode === 'add' ? t.addFamilyMember : t.editMember}
            </AppText>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            {/* Avatar row */}
            <AppText weight="700" display style={styles.sectionLabel}>{t.memberAvatarLabel}</AppText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiRow}>
              {AVATAR_OPTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[styles.emojiOption, editor.emoji === emoji && styles.emojiOptionSelected]}
                  onPress={() => setEditor((e) => ({ ...e, emoji }))}
                  activeOpacity={0.75}
                >
                  <AppText style={styles.emojiOptionText}>{emoji}</AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Name input */}
            <AppText weight="700" display style={styles.sectionLabel}>{t.memberNameLabel}</AppText>
            <TextInput
              style={styles.nameInput}
              placeholder={t.memberNamePlaceholder}
              placeholderTextColor={Colors.textLight}
              value={editor.name}
              onChangeText={(v) => setEditor((e) => ({ ...e, name: v }))}
              returnKeyType="done"
            />

            {/* Allergies */}
            <AppText weight="700" display style={styles.sectionLabel}>🤧 {t.allergiesTitle}</AppText>
            <View style={styles.chips}>
              {ALLERGIES.map((item) => {
                const active = editor.allergies.includes(item.id);
                const label = (t as any)[`allergy_${item.id}`] || item.label;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleList(item.id, editor.allergies, (v) => setEditor((e) => ({ ...e, allergies: v })))}
                    activeOpacity={0.75}
                  >
                    <AppText style={styles.chipEmoji}>{item.emoji}</AppText>
                    <AppText weight={active ? '700' : '600'} style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</AppText>
                  </TouchableOpacity>
                );
              })}
              {editor.allergies.filter((a) => a.startsWith('custom:')).map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.chip, styles.chipActive]}
                  onPress={() => setEditor((e) => ({ ...e, allergies: e.allergies.filter((a) => a !== key) }))}
                  activeOpacity={0.75}
                >
                  <AppText style={styles.chipEmoji}>⚠️</AppText>
                  <AppText weight="700" style={[styles.chipLabel, styles.chipLabelActive]}>{key.replace('custom:', '')}</AppText>
                  <AppText style={styles.chipRemove}>✕</AppText>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.customInputRow}>
              <TextInput
                style={styles.customInput}
                placeholder={t.customAllergyPlaceholder}
                placeholderTextColor={Colors.textLight}
                value={editor.customAllergyInput}
                onChangeText={(v) => setEditor((e) => ({ ...e, customAllergyInput: v }))}
                onSubmitEditing={addCustomAllergy}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.customAddBtn} onPress={addCustomAllergy} activeOpacity={0.85}>
                <AppText weight="700" style={styles.customAddBtnText}>{t.customAllergyAdd}</AppText>
              </TouchableOpacity>
            </View>

            {/* Restrictions */}
            <AppText weight="700" display style={styles.sectionLabel}>⚠️ {t.restrictionsTitle}</AppText>
            <View style={styles.chips}>
              {DIETARY_RESTRICTIONS.map((item) => {
                const active = editor.restrictions.includes(item.id);
                const label = (t as any)[`restriction_${item.id}`] || item.label;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleList(item.id, editor.restrictions, (v) => setEditor((e) => ({ ...e, restrictions: v })))}
                    activeOpacity={0.75}
                  >
                    <AppText style={styles.chipEmoji}>{item.emoji}</AppText>
                    <AppText weight={active ? '700' : '600'} style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Preferences */}
            <AppText weight="700" display style={styles.sectionLabel}>🥗 {t.preferencesTitle}</AppText>
            <View style={styles.prefList}>
              {DIETARY_PREFERENCES.map((item) => {
                const active = editor.preferences.includes(item.id);
                const label = (t as any)[`pref_${item.id}`] || item.label;
                const desc = (t as any)[`pref_${item.id}_desc`] || item.description;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.prefCard, active && styles.prefCardActive]}
                    onPress={() => toggleList(item.id, editor.preferences, (v) => setEditor((e) => ({ ...e, preferences: v })), true)}
                    activeOpacity={0.8}
                  >
                    <AppText style={styles.prefEmoji}>{item.emoji}</AppText>
                    <View style={styles.prefText}>
                      <AppText weight="600" style={[styles.prefLabel, active && styles.prefLabelActive]}>{label}</AppText>
                      <AppText style={styles.prefDesc}>{desc}</AppText>
                    </View>
                    <View style={[styles.radio, active && styles.radioActive]}>
                      {active && <View style={styles.radioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <AppText weight="800" style={styles.saveBtnText}>{t.saveMember}</AppText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 20 },

  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.sm,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.soft,
  },
  memberCardActive: { borderColor: Colors.brand, backgroundColor: Colors.brandSoft },
  memberTouchable: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  memberEmoji: { fontSize: 34 },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 16, color: Colors.text },
  memberSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  memberActions: { flexDirection: 'row', paddingRight: 8, gap: 4 },
  actionBtn: {
    width: 36, height: 36, borderRadius: Radius.xs,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    margin: 4,
  },

  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyEmoji: { fontSize: 48, marginBottom: 8 },
  emptyTitle: { fontSize: 18, color: Colors.text },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },

  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.brand,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    marginTop: 8,
    ...Shadow.brand,
  },
  addBtnText: { color: '#fff', fontSize: 16 },

  // Modal
  modal: { flex: 1, backgroundColor: Colors.bg },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: Radius.card,
    borderBottomRightRadius: Radius.card,
    ...Shadow.soft,
  },
  modalCancelBtn: { width: 60 },
  modalCancelText: { fontSize: 15, color: Colors.brand },
  modalTitle: { fontSize: 17, color: Colors.text },
  modalContent: { padding: 20, paddingBottom: 40 },
  modalFooter: {
    padding: 20, paddingBottom: 40,
    backgroundColor: Colors.surface,
    borderTopWidth: 1, borderTopColor: Colors.surfaceAlt,
  },

  sectionLabel: { fontSize: 15, color: Colors.text, marginTop: 20, marginBottom: 10 },

  emojiRow: { flexGrow: 0, marginBottom: 4 },
  emojiOption: {
    width: 52, height: 52, borderRadius: Radius.pill,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 8,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 2, borderColor: Colors.border,
  },
  emojiOptionSelected: { borderColor: Colors.brand, backgroundColor: Colors.brandSoft },
  emojiOptionText: { fontSize: 28 },

  nameInput: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.xs,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 16, color: Colors.text,
    borderWidth: 1.5, borderColor: Colors.border,
    marginBottom: 4,
  },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 9,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  chipActive: { borderColor: Colors.brand, backgroundColor: Colors.brandSoft },
  chipEmoji: { fontSize: 15 },
  chipLabel: { fontSize: 13, color: Colors.text },
  chipLabelActive: { color: Colors.brand },
  chipRemove: { fontSize: 11, color: Colors.brand, marginLeft: 2 },

  customInputRow: { flexDirection: 'row', gap: 8, marginTop: 4, marginBottom: 4 },
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
    paddingHorizontal: 14, paddingVertical: 10,
    justifyContent: 'center',
  },
  customAddBtnText: { color: '#fff', fontSize: 14 },

  prefList: { gap: 10 },
  prefCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  prefCardActive: { borderColor: Colors.brand, backgroundColor: Colors.brandSoft },
  prefEmoji: { fontSize: 24 },
  prefText: { flex: 1 },
  prefLabel: { fontSize: 15, color: Colors.text },
  prefLabelActive: { color: Colors.brand },
  prefDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  radioActive: { borderColor: Colors.brand },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.brand },

  saveBtn: {
    backgroundColor: Colors.brand,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    ...Shadow.brand,
  },
  saveBtnDisabled: { opacity: 0.6, shadowOpacity: 0 },
  saveBtnText: { color: '#fff', fontSize: 16 },
});
