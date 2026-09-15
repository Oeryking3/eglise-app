import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { HeaderWithBack } from '@/components/HeaderWithBack';
import { useAuth } from '@/lib/auth-context';
import { getItem, setItem } from '@/lib/storage';
import { colors, radii, spacing } from '@/theme/tokens';

export default function NotesScreen() {
  const { user } = useAuth();
  const noteKey = user ? `eglise_member_note_${user.id}` : null;
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!noteKey) return;
    getItem(noteKey).then((value) => setNote(value ?? ''));
  }, [noteKey]);

  const saveNote = async () => {
    if (!noteKey) return;
    await setItem(noteKey, note.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <View style={styles.page}>
      <HeaderWithBack title="Mes notes" subtitle="Garde une pensée ou un rappel pour plus tard" backTo="/(member)/accueil" />
      <SafeAreaView style={styles.content}>
        <View style={styles.noteCard}>
          <View style={styles.iconWrap}>
            <Feather name="edit-3" size={20} color={colors.orange} />
          </View>
          <Text style={styles.title}>Ma note personnelle</Text>
          <Text style={styles.description}>Écris ici ce que tu veux conserver pour plus tard.</Text>
          <TextInput
            value={note}
            onChangeText={(value) => {
              setNote(value);
              setSaved(false);
            }}
            placeholder="Écris ta note..."
            placeholderTextColor={colors.textPlaceholder}
            multiline
            textAlignVertical="top"
            style={styles.input}
          />
          <Pressable style={styles.button} onPress={saveNote}>
            <Text style={styles.buttonText}>{saved ? 'Note enregistrée' : 'Enregistrer la note'}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: spacing.xl },
  noteCard: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    backgroundColor: colors.orangeLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: { color: colors.textDark, fontSize: 18, fontWeight: '800' },
  description: { color: colors.textMuted, fontSize: 13, lineHeight: 19, marginTop: spacing.xs, marginBottom: spacing.lg },
  input: {
    minHeight: 190,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    padding: spacing.md,
    color: colors.textDark,
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.orange,
    borderRadius: radii.md,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});