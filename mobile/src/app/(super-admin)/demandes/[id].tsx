import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { FormGroup } from '@/components/FormGroup';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import { colors, spacing } from '@/theme/tokens';

export default function SuperAdminDemandeDetailScreen() {
  const params = useLocalSearchParams<{
    id: string;
    nom: string;
    code: string;
    ville: string;
    contact_nom: string;
    contact_email: string;
    contact_telephone: string;
  }>();
  const queryClient = useQueryClient();

  const [code, setCode] = useState(params.code);
  const [motif, setMotif] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['super-admin-demandes'] });
    queryClient.invalidateQueries({ queryKey: ['super-admin-eglises'] });
  };

  const onApprove = async () => {
    setError(null);
    setLoading('approve');
    try {
      await api.post(`/super-admin/demandes/${params.id}/approuver`, { code });
      refresh();
      router.replace('/(super-admin)/demandes' as never);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(null);
    }
  };

  const onReject = async () => {
    setError(null);
    setLoading('reject');
    try {
      await api.post(`/super-admin/demandes/${params.id}/rejeter`, { motif: motif || undefined });
      refresh();
      router.replace('/(super-admin)/demandes' as never);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Examiner la demande" actionLabel="Retour" onAction={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>{params.nom}</Text>
        <Text style={styles.meta}>{params.contact_nom} · {params.contact_email}</Text>
        {params.contact_telephone ? <Text style={styles.meta}>{params.contact_telephone}</Text> : null}
        {params.ville ? <Text style={styles.meta}>{params.ville}</Text> : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <FormGroup label="Code de l'église" value={code} onChangeText={(v) => setCode(v.toUpperCase())} autoCapitalize="characters" />
        <PillButton title="Approuver" onPress={onApprove} loading={loading === 'approve'} style={{ marginBottom: spacing.xl }} />

        <Text style={styles.sectionTitle}>Ou refuser</Text>
        <FormGroup label="Motif (optionnel)" value={motif} onChangeText={setMotif} multiline />
        <PillButton title="Rejeter" variant="danger" onPress={onReject} loading={loading === 'reject'} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 80 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.textDark, marginBottom: 6 },
  meta: { fontSize: 13, color: colors.textLight, marginBottom: 4 },
  error: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
});
