import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { useActionSheet } from '@/components/ActionSheet';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import type { ProgrammeItem } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

export default function AdminProgrammeScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-programme'],
    queryFn: async () => (await api.get<{ data: ProgrammeItem[] } | ProgrammeItem[]>('/admin/programme')).data,
  });

  const items = Array.isArray(data) ? data : data?.data ?? [];
  const { show, sheet } = useActionSheet();

  const onDelete = (item: ProgrammeItem) => {
    show('Supprimer cet élément du programme ?', `${item.jour} — ${item.titre}`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/programme/${item.id}`);
            queryClient.invalidateQueries({ queryKey: ['admin-programme'] });
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
        title="Programme de la semaine"
        subtitle="Horaires des cultes et activités"
        actionLabel="+ Ajouter"
        onAction={() => router.push('/(admin)/programme/creer' as never)}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={colors.orange} />
        ) : items.length === 0 ? (
          <Text style={styles.empty}>Aucun élément de programme.</Text>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.day}>{item.jour}</Text>
              <Text style={styles.title}>{item.titre}</Text>
              <Text style={styles.horaires}>{item.horaires}</Text>
              <PillButton title="Supprimer" variant="danger" style={{ marginTop: spacing.md }} onPress={() => onDelete(item)} />
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
  day: { fontSize: 11, fontWeight: '800', color: colors.orange, textTransform: 'uppercase', marginBottom: 4 },
  title: { fontSize: 15, fontWeight: '800', color: colors.textDark },
  horaires: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
});
