import { createElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme/tokens';

type Props = {
  label: string;
  value: string; // "HH:MM" ou ''
  onChange: (value: string) => void;
  placeholder?: string;
};

export function TimeField({ label, value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      {createElement('input', {
        type: 'time',
        value: value || '',
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
