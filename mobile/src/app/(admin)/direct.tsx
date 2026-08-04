import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { FormCheck, FormGroup } from '@/components/FormGroup';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import type { LiveStream } from '@/lib/types';
import { colors, spacing } from '@/theme/tokens';

export default function AdminDirectScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-direct'],
    queryFn: async () => (await api.get<LiveStream>('/admin/direct')).data,
  });

  const [url, setUrl] = useState('');
  const [actif, setActif] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setUrl(data.url ?? '');
      setActif(data.actif);
    }
  }, [data]);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      await api.put('/admin/direct', { url, actif });
      queryClient.invalidateQueries({ queryKey: ['admin-direct'] });
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
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
          <PillButton title="Enregistrer" onPress={submit} loading={loading} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 60 },
  error: { color: colors.error, fontSize: 13, marginBottom: spacing.lg, fontWeight: '700' },
});
