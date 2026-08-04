import { StyleSheet, Text, View, type ViewProps } from 'react-native';
import { cardShadow, colors, radii, spacing } from '../theme/tokens';

type Props = ViewProps & {
  title: string;
  subtitle?: string;
};

export function ListCard({ title, subtitle, children, style, ...rest }: Props) {
  return (
    <View style={[styles.card, style]} {...rest}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    lineHeight: 18,
  },
});
