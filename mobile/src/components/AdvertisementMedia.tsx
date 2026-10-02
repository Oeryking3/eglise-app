import { useVideoPlayer, VideoView } from 'expo-video';
import { Feather } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Image, Platform, Pressable, StyleSheet, Text, View, type ImageStyle, type StyleProp } from 'react-native';

type Props = {
  imageUrl: string | null;
  videoUrl: string | null;
  style: StyleProp<ImageStyle>;
};

export function AdvertisementMedia({ imageUrl, videoUrl, style }: Props) {
  if (videoUrl) {
    const youtubeEmbedUrl = getYoutubeEmbedUrl(videoUrl);

    if (Platform.OS === 'web' && youtubeEmbedUrl) {
      return (
        <View style={[style, styles.videoFrame]}>
          <iframe
            title="Publicité vidéo"
            src={youtubeEmbedUrl}
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
            style={styles.iframe}
          />
        </View>
      );
    }

    if (isDirectVideoUrl(videoUrl)) {
      return <AdvertisementVideo uri={videoUrl} style={style} />;
    }

    return (
      <Pressable style={[style, styles.videoLink]} onPress={() => Linking.openURL(videoUrl)} accessibilityRole="link">
        <Feather name="play-circle" size={32} color="#fff" />
        <Text style={styles.videoLinkText}>Regarder la publicité vidéo</Text>
      </Pressable>
    );
  }

  if (!imageUrl) return null;

  return <Image source={{ uri: imageUrl }} style={style} resizeMode="cover" accessibilityLabel="Publicité" />;
}

function getYoutubeEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    let id: string | null = null;

    if (host === 'youtu.be') {
      id = url.pathname.slice(1).split('/')[0] ?? null;
    } else if (host === 'youtube.com' || host === 'm.youtube.com') {
      id = url.searchParams.get('v');
      if (!id) id = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ?? null;
    }

    return id && /^[\w-]+$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}?controls=1&rel=0` : null;
  } catch {
    return null;
  }
}

function isDirectVideoUrl(value: string): boolean {
  try {
    return /\.(mp4|m4v|mov|webm|m3u8)$/i.test(new URL(value).pathname);
  } catch {
    return false;
  }
}

function AdvertisementVideo({ uri, style }: { uri: string; style: StyleProp<ImageStyle> }) {
  const player = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
    videoPlayer.play();
  });

  return <VideoView player={player} style={[style, styles.video]} contentFit="cover" nativeControls />;
}

const styles = StyleSheet.create({
  video: { backgroundColor: '#000' },
  videoFrame: { overflow: 'hidden', backgroundColor: '#000' },
  iframe: { width: '100%', height: '100%', borderWidth: 0 },
  videoLink: { alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#282828' },
  videoLinkText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});