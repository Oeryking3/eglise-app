import { useQueryClient } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import { colors, radii, spacing } from '@/theme/tokens';

type ImportError = { ligne: number; email?: string; message: string };
type ImportResult = { imported: number; pending: number; errors: ImportError[] };

export default function AdminCartesImportScreen() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ['text/csv', 'text/comma-separated-values', 'text/plain'],
      copyToCacheDirectory: true,
    });
    if (!res.canceled && res.assets[0]) {
      setFile(res.assets[0]);
      setResult(null);
      setError(null);
    }
  };

  const onImport = async () => {
    if (!file) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const form = new FormData();
      const webFile = (file as unknown as { file?: Blob }).file;
      if (Platform.OS === 'web' && webFile) {
        form.append('file', webFile, file.name);
      } else {
        form.append('file', { uri: file.uri, name: file.name, type: file.mimeType ?? 'text/csv' } as unknown as Blob);
      }

      const { data } = await api.post<ImportResult>('/admin/cartes/import', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ['admin-cartes'] });
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Importer des cartes" actionLabel="Retour" onAction={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hint}>
          <Text style={styles.hintTitle}>Format attendu (fichier CSV)</Text>
          <Text style={styles.hintText}>
            Colonnes : email, date_naissance (AAAA-MM-JJ), sexe (M/F), groupe_sanguin, carte_expiration (AAAA-MM-JJ).{'\n'}
            Si la personne a déjà un compte, sa carte est activée immédiatement. Sinon, ses infos sont gardées en
            attente : sa carte s'activera automatiquement dès qu'elle s'inscrira avec cet email.
          </Text>
        </View>

        <PillButton
          title={file ? file.name : 'Choisir un fichier CSV'}
          variant="outline"
          onPress={pickFile}
          style={{ marginBottom: spacing.lg }}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {result ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>{result.imported} carte(s) mise(s) à jour</Text>
            {result.pending > 0 ? (
              <Text style={styles.resultSubtitle}>
                {result.pending} en attente d'inscription (activation automatique dès que la personne s'inscrit)
              </Text>
            ) : null}
            {result.errors.length > 0 ? (
              <>
                <Text style={styles.resultSubtitle}>{result.errors.length} ligne(s) ignorée(s) :</Text>
                {result.errors.map((e, i) => (
                  <Text key={i} style={styles.errorLine}>
                    Ligne {e.ligne}{e.email ? ` (${e.email})` : ''} — {e.message}
                  </Text>
                ))}
              </>
            ) : null}
          </View>
        ) : null}

        <PillButton title="Importer" onPress={onImport} loading={loading} disabled={!file} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 60 },
  hint: {
    backgroundColor: colors.orangeLight,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  hintTitle: { fontSize: 13, fontWeight: '800', color: colors.orangeDark, marginBottom: 6 },
  hintText: { fontSize: 12, color: colors.textMuted, lineHeight: 18 },
  error: { color: colors.error, fontSize: 13, fontWeight: '700', marginBottom: spacing.md },
  resultBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  resultTitle: { fontSize: 14, fontWeight: '800', color: colors.textDark, marginBottom: 4 },
  resultSubtitle: { fontSize: 12, fontWeight: '700', color: colors.textMuted, marginTop: spacing.sm, marginBottom: 4 },
  errorLine: { fontSize: 11, color: colors.error, marginBottom: 2 },
});
