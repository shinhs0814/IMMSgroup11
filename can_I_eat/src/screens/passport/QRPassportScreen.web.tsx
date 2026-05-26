import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
type Props = { onBack: () => void };
export default function QRPassportScreen({ onBack }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>QR Passport</Text>
      <Text style={styles.note}>QR Passport is available on the mobile app.</Text>
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
