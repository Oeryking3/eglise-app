import { router } from 'expo-router';
import { useEffect } from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme/tokens';

const VIDEO_ID = 'CBsWR5V0Jmg';
const VIDEO_DURATION_MS = 45_000;

export default function OrangeAdvertisementScreen() {
  useEffect(() => {
    const timeout = setTimeout(() => router.replace('/(member)/accueil'), VIDEO_DURATION_MS);
    return () => clearTimeout(timeout);
  }, []);

  const openOfficialVideo = () => {
    Linking.openURL(`https://www.youtube.com/watch?v=${VIDEO_ID}`);
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.label}>PUBLICITÉ OFFICIELLE</Text>
        <Text style={styles.title}>Orange Money</Text>
        <Text style={styles.subtitle}>Plus sûr et moins cher</Text>
      </View>

      {Platform.OS === 'web' ? (
        <iframe
          title="Publicité officielle Orange Money"
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&controls=1&rel=0`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          style={styles.iframe}
        />
      ) : (
        <View style={styles.nativeFallback}>
          <Text style={styles.fallbackText}>Cette vidéo officielle s’ouvre sur YouTube.</Text>
          <Pressable onPress={openOfficialVideo} style={styles.button}>
            <Text style={styles.buttonText}>Regarder la vidéo</Text>
          </Pressable>
        </View>
      )}

      <Pressable onPress={() => router.replace('/(member)/accueil')} style={styles.skipButton}>
        <Text style={styles.skipText}>Retour à l’accueil</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: '#fff', flex: 1, padding: spacing.xl },
  header: { marginBottom: spacing.xl, paddingTop: spacing.xl },
  label: { color: colors.orange, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  title: { color: colors.textDark, fontSize: 28, fontWeight: '800', marginTop: spacing.sm },
  subtitle: { color: colors.textMuted, fontSize: 15, marginTop: spacing.xs },
  iframe: { alignSelf: 'center', borderWidth: 0, height: 240, maxWidth: 720, width: '100%' },
  nativeFallback: { alignItems: 'center', backgroundColor: colors.orangeLight, borderRadius: 16, padding: spacing.xl },
  fallbackText: { color: colors.textDark, fontSize: 15, marginBottom: spacing.lg, textAlign: 'center' },
  button: { backgroundColor: colors.orange, borderRadius: 12, paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  buttonText: { color: '#fff', fontWeight: '800' },
  skipButton: { alignSelf: 'center', marginTop: spacing.xl, padding: spacing.md },
  skipText: { color: colors.orangeDark, fontSize: 14, fontWeight: '800' },
});