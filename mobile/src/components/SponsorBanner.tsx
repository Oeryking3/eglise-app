import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme/tokens';

const sponsors = [
  { name: 'Orange', suffix: 'CI', color: '#F47B20', textColor: colors.white },
  { name: 'MTN', suffix: 'CI', color: '#FFCC08', textColor: colors.black },
  { name: 'Moov', suffix: 'Africa', color: '#0057A6', textColor: colors.white },
  { name: 'wave', suffix: 'CI', color: '#1434CB', textColor: colors.white },
];

export function SponsorBanner() {
  const scrollRef = useRef<ScrollView>(null);
  const offset = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      offset.current = offset.current >= 220 ? 0 : offset.current + 110;
      scrollRef.current?.scrollTo({ x: offset.current, animated: true });
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.banner} accessibilityLabel="Exemples de partenaires publicitaires">
      <Text style={styles.eyebrow}>PARTENAIRES</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.logoRow}
      >
        {sponsors.concat(sponsors).map((sponsor, index) => (
          <View key={`${sponsor.name}-${index}`} style={styles.logo}>
            <View style={[styles.logoMark, { backgroundColor: sponsor.color }]} />
            <Text style={styles.logoName}>{sponsor.name}</Text>
            <Text style={styles.logoSuffix}>{sponsor.suffix}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: colors.cardBorder,
    borderTopWidth: 1,
    marginBottom: spacing.xl,
    marginHorizontal: -spacing.xl,
    paddingVertical: spacing.sm,
  },
  eyebrow: {
    color: colors.textFaint,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 3,
    paddingHorizontal: spacing.xl,
  },
  logoRow: {
    alignItems: 'center',
    gap: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  logo: {
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 86,
  },
  logoMark: {
    borderRadius: 3,
    height: 8,
    marginRight: 5,
    width: 8,
  },
  logoName: {
    color: colors.textDark,
    fontSize: 12,
    fontWeight: '800',
  },
  logoSuffix: {
    color: colors.textLight,
    fontSize: 9,
    fontWeight: '700',
    marginLeft: 3,
  },
});