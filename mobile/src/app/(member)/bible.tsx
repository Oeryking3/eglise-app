import { Feather } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';
import { HeaderWithBack } from '@/components/HeaderWithBack';
import { PillButton } from '@/components/PillButton';
import { colors, radii, spacing } from '@/theme/tokens';

const BIBLE_URL = 'https://eglise-app-production.up.railway.app/files/bible-louis-segond.pdf';
const BIBLE_INDEX_URL = 'https://eglise-app-production.up.railway.app/api/bible-index';
const VERSES = [
  { reference: 'Jean 3:16', text: 'Car Dieu a tant aimé le monde qu’il a donné son Fils unique.' },
  { reference: 'Psaume 23:1', text: 'L’Éternel est mon berger : je ne manquerai de rien.' },
  { reference: 'Philippiens 4:13', text: 'Je puis tout par celui qui me fortifie.' },
  { reference: 'Jérémie 29:11', text: 'Car je connais les projets que j’ai formés sur vous, dit l’Éternel.' },
  { reference: 'Proverbes 3:5', text: 'Confie-toi en l’Éternel de tout ton cœur, et ne t’appuie pas sur ta sagesse.' },
];

export default function BibleScreen() {
  const [selectedVerse, setSelectedVerse] = useState(VERSES[0]);
  const [search, setSearch] = useState('');
  const [biblePages, setBiblePages] = useState<{ page: number; text: string }[]>([]);
  const [indexLoading, setIndexLoading] = useState(true);

  useEffect(() => {
    fetch(BIBLE_INDEX_URL)
      .then((response) => response.json())
      .then((pages: { page: number; text: string }[]) => setBiblePages(pages))
      .catch(() => setBiblePages([]))
      .finally(() => setIndexLoading(false));
  }, []);
  const [sharing, setSharing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const openBible = () => Linking.openURL(BIBLE_URL);

  const verseResults = search.trim()
    ? biblePages
        .filter((item) => item.text.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()))
        .slice(0, 20)
        .map((item) => ({ page: item.page, reference: `Page ${item.page}`, text: item.text }))
    : VERSES.map((item) => ({ page: 0, ...item }));

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
      <HeaderWithBack title="Bible" subtitle="Louis Segond 1910" backTo="/(member)/accueil" />
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
        <Text style={styles.hint}>Recherche un mot, une phrase ou une référence dans toute la Bible.</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Ex. amour, Jean 3:16, foi..."
          placeholderTextColor={colors.textPlaceholder}
          style={styles.searchInput}
        />
        <View style={styles.verseList}>
          {verseResults.map((item) => {
            const selected = item.reference === selectedVerse.reference;
            return (
              <Pressable
                key={`${item.reference}-${item.page}`}
                onPress={() => setSelectedVerse({ reference: item.reference, text: item.text })}
                style={[styles.verseCard, selected && styles.verseCardSelected]}
              >
                <View style={styles.verseCardHeader}>
                  <Text style={[styles.reference, selected && styles.referenceSelected]}>{item.reference}</Text>
                  {selected ? <Feather name="check-circle" size={17} color={colors.orange} /> : null}
                </View>
                <Text style={styles.verseText} numberOfLines={4}>{item.text}</Text>
              </Pressable>
            );
          })}
        </View>
        {indexLoading && search.trim() ? <Text style={styles.empty}>Chargement de l’index biblique...</Text> : null}
        {!indexLoading && search.trim() && biblePages.every((item) => !item.text.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())) ? (
          <Text style={styles.empty}>Aucun passage trouvé dans la Bible.</Text>
        ) : null}
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
  searchInput: { borderColor: colors.orangeBorder, borderRadius: radii.md, borderWidth: 1, color: colors.textDark, fontSize: 14, marginBottom: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  verseList: { gap: spacing.sm },
  verseCard: { borderColor: colors.cardBorder, borderRadius: radii.md, borderWidth: 1, padding: spacing.md },
  verseCardSelected: { backgroundColor: colors.orangeLight, borderColor: colors.orange },
  verseCardHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  reference: { color: colors.orangeDark, fontSize: 14, fontWeight: '800' },
  referenceSelected: { color: colors.orange },
  verseText: { color: colors.textMuted, fontSize: 13, lineHeight: 20, marginTop: 6 },
  empty: { color: colors.textMuted, fontSize: 13, paddingVertical: spacing.md },
  message: { color: colors.successText, fontSize: 13, fontWeight: '700', marginBottom: spacing.md, marginTop: spacing.md },
  ebooksLink: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl, padding: spacing.sm },
  ebooksText: { color: colors.textMuted, fontSize: 13, fontWeight: '700', marginLeft: spacing.sm },
});