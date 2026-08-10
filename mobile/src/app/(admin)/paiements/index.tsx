import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, ScrollView, StyleSheet, Text, View, ActivityIndicator, Pressable } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { useActionSheet } from '@/components/ActionSheet';
import { Badge } from '@/components/Badge';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import type { Paginated, Payment } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

const STATUS_TONE = { reussi: 'success', en_attente: 'pending', echoue: 'failed' } as const;
const STATUS_LABEL = { reussi: 'Réussi', en_attente: 'En attente', echoue: 'Échoué' } as const;

export default function AdminPaiementsScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-paiements'],
    queryFn: async () => (await api.get<Paginated<Payment>>('/admin/paiements')).data,
  });

  const payments = data?.data ?? [];
  const { show, sheet } = useActionSheet();

  const changeStatus = (payment: Payment) => {
    show('Changer le statut', payment.reference, [
      { text: 'En attente', onPress: () => updateStatus(payment.id, 'en_attente') },
      { text: 'Réussi', onPress: () => updateStatus(payment.id, 'reussi') },
      { text: 'Échoué', onPress: () => updateStatus(payment.id, 'echoue') },
      { text: 'Annuler', style: 'cancel' },
    ]);
  };

  const updateStatus = async (id: number, statut: Payment['statut']) => {
    try {
      await api.put(`/admin/paiements/${id}/statut`, { statut });
      queryClient.invalidateQueries({ queryKey: ['admin-paiements'] });
    } catch (e) {
      Alert.alert('Erreur', extractErrorMessage(e));
    }
  };

  const onDelete = (payment: Payment) => {
    show('Supprimer ce paiement ?', payment.reference, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/paiements/${payment.id}`);
            queryClient.invalidateQueries({ queryKey: ['admin-paiements'] });
          } catch (e) {
            Alert.alert('Erreur', extractErrorMessage(e));
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Paiements" />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={colors.orange} />
        ) : payments.length === 0 ? (
          <Text style={styles.empty}>Aucun paiement.</Text>
        ) : (
          payments.map((p) => (
            <View key={p.id} style={styles.card}>
              <Text style={styles.title}>{p.user ? `${p.user.prenom} ${p.user.nom}` : 'Membre inconnu'}</Text>
              <Text style={styles.meta}>
                {p.produit} · {p.montant.toLocaleString('fr-FR')} FCFA · {p.methode ? p.methode.toUpperCase() : 'Méthode non connue'}
              </Text>
              <Text style={styles.meta}>
                {formatDateTime(p.created_at)} · Réf: {p.reference}
              </Text>
              <Pressable onPress={() => changeStatus(p)} style={{ marginTop: spacing.sm, alignSelf: 'flex-start' }}>
                <Badge label={STATUS_LABEL[p.statut]} tone={STATUS_TONE[p.statut]} />
              </Pressable>
              <View style={styles.actions}>
                <PillButton title="Supprimer" variant="danger" style={styles.actionBtn} onPress={() => onDelete(p)} />
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
  meta: { fontSize: 12, color: colors.textLight, marginTop: 4 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  actionBtn: { flex: 1, paddingVertical: 10 },
});
