import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, router } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useActionSheet } from '@/components/ActionSheet';
import { HeaderWithBack } from '@/components/HeaderWithBack';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import { formatDateAndRange } from '@/lib/format';
import type { AgendaItem } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

export default function AgendaIndexScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['agenda'],
    queryFn: async () => (await api.get<{ data: AgendaItem[] } | AgendaItem[]>('/agenda')).data,
  });

  const items = Array.isArray(data) ? data : data?.data ?? [];
  const { show, sheet } = useActionSheet();

  const onDelete = (item: AgendaItem) => {
    show('Supprimer ce rappel ?', item.titre, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/agenda/${item.id}`);
            queryClient.invalidateQueries({ queryKey: ['agenda'] });
          } catch (e) {
            Alert.alert('Erreur', extractErrorMessage(e));
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderWithBack title="Mon agenda" subtitle="Tes rappels personnels" backTo="/(member)/accueil" />
      <ScrollView contentContainerStyle={styles.content}>
        <Link href="/(member)/agenda/creer" asChild>
          <PillButton title="+ Ajouter un rappel" style={{ marginBottom: spacing.lg }} />
        </Link>

        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={colors.orange} />
        ) : items.length === 0 ? (
          <Text style={styles.empty}>Aucun rappel pour le moment.</Text>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.title}>{item.titre}</Text>
              <Text style={styles.meta}>{formatDateAndRange(item.date_rappel, item.heure_rappel)}</Text>
              {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
              <View style={styles.actions}>
                <PillButton
                  title="Modifier"
                  variant="outline"
                  style={styles.actionBtn}
                  onPress={() => router.push(`/(member)/agenda/${item.id}/modifier`)}
                />
                <PillButton
                  title="Supprimer"
                  variant="danger"
                  style={styles.actionBtn}
                  onPress={() => onDelete(item)}
                />
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
  content: { padding: spacing.xl, paddingBottom: 60 },
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
  description: { fontSize: 13, color: colors.textMuted, marginTop: 8 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  actionBtn: { flex: 1, paddingVertical: 10 },
});
