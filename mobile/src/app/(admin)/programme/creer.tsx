import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { FormGroup } from '@/components/FormGroup';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import { spacing } from '@/theme/tokens';

export default function AdminProgrammeCreerScreen() {
  const queryClient = useQueryClient();
  const [jour, setJour] = useState('');
  const [titre, setTitre] = useState('');
  const [horaires, setHoraires] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!jour || !titre || !horaires) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api.post('/admin/programme', { jour, titre, horaires });
      queryClient.invalidateQueries({ queryKey: ['admin-programme'] });
      router.replace('/(admin)/programme' as never);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Ajouter au programme" actionLabel="Retour" onAction={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <FormGroup label="Jour (ex : Dimanche)" value={jour} onChangeText={setJour} placeholder="Dimanche" />
        <FormGroup label="Activité" value={titre} onChangeText={setTitre} placeholder="Culte de toutes les possibilités" />
        <FormGroup label="Horaires" value={horaires} onChangeText={setHoraires} placeholder="08H00 - 11H00" />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PillButton title="Ajouter" onPress={submit} loading={loading} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 60 },
  error: { color: '#B5121B', fontSize: 13, marginBottom: spacing.lg, fontWeight: '700' },
});
