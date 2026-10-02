import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { AdvertisementMedia } from '@/components/AdvertisementMedia';
import { api } from '@/lib/api';
import { colors, spacing } from '@/theme/tokens';

type Advertisement = {
  id: number;
  image_url: string | null;
  video_url: string | null;
};

const AD_GAP = 16;

export function SponsorBanner() {
  const scrollRef = useRef<ScrollView>(null);
  const offset = useRef(0);
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 40, 470);
  const { data: advertisements = [] } = useQuery({
    queryKey: ['carousel'],
    queryFn: async () => (await api.get<{ data: Advertisement[] }>('/carousel')).data.data,
  });
  const imageAdvertisements = advertisements.filter((advertisement) => advertisement.image_url);

  useEffect(() => {
    if (imageAdvertisements.length < 2) {
      return;
    }

    const interval = setInterval(() => {
      const nextOffset = offset.current >= (cardWidth + AD_GAP) * (imageAdvertisements.length - 1)
        ? 0
        : offset.current + cardWidth + AD_GAP;

      offset.current = nextOffset;
      scrollRef.current?.scrollTo({ x: nextOffset, animated: true });
    }, 3200);

    return () => clearInterval(interval);
  }, [imageAdvertisements.length, cardWidth]);

  const onScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    offset.current = event.nativeEvent.contentOffset.x;
  };

  if (imageAdvertisements.length === 0) return null;

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
        {imageAdvertisements.map((advertisement) => (
          <AdvertisementMedia
            key={advertisement.id}
            imageUrl={advertisement.image_url}
            videoUrl={advertisement.video_url}
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