import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { useActionSheet } from '@/components/ActionSheet';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import type { ChurchNotification, Paginated } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

export default function AdminNotificationsScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => (await api.get<Paginated<ChurchNotification>>('/admin/notifications')).data,
  });

  const items = data?.data ?? [];
  const { show, sheet } = useActionSheet();

  const onDelete = (n: ChurchNotification) => {
    show('Supprimer cette notification ?', n.titre, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/notifications/${n.id}`);
            queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
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
        title="Notifications"
        actionLabel="+ Nouvelle"
        onAction={() => router.push('/(admin)/notifications/creer')}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={colors.orange} />
        ) : items.length === 0 ? (
          <Text style={styles.empty}>Aucune notification.</Text>
        ) : (
          items.map((n) => (
            <View key={n.id} style={styles.card}>
              <Text style={styles.title}>{n.titre}</Text>
              <Text style={styles.message} numberOfLines={2}>{n.message}</Text>
              <View style={styles.actions}>
                <PillButton
                  title="Modifier"
                  variant="outline"
                  style={styles.actionBtn}
                  onPress={() =>
                    router.push({
                      pathname: '/(admin)/notifications/[id]/modifier',
                      params: { id: String(n.id), titre: n.titre, message: n.message },
                    })
                  }
                />
                <PillButton title="Supprimer" variant="danger" style={styles.actionBtn} onPress={() => onDelete(n)} />
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
  message: { fontSize: 13, color: colors.textMuted, marginTop: 6 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  actionBtn: { flex: 1, paddingVertical: 10 },
});
