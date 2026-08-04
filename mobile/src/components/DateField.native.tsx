import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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

export function DateField({ label, value, onChange, minimumDate, maximumDate, placeholder }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.input} onPress={() => setOpen(true)}>
        <Text style={value ? styles.valueText : styles.placeholderText}>
          {value || placeholder || 'Sélectionner une date'}
        </Text>
      </Pressable>
      {open ? (
        <DateTimePicker
          value={value ? new Date(`${value}T00:00:00`) : new Date()}
          mode="date"
          display="default"
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={(event, date) => {
            setOpen(false);
            if (event.type === 'set' && date) {
              onChange(toIso(date));
            }
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  valueText: { fontSize: 15, color: colors.textDark },
  placeholderText: { fontSize: 15, color: colors.textPlaceholder },
});
