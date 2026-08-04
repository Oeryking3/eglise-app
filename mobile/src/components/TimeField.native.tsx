import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatTime } from '../lib/format';
import { colors, radii, spacing } from '../theme/tokens';

type Props = {
  label: string;
  value: string; // "HH:MM" ou ''
  onChange: (value: string) => void;
  placeholder?: string;
};

function toHHMM(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function TimeField({ label, value, onChange, placeholder }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.input} onPress={() => setOpen(true)}>
        <Text style={value ? styles.valueText : styles.placeholderText}>
          {value ? formatTime(value) : placeholder || 'Sélectionner une heure'}
        </Text>
      </Pressable>
      {open ? (
        <DateTimePicker
          value={value ? new Date(`2000-01-01T${value}:00`) : new Date()}
          mode="time"
          display="default"
          is24Hour
          onChange={(event, date) => {
            setOpen(false);
            if (event.type === 'set' && date) {
              onChange(toHHMM(date));
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
