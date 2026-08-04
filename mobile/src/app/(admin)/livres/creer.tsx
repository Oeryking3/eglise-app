import { useQueryClient } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { FormGroup } from '@/components/FormGroup';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import { colors, spacing } from '@/theme/tokens';

export default function AdminLivreCreerScreen() {
  const queryClient = useQueryClient();
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (!result.canceled && result.assets[0]) {
      setFile(result.assets[0]);
    }
  };

  const submit = async () => {
    if (!file) {
      setError('Choisis un fichier PDF.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append('titre', titre);
      form.append('description', description);
      form.append('fichier', {
        uri: file.uri,
        name: file.name ?? 'document.pdf',
        type: 'application/pdf',
      } as unknown as Blob);

      await api.post('/admin/livres', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      queryClient.invalidateQueries({ queryKey: ['admin-livres'] });
      router.replace('/(admin)/livres');
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Ajouter un livre" actionLabel="Retour" onAction={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <FormGroup label="Titre" value={titre} onChangeText={setTitre} />
        <FormGroup label="Description" value={description} onChangeText={setDescription} multiline />

        <Text style={styles.label}>Fichier PDF</Text>
        <PillButton
          title={file ? file.name ?? 'Fichier sélectionné' : 'Choisir un fichier PDF'}
          variant="outline"
          onPress={pickFile}
          style={{ marginBottom: spacing.lg }}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PillButton title="Ajouter le livre" onPress={submit} loading={loading} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 60 },
  label: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginBottom: 6 },
  error: { color: colors.error, fontSize: 13, marginBottom: spacing.lg, fontWeight: '700' },
});
