import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { useActionSheet } from '@/components/ActionSheet';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import type { CardBenefit } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

export default function AdminAvantagesScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-avantages'],
    queryFn: async () => (await api.get<{ data: CardBenefit[] } | CardBenefit[]>('/admin/avantages')).data,
  });

  const benefits = Array.isArray(data) ? data : data?.data ?? [];
  const { show, sheet } = useActionSheet();

  const onDelete = (benefit: CardBenefit) => {
    show('Supprimer cet avantage ?', benefit.titre, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/avantages/${benefit.id}`);
            queryClient.invalidateQueries({ queryKey: ['admin-avantages'] });
          } catch (e) {
            Alert.alert('Erreur', extractErrorMessage(e));
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader
        title="Avantages de la carte"
        actionLabel="+ Ajouter"
        onAction={() => router.push('/(admin)/avantages/creer')}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={colors.orange} />
        ) : benefits.length === 0 ? (
          <Text style={styles.empty}>Aucun avantage.</Text>
        ) : (
          benefits.map((b) => (
            <View key={b.id} style={styles.card}>
              <Text style={styles.title}>{b.titre}</Text>
              {b.description ? <Text style={styles.description}>{b.description}</Text> : null}
              <PillButton title="Supprimer" variant="danger" style={{ marginTop: spacing.md }} onPress={() => onDelete(b)} />
            </View>
          ))
        )}
      </ScrollView>
      {sheet}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingTop: 0, paddingBottom: 80 },
  empty: { fontSize: 13, color: colors.textFaint },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  title: { fontSize: 15, fontWeight: '800', color: colors.textDark },
  description: { fontSize: 13, color: colors.textMuted, marginTop: 6 },
});
