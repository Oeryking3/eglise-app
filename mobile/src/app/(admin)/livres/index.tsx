import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { useActionSheet } from '@/components/ActionSheet';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import type { Livre } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

export default function AdminLivresScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-livres'],
    queryFn: async () => (await api.get<{ data: Livre[] } | Livre[]>('/admin/livres')).data,
  });

  const livres = Array.isArray(data) ? data : data?.data ?? [];
  const { show, sheet } = useActionSheet();

  const onDelete = (livre: Livre) => {
    show('Supprimer ce livre ?', livre.titre, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/livres/${livre.id}`);
            queryClient.invalidateQueries({ queryKey: ['admin-livres'] });
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
        title="Livres PDF"
        subtitle="Guides téléchargeables après paiement"
        actionLabel="+ Ajouter"
        onAction={() => router.push('/(admin)/livres/creer')}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={colors.orange} />
        ) : livres.length === 0 ? (
          <Text style={styles.empty}>Aucun livre.</Text>
        ) : (
          livres.map((livre) => (
            <View key={livre.id} style={styles.card}>
              <Text style={styles.title}>{livre.titre}</Text>
              {livre.description ? <Text style={styles.description}>{livre.description}</Text> : null}
              <Text style={styles.price}>{livre.prix.toLocaleString('fr-FR')} FCFA</Text>
              <View style={styles.actions}>
                <PillButton
                  title="Voir le PDF"
                  variant="outline"
                  style={styles.actionBtn}
                  onPress={() => livre.fichier_url && Linking.openURL(livre.fichier_url)}
                />
                <PillButton title="Supprimer" variant="danger" style={styles.actionBtn} onPress={() => onDelete(livre)} />
              </View>
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
  price: { fontSize: 13, fontWeight: '800', color: colors.orange, marginTop: 6 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  actionBtn: { flex: 1, paddingVertical: 10 },
});
