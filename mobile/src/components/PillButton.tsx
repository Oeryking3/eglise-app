import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from 'react-native';
import { colors, radii, shadow } from '../theme/tokens';

type Variant = 'primary' | 'outline' | 'danger' | 'dark';

type Props = PressableProps & {
  title: string;
  variant?: Variant;
  loading?: boolean;
};

export function PillButton({ title, variant = 'primary', loading, disabled, style, ...rest }: Props) {
  return (
    <Pressable
      disabled={disabled || loading}
      style={(state) => [
        styles.base,
        variantStyles[variant],
        (disabled || loading) && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.orange : '#fff'} />
      ) : (
        <Text style={[styles.text, textStyles[variant]]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '800',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.orangeDark, ...shadow(colors.orangeDark) },
  outline: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder },
  danger: { backgroundColor: colors.failedBg, borderWidth: 1, borderColor: colors.error },
  dark: { backgroundColor: colors.black },
});

const textStyles = StyleSheet.create({
  primary: { color: '#fff' },
  outline: { color: colors.orange },
  danger: { color: colors.error },
  dark: { color: '#fff' },
});
