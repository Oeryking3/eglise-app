import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from 'react-native';
import { useThemeColors } from '../lib/theme-context';
import { colors as staticColors, radii, shadow } from '../theme/tokens';

type Variant = 'primary' | 'outline' | 'danger' | 'dark';

type Props = PressableProps & {
  title: string;
  variant?: Variant;
  loading?: boolean;
};

export function PillButton({ title, variant = 'primary', loading, disabled, style, ...rest }: Props) {
  const colors = useThemeColors();

  // Dépend de la couleur de marque de l'église active — ne peut pas être un
  // StyleSheet statique (StyleSheet.create fige les valeurs au chargement du
  // module, avant que le thème de l'église ne soit connu).
  const dynamicBase = {
    primary: { backgroundColor: colors.orangeDark, ...shadow(colors.orangeDark) },
    outline: { backgroundColor: '#fff', borderWidth: 1, borderColor: staticColors.cardBorder },
    danger: { backgroundColor: staticColors.failedBg, borderWidth: 1, borderColor: staticColors.error },
    dark: { backgroundColor: staticColors.black },
  }[variant];

  const dynamicText = {
    primary: { color: '#fff' },
    outline: { color: colors.orange },
    danger: { color: staticColors.error },
    dark: { color: '#fff' },
  }[variant];

  return (
    <Pressable
      disabled={disabled || loading}
      style={(state) => [
        styles.base,
        dynamicBase,
        (disabled || loading) && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.orange : '#fff'} />
      ) : (
        <Text style={[styles.text, dynamicText]}>{title}</Text>
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
