import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { useActionSheet } from '@/components/ActionSheet';
import { FormCheck, FormGroup } from '@/components/FormGroup';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import type { LiveStream, LiveStreamLog } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

type DirectResponse = {
  live_stream: LiveStream;
  historique: { data: LiveStreamLog[] } | LiveStreamLog[];
};

function unwrap<T>(value: { data: T[] } | T[]): T[] {
  return Array.isArray(value) ? value : value.data;
}

export default function AdminDirectScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-direct'],
    queryFn: async () => (await api.get<DirectResponse>('/admin/direct')).data,
  });
  const { show, sheet } = useActionSheet();

  const [url, setUrl] = useState('');
  const [actif, setActif] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setUrl(data.live_stream.url ?? '');
      setActif(data.live_stream.actif);
    }
  }, [data]);

  const historique = data ? unwrap(data.historique) : [];

  const save = async (payload: { url: string; actif: boolean }) => {
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      await api.put('/admin/direct', payload);
      queryClient.invalidateQueries({ queryKey: ['admin-direct'] });
      setUrl(payload.url);
      setActif(payload.actif);
      setSuccess(true);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const submit = () => save({ url, actif });

  const onSupprimer = () => {
    show('Supprimer le direct actuel ?', 'Le lien sera retiré et le direct désactivé.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => save({ url: '', actif: false }) },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Direct de l'église" subtitle="Configure le lien du live en cours" />
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.orange} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <FormGroup
            label="Lien du direct"
            value={url}
            onChangeText={setUrl}
            placeholder="youtube.com/live/..."
            autoCapitalize="none"
          />
          <FormCheck label="Le direct est actuellement en cours" value={actif} onValueChange={setActif} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>Enregistré avec succès.</Text> : null}
          <PillButton title="Enregistrer" onPress={submit} loading={loading} />

          {url || actif ? (
            <PillButton
              title="Supprimer le direct actuel"
              variant="danger"
              style={{ marginTop: spacing.md }}
              onPress={onSupprimer}
            />
          ) : null}

          <Text style={[styles.sectionTitle, { marginTop: spacing.xxl }]}>Historique</Text>
          {historique.length === 0 ? (
            <Text style={styles.empty}>Aucun direct enregistré pour le moment.</Text>
          ) : (
            historique.map((h) => (
              <View key={h.id} style={styles.historyCard}>
                <Text style={styles.historyUrl} numberOfLines={1}>{h.url}</Text>
                <Text style={styles.historyMeta}>
                  {formatDateTime(h.started_at)}
                  {h.ended_at ? ` → ${formatDateTime(h.ended_at)}` : ' · En cours'}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
      {sheet}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 60 },
  error: { color: colors.error, fontSize: 13, marginBottom: spacing.lg, fontWeight: '700' },
  success: { color: colors.successText, fontSize: 13, marginBottom: spacing.lg, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.textDark, marginBottom: spacing.md },
  empty: { fontSize: 13, color: colors.textFaint },
  historyCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  historyUrl: { fontSize: 13, fontWeight: '700', color: colors.textDark },
  historyMeta: { fontSize: 12, color: colors.textLight, marginTop: 4 },
});
