import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Platform, Pressable, SafeAreaView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { HeaderWithBack } from '@/components/HeaderWithBack';
import { useAuth } from '@/lib/auth-context';
import { getItem, setItem } from '@/lib/storage';
import { colors, radii, spacing } from '@/theme/tokens';

export default function NotesScreen() {
  const { user } = useAuth();
  const noteKey = user ? `eglise_member_note_${user.id}` : null;
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!noteKey) return;
    getItem(noteKey).then((value) => {
      if (!value) return;
      try {
        const storedNotes = JSON.parse(value);
        if (Array.isArray(storedNotes)) {
          setNotes(storedNotes.filter((item): item is string => typeof item === 'string' && item.trim().length > 0));
          return;
        }
      } catch {
        // Migrate the previous single-note format below.
      }
      setNotes([value]);
    });
  }, [noteKey]);

  const saveNote = async () => {
    if (!noteKey) return;
    const value = note.trim();
    if (!value) return;
    const nextNotes = [...notes, value];
    await setItem(noteKey, JSON.stringify(nextNotes));
    setNotes(nextNotes);
    setNote('');
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const downloadNote = async (value: string, index: number) => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `note-personnelle-${index + 1}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }
    await Share.share({ message: value, title: 'Mes notes personnelles' });
  };

  const deleteNote = async (index: number) => {
    if (!noteKey) return;
    const nextNotes = notes.filter((_, noteIndex) => noteIndex !== index);
    await setItem(noteKey, JSON.stringify(nextNotes));
    setNotes(nextNotes);
  };

  return (
    <View style={styles.page}>
      <HeaderWithBack title="Mes notes personnelles" subtitle="Garde une pensée ou un rappel pour plus tard" backTo="/(member)/accueil" />
      <SafeAreaView style={styles.content}>
        <View style={styles.noteCard}>
          <View style={styles.iconWrap}>
            <Feather name="edit-3" size={20} color={colors.orange} />
          </View>
          <Text style={styles.title}>Mes notes personnelles</Text>
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
            <Text style={styles.buttonText}>{saved ? 'Note ajoutée' : 'Ajouter la note'}</Text>
          </Pressable>
        </View>
        {notes.length > 0 ? (
          <View style={styles.notesList}>
            <Text style={styles.listTitle}>Notes enregistrées</Text>
            {notes.map((value, index) => (
              <View key={`${index}-${value}`} style={styles.savedCard}>
                <View style={styles.savedHeader}>
                  <Text style={styles.savedTitle}>Note {index + 1}</Text>
                  <Feather name="check-circle" size={18} color={colors.successText} />
                </View>
                <Text style={styles.savedText}>{value}</Text>
                <View style={styles.noteActions}>
                  <Pressable style={styles.downloadButton} onPress={() => downloadNote(value, index)}>
                    <Feather name="download" size={17} color="#fff" />
                    <Text style={styles.buttonText}>Télécharger</Text>
                  </Pressable>
                  <Pressable style={styles.deleteButton} onPress={() => deleteNote(index)}>
                    <Feather name="trash-2" size={17} color={colors.error} />
                    <Text style={styles.deleteText}>Supprimer</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ) : null}
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
  savedCard: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  notesList: { marginTop: spacing.xl },
  listTitle: { color: colors.textDark, fontSize: 18, fontWeight: '800', marginBottom: spacing.md },
  savedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  savedTitle: { color: colors.textDark, fontSize: 16, fontWeight: '800' },
  savedText: { color: colors.textMuted, fontSize: 14, lineHeight: 21, marginTop: spacing.md },
  downloadButton: {
    alignItems: 'center',
    backgroundColor: colors.orangeDark,
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    flex: 1,
    paddingVertical: spacing.md,
  },
  noteActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  deleteButton: {
    alignItems: 'center',
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  deleteText: { color: colors.error, fontSize: 13, fontWeight: '800' },
});