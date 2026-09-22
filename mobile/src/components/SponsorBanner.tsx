import { useEffect, useRef } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors, spacing } from '@/theme/tokens';

const advertisements = [
  { id: 'ebinto', source: require('../../assets/images/carousel/homeB2CEbinto.jpeg') },
  { id: 'orange-money', source: require('../../assets/images/carousel/orange-money-newAccueil.png') },
  { id: 'orange-max', source: require('../../assets/images/carousel/VisuelPortailB2C-28-07-2026.png') },
];

const AD_GAP = 16;

export function SponsorBanner() {
  const scrollRef = useRef<ScrollView>(null);
  const offset = useRef(0);
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 40, 470);

  useEffect(() => {
    if (advertisements.length < 2) {
      return;
    }

    const interval = setInterval(() => {
      const nextOffset = offset.current >= (cardWidth + AD_GAP) * (advertisements.length - 1)
        ? 0
        : offset.current + cardWidth + AD_GAP;

      offset.current = nextOffset;
      scrollRef.current?.scrollTo({ x: nextOffset, animated: true });
    }, 3200);

    return () => clearInterval(interval);
  }, [advertisements.length, cardWidth]);

  const onScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    offset.current = event.nativeEvent.contentOffset.x;
  };

  return (
    <View style={styles.banner} accessibilityLabel="Espace publicitaire">
      <Text style={styles.eyebrow}>PUBLICITÉ</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        snapToInterval={cardWidth + AD_GAP}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[styles.carousel, { paddingHorizontal: 20, gap: AD_GAP }]}
      >
        {advertisements.map((advertisement) => (
          <Image
            key={advertisement.id}
            accessibilityLabel="Publicité Orange"
            source={advertisement.source}
            resizeMode="cover"
            style={[styles.advertisement, { width: cardWidth }]}
          />
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
    alignItems: 'stretch',
    paddingRight: spacing.xl,
  },
  advertisement: {
    borderRadius: 20,
    height: 170,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
});