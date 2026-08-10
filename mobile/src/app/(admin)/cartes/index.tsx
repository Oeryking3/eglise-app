import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { useActionSheet } from '@/components/ActionSheet';
import { Badge } from '@/components/Badge';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import type { Paginated, User } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

function cardStatus(user: User): { label: string; tone: 'success' | 'failed' | 'pending' } {
  if (!user.carte_membre) return { label: 'Aucune carte', tone: 'pending' };
  if (user.carte_est_valide) return { label: 'Active', tone: 'success' };
  return { label: 'Expirée', tone: 'failed' };
}

export default function AdminCartesScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-cartes'],
    queryFn: async () => (await api.get<Paginated<User>>('/admin/cartes')).data,
  });

  const members = data?.data ?? [];
  const { show, sheet } = useActionSheet();

  const onRevoke = (member: User) => {
    show('Supprimer la carte ?', `${member.prenom} ${member.nom}`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/cartes/${member.id}`);
            queryClient.invalidateQueries({ queryKey: ['admin-cartes'] });
          } catch (e) {
            Alert.alert('Erreur', extractErrorMessage(e));
          }
        },
      },
    ]);
  };

  const onActivate = async (member: User) => {
    try {
      await api.post(`/admin/cartes/${member.id}/activer`);
      queryClient.invalidateQueries({ queryKey: ['admin-cartes'] });
    } catch (e) {
      Alert.alert('Erreur', extractErrorMessage(e));
    }
  };

  const onDeactivate = async (member: User) => {
    try {
      await api.post(`/admin/cartes/${member.id}/desactiver`);
      queryClient.invalidateQueries({ queryKey: ['admin-cartes'] });
    } catch (e) {
      Alert.alert('Erreur', extractErrorMessage(e));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader
        title="Cartes de membre"
        actionLabel="Importer"
        onAction={() => router.push('/(admin)/cartes/import')}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={colors.orange} />
        ) : members.length === 0 ? (
          <Text style={styles.empty}>Aucun membre.</Text>
        ) : (
          members.map((m) => {
            const status = cardStatus(m);
            return (
              <View key={m.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.title}>{m.prenom} {m.nom}</Text>
                  <Badge label={status.label} tone={status.tone} />
                </View>
                <Text style={styles.meta}>{m.email}</Text>
                <View style={styles.actions}>
                  <PillButton
                    title="Gérer la carte"
                    variant="outline"
                    style={styles.actionBtn}
                    onPress={() => router.push(`/(admin)/cartes/${m.id}/modifier`)}
                  />
                  {m.carte_membre ? (
                    <PillButton
                      title="Désactiver"
                      variant="outline"
                      style={styles.actionBtn}
                      onPress={() => onDeactivate(m)}
                    />
                  ) : (
                    <PillButton
                      title="Activer"
                      variant="primary"
                      style={styles.actionBtn}
                      onPress={() => onActivate(m)}
                    />
                  )}
                  {m.carte_membre ? (
                    <PillButton
                      title="Supprimer la carte"
                      variant="danger"
                      style={styles.actionBtn}
                      onPress={() => onRevoke(m)}
                    />
                  ) : null}
                </View>
              </View>
            );
          })
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
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 15, fontWeight: '800', color: colors.textDark },
  meta: { fontSize: 12, color: colors.textLight, marginTop: 4 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  actionBtn: { flex: 1, paddingVertical: 10 },
});
