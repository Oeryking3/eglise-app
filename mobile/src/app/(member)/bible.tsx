import { Feather } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { HeaderWithBack } from '@/components/HeaderWithBack';
import { PillButton } from '@/components/PillButton';
import { colors, radii, spacing } from '@/theme/tokens';

const BIBLE_URL = 'https://eglise-app-production.up.railway.app/files/bible-louis-segond.pdf';
const VERSES = [
  { reference: 'Jean 3:16', text: 'Car Dieu a tant aimé le monde qu’il a donné son Fils unique.' },
  { reference: 'Psaume 23:1', text: 'L’Éternel est mon berger : je ne manquerai de rien.' },
  { reference: 'Philippiens 4:13', text: 'Je puis tout par celui qui me fortifie.' },
  { reference: 'Jérémie 29:11', text: 'Car je connais les projets que j’ai formés sur vous, dit l’Éternel.' },
  { reference: 'Proverbes 3:5', text: 'Confie-toi en l’Éternel de tout ton cœur, et ne t’appuie pas sur ta sagesse.' },
];

export default function BibleScreen() {
  const [selectedVerse, setSelectedVerse] = useState(VERSES[0]);
  const [sharing, setSharing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const openBible = () => Linking.openURL(BIBLE_URL);

  const shareVerse = async () => {
    const text = `${selectedVerse.reference}\n\n« ${selectedVerse.text} »\n\nBible Louis Segond 1910\n${BIBLE_URL}`;
    setSharing(true);
    setMessage(null);
    try {
      await Share.share({ message: text, title: selectedVerse.reference });
      setMessage('Le verset est prêt à être partagé.');
    } catch {
      setMessage('Impossible de partager ce verset pour le moment.');
    } finally {
      setSharing(false);
    }
  };

  return (
    <View style={styles.page}>
      <HeaderWithBack title="Bible" subtitle="Louis Segond 1910" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Image
            source={require('../../../assets/images/bible-icon.png')}
            style={styles.bibleImage}
            resizeMode="cover"
            accessibilityLabel="Illustration de Bibles ouvertes"
          />
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>La Sainte Bible</Text>
            <Text style={styles.heroSubtitle}>Texte français du domaine public, disponible gratuitement.</Text>
          </View>
        </View>

        <PillButton title="Lire la Bible" onPress={openBible} />
        <Pressable onPress={openBible} style={styles.downloadLink}>
          <Feather name="download" size={16} color={colors.orangeDark} />
          <Text style={styles.downloadText}>Télécharger le PDF complet</Text>
        </Pressable>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Partager un verset</Text>
        <Text style={styles.hint}>Choisis simplement un verset à envoyer à un ami.</Text>
        <View style={styles.verseList}>
          {VERSES.map((item) => {
            const selected = item.reference === selectedVerse.reference;
            return (
              <Pressable
                key={item.reference}
                onPress={() => setSelectedVerse(item)}
                style={[styles.verseCard, selected && styles.verseCardSelected]}
              >
                <View style={styles.verseCardHeader}>
                  <Text style={[styles.reference, selected && styles.referenceSelected]}>{item.reference}</Text>
                  {selected ? <Feather name="check-circle" size={17} color={colors.orange} /> : null}
                </View>
                <Text style={styles.verseText}>{item.text}</Text>
              </Pressable>
            );
          })}
        </View>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <PillButton title="Partager le verset" onPress={shareVerse} loading={sharing} variant="outline" />

        <Pressable onPress={() => router.push('/(member)/livres' as never)} style={styles.ebooksLink}>
          <Feather name="book" size={16} color={colors.textMuted} />
          <Text style={styles.ebooksText}>Voir les autres Ebooks PDF</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  content: { padding: spacing.xl, paddingBottom: 60 },
  hero: { alignItems: 'center', backgroundColor: colors.orangeLight, borderColor: colors.orangeBorder, borderRadius: radii.lg, borderWidth: 1, flexDirection: 'row', marginBottom: spacing.lg, padding: spacing.lg },
  bibleImage: { backgroundColor: '#fff', borderRadius: radii.md, height: 72, marginRight: spacing.md, width: 72 },
  heroText: { flex: 1 },
  heroTitle: { color: colors.textDark, fontSize: 18, fontWeight: '800' },
  heroSubtitle: { color: colors.textMuted, fontSize: 13, lineHeight: 19, marginTop: 4 },
  downloadLink: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', padding: spacing.md },
  downloadText: { color: colors.orangeDark, fontSize: 13, fontWeight: '700', marginLeft: spacing.sm },
  divider: { backgroundColor: colors.cardBorder, height: 1, marginVertical: spacing.lg },
  sectionTitle: { color: colors.textDark, fontSize: 18, fontWeight: '800' },
  hint: { color: colors.textMuted, fontSize: 13, lineHeight: 19, marginBottom: spacing.md, marginTop: 6 },
  verseList: { gap: spacing.sm },
  verseCard: { borderColor: colors.cardBorder, borderRadius: radii.md, borderWidth: 1, padding: spacing.md },
  verseCardSelected: { backgroundColor: colors.orangeLight, borderColor: colors.orange },
  verseCardHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  reference: { color: colors.orangeDark, fontSize: 14, fontWeight: '800' },
  referenceSelected: { color: colors.orange },
  verseText: { color: colors.textMuted, fontSize: 13, lineHeight: 20, marginTop: 6 },
  message: { color: colors.successText, fontSize: 13, fontWeight: '700', marginBottom: spacing.md, marginTop: spacing.md },
  ebooksLink: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl, padding: spacing.sm },
  ebooksText: { color: colors.textMuted, fontSize: 13, fontWeight: '700', marginLeft: spacing.sm },
});