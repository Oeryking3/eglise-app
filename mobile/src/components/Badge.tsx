import { StyleSheet, Text } from 'react-native';
import { colors, radii } from '../theme/tokens';

type Tone = 'success' | 'pending' | 'failed' | 'important';

export function Badge({ label, tone }: { label: string; tone: Tone }) {
  return <Text style={[styles.base, toneStyles[tone]]}>{label}</Text>;
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    fontSize: 11,
    fontWeight: '700',
    overflow: 'hidden',
  },
});

const toneStyles = StyleSheet.create({
  success: { backgroundColor: colors.successBg, color: colors.successText },
  pending: { backgroundColor: colors.pendingBg, color: colors.pendingText },
  failed: { backgroundColor: colors.failedBg, color: colors.failedText },
  important: { backgroundColor: colors.importantBg, color: colors.importantText },
});
