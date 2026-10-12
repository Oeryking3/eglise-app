import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { FormGroup } from '@/components/FormGroup';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import type { Livre } from '@/lib/types';
import { colors, spacing } from '@/theme/tokens';

export default function AdminLivreModifierScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-livres'],
    queryFn: async () => (await api.get<{ data: Livre[] } | Livre[]>('/admin/livres')).data,
  });
  const livres = Array.isArray(data) ? data : data?.data ?? [];
  const livre = livres.find((item) => String(item.id) === id);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Modifier le livre" actionLabel="Retour" onAction={() => router.back()} />
      {isLoading || !livre ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.orange} />
      ) : (
        <EditLivreForm key={livre.id} id={id} livre={livre} />
      )}
    </View>
  );
}

function EditLivreForm({ id, livre }: { id: string; livre: Livre }) {
  const queryClient = useQueryClient();
  const [titre, setTitre] = useState(livre.titre);
  const [description, setDescription] = useState(livre.description ?? '');
  const [prix, setPrix] = useState(String(livre.prix));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!prix || !Number.isInteger(Number(prix)) || Number(prix) <= 0) {
      setError('Indique un prix valide.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api.put(`/admin/livres/${id}`, { titre, description, prix: Number(prix) });
      await queryClient.invalidateQueries({ queryKey: ['admin-livres'] });
      router.replace('/(admin)/livres');
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <FormGroup label="Titre" value={titre} onChangeText={setTitre} />
      <FormGroup label="Description" value={description} onChangeText={setDescription} multiline />
      <FormGroup label="Prix (FCFA)" value={prix} onChangeText={setPrix} keyboardType="numeric" />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PillButton title="Enregistrer les modifications" onPress={submit} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 60 },
  error: { color: colors.error, fontSize: 13, marginBottom: spacing.lg, fontWeight: '700' },
});