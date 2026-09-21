import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme/tokens';

const advertisements = [
  { title: 'Votre entreprise ici', detail: 'Présentez votre activité', color: '#F0602E' },
  { title: 'Offre spéciale', detail: 'Ajoutez votre annonce', color: '#176B87' },
  { title: 'Espace publicitaire', detail: 'Réservé aux entreprises', color: '#D08A19' },
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
    <View style={styles.banner} accessibilityLabel="Espace publicitaire">
      <Text style={styles.eyebrow}>PUBLICITÉ</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.logoRow}
      >
        {advertisements.concat(advertisements).map((advertisement, index) => (
          <View key={`${advertisement.title}-${index}`} style={styles.advertisement}>
            <View style={[styles.adMark, { backgroundColor: advertisement.color }]} />
            <View>
              <Text style={styles.adTitle}>{advertisement.title}</Text>
              <Text style={styles.adDetail}>{advertisement.detail}</Text>
            </View>
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
  advertisement: {
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 164,
  },
  adMark: {
    borderRadius: 5,
    height: 28,
    marginRight: spacing.sm,
    width: 5,
  },
  adTitle: {
    color: colors.textDark,
    fontSize: 11,
    fontWeight: '800',
  },
  adDetail: {
    color: colors.textLight,
    fontSize: 10,
    marginTop: 2,
  },
});