import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { Image, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { api } from '@/lib/api';
import { colors, spacing } from '@/theme/tokens';

type CarouselSlide = {
  id: number;
  image_url: string;
  ordre: number;
  actif: boolean;
};

const AD_GAP = 16;

export function SponsorBanner() {
  const scrollRef = useRef<ScrollView>(null);
  const offset = useRef(0);
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 40, 470);

  const { data: advertisements = [] } = useQuery({
    queryKey: ['member-carousel'],
    queryFn: async () => {
      const response = await api.get<{ data: CarouselSlide[] }>('/carousel');
      return response.data.data ?? [];
    },
    retry: 1,
  });

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

  if (!advertisements.length) {
    return null;
  }

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
            source={{ uri: advertisement.image_url }}
            resizeMode="cover"
            style={[styles.advertisement, { width: cardWidth }]}
          />
        ))}
      </ScrollView>
      {Platform.OS === 'web' ? (
        <iframe
          title="Publicité officielle Orange Money"
          src="https://www.youtube-nocookie.com/embed/CBsWR5V0Jmg?controls=1&rel=0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          style={styles.videoFrame}
        />
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Regarder la publicité Orange Money"
          onPress={() => Linking.openURL('https://www.youtube.com/watch?v=CBsWR5V0Jmg')}
          style={styles.videoCard}
        >
          <View style={styles.videoBadge}><Text style={styles.videoBadgeText}>VIDÉO</Text></View>
          <View style={styles.videoCopy}>
            <Text style={styles.videoTitle}>Orange Money</Text>
            <Text style={styles.videoSubtitle}>Plus sûr et moins cher</Text>
          </View>
          <Text style={styles.videoAction}>▶</Text>
        </Pressable>
      )}
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
  videoCard: {
    alignItems: 'center',
    backgroundColor: '#fff4e8',
    borderColor: colors.orangeBorder,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: spacing.md,
    marginHorizontal: 20,
    padding: spacing.md,
  },
  videoFrame: {
    alignSelf: 'center',
    borderWidth: 0,
    height: 220,
    marginBottom: spacing.md,
    maxWidth: 720,
    width: '100%',
  },
  videoBadge: {
    alignItems: 'center',
    backgroundColor: colors.orange,
    borderRadius: 10,
    height: 42,
    justifyContent: 'center',
    width: 50,
  },
  videoBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  videoCopy: { flex: 1, marginLeft: spacing.md },
  videoTitle: { color: colors.textDark, fontSize: 14, fontWeight: '800' },
  videoSubtitle: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  videoAction: { color: colors.orangeDark, fontSize: 22, fontWeight: '800', paddingLeft: spacing.sm },
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