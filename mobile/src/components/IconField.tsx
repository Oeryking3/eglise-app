import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { useThemeColors } from '../lib/theme-context';
import { colors, radii, typography } from '../theme/tokens';

type Props = TextInputProps & {
  icon: ReactNode;
  error?: string;
};

export function IconField({ icon, error, style, ...rest }: Props) {
  const themeColors = useThemeColors();

  return (
    <View>
      <View style={[styles.wrap, { borderColor: themeColors.orangeBorder }, error && styles.wrapError]}>
        <View style={styles.icon}>{icon}</View>
        <TextInput placeholderTextColor={colors.textPlaceholder} style={[styles.input, style]} {...rest} />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: radii.md,
    borderWidth: 1,
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  wrapError: {
    borderColor: colors.error,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: typography.fontFamily,
    color: colors.textDark,
  },
  error: {
    color: colors.error,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
});
