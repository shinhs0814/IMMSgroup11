import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { useLanguage } from '../../context/LanguageContext';
type Props = { onBack: () => void };
export default function QRPassportScreen({ onBack }: Props) {
  const { t } = useLanguage();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>← {t.back}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{t.qrPassportTitle}</Text>
      <Text style={styles.note}>{t.qrPassportWebOnly}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: 32 },
  back: { position: 'absolute', top: 56, left: 16 },
  backText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 16 },
  note: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center' },
});
