import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme/tokens';

const advertisements = [
  {
    title: 'Orange Money',
    detail: 'Envoyez, recevez et payez simplement.',
    colors: ['#FF9D00', '#F15A24'] as const,
    mark: 'OM',
  },
  {
    title: 'Orange Côte d’Ivoire',
    detail: 'Restez connectés à ceux qui comptent.',
    colors: ['#F15A24', '#C9361B'] as const,
    mark: 'O',
  },
  {
    title: 'Orange Money',
    detail: 'Votre quotidien, plus simple avec Orange.',
    colors: ['#FF7900', '#E94820'] as const,
    mark: 'OM',
  },
];

const CARD_WIDTH = 304;

export function SponsorBanner() {
  const scrollRef = useRef<ScrollView>(null);
  const offset = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      offset.current = offset.current >= CARD_WIDTH * (advertisements.length - 1)
        ? 0
        : offset.current + CARD_WIDTH;
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
        contentContainerStyle={styles.carousel}
      >
        {advertisements.map((advertisement) => (
          <LinearGradient
            key={advertisement.title + advertisement.detail}
            colors={advertisement.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.advertisement}
          >
            <View style={styles.adCopy}>
              <Text style={styles.adBrand}>ORANGE</Text>
              <Text style={styles.adTitle}>{advertisement.title}</Text>
              <Text style={styles.adDetail}>{advertisement.detail}</Text>
            </View>
            <View style={styles.adMark}>
              <Text style={styles.adMarkText}>{advertisement.mark}</Text>
            </View>
          </LinearGradient>
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
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
  },
  eyebrow: {
    color: colors.textFaint,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 3,
    paddingHorizontal: spacing.xl,
  },
  carousel: {
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  advertisement: {
    alignItems: 'flex-end',
    borderRadius: 14,
    flexDirection: 'row',
    height: 108,
    justifyContent: 'space-between',
    overflow: 'hidden',
    padding: spacing.lg,
    width: CARD_WIDTH,
  },
  adCopy: { flex: 1 },
  adMark: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 999,
    height: 58,
    justifyContent: 'center',
    marginLeft: spacing.md,
    width: 58,
  },
  adMarkText: {
    color: '#F15A24',
    fontSize: 18,
    fontWeight: '900',
  },
  adBrand: { color: 'rgba(255,255,255,0.8)', fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  adTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 3,
  },
  adDetail: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
  },
});