import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { useActionSheet } from '@/components/ActionSheet';
import { Badge } from '@/components/Badge';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import { formatDateAndRange } from '@/lib/format';
import type { EventItem, Paginated } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

export default function AdminEvenementsScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-evenements'],
    queryFn: async () => (await api.get<Paginated<EventItem>>('/admin/evenements')).data,
  });

  const events = data?.data ?? [];
  const { show, sheet } = useActionSheet();

  const onDelete = (event: EventItem) => {
    show('Supprimer cet événement ?', event.titre, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/evenements/${event.id}`);
            queryClient.invalidateQueries({ queryKey: ['admin-evenements'] });
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
        title="Événements"
        subtitle="Gère les événements de l'église"
        actionLabel="+ Nouvel"
        onAction={() => router.push('/(admin)/evenements/creer')}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={colors.orange} />
        ) : events.length === 0 ? (
          <Text style={styles.empty}>Aucun événement.</Text>
        ) : (
          events.map((ev) => (
            <View key={ev.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.title}>{ev.titre}</Text>
                {ev.important ? <Badge label="Important" tone="important" /> : null}
              </View>
              <Text style={styles.meta}>{formatDateAndRange(ev.date_evenement, ev.heure_debut, ev.heure_fin)}</Text>
              {ev.description ? <Text style={styles.description}>{ev.description}</Text> : null}
              <View style={styles.actions}>
                <PillButton
                  title="Modifier"
                  variant="outline"
                  style={styles.actionBtn}
                  onPress={() => router.push(`/(admin)/evenements/${ev.id}/modifier`)}
                />
                <PillButton title="Supprimer" variant="danger" style={styles.actionBtn} onPress={() => onDelete(ev)} />
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
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm },
  title: { fontSize: 15, fontWeight: '800', color: colors.textDark, flex: 1 },
  meta: { fontSize: 12, color: colors.textLight, marginTop: 6 },
  description: { fontSize: 13, color: colors.textMuted, marginTop: 8 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  actionBtn: { flex: 1, paddingVertical: 10 },
});
