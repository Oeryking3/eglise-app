import { createElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme/tokens';

type Props = {
  label: string;
  value: string; // "AAAA-MM-JJ" ou ''
  onChange: (value: string) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  placeholder?: string;
};

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// @react-native-community/datetimepicker n'a pas d'implémentation web —
// on utilise le vrai calendrier natif du navigateur (input type=date).
export function DateField({ label, value, onChange, minimumDate, maximumDate }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      {createElement('input', {
        type: 'date',
        value: value || '',
        min: minimumDate ? toIso(minimumDate) : undefined,
        max: maximumDate ? toIso(maximumDate) : undefined,
        onChange: (e: { target: { value: string } }) => onChange(e.target.value),
        style: webInputStyle,
      })}
    </View>
  );
}

const webInputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: '#fff',
  border: `1px solid ${colors.cardBorder}`,
  borderRadius: radii.sm,
  paddingTop: 12,
  paddingBottom: 12,
  paddingLeft: 14,
  paddingRight: 14,
  fontSize: 15,
  color: colors.textDark,
  fontFamily: 'inherit',
} as const;

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginBottom: 6 },
});
