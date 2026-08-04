import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { useActionSheet } from '@/components/ActionSheet';
import { Badge } from '@/components/Badge';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { Paginated, User } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

export default function AdminMembresScreen() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-membres'],
    queryFn: async () => (await api.get<Paginated<User>>('/admin/membres')).data,
  });

  const members = data?.data ?? [];
  const { show, sheet } = useActionSheet();

  const onDelete = (member: User) => {
    show('Supprimer ce membre ?', `${member.prenom} ${member.nom}`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/membres/${member.id}`);
            queryClient.invalidateQueries({ queryKey: ['admin-membres'] });
          } catch (e) {
            Alert.alert('Erreur', extractErrorMessage(e));
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Membres" />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={colors.orange} />
        ) : members.length === 0 ? (
          <Text style={styles.empty}>Aucun membre.</Text>
        ) : (
          members.map((m) => (
            <View key={m.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.title}>{m.prenom} {m.nom}</Text>
                {m.role === 'admin_eglise' ? <Badge label="Admin" tone="success" /> : null}
              </View>
              <Text style={styles.meta}>{m.email}{m.lieu_residence ? ` · ${m.lieu_residence}` : ''}</Text>
              <View style={styles.actions}>
                <PillButton
                  title="Modifier"
                  variant="outline"
                  style={styles.actionBtn}
                  onPress={() =>
                    router.push({
                      pathname: '/(admin)/membres/[id]/modifier',
                      params: {
                        id: String(m.id),
                        nom: m.nom,
                        prenom: m.prenom,
                        email: m.email,
                        lieu_residence: m.lieu_residence ?? '',
                        role: m.role,
                      },
                    })
                  }
                />
                {currentUser?.id !== m.id ? (
                  <PillButton title="Supprimer" variant="danger" style={styles.actionBtn} onPress={() => onDelete(m)} />
                ) : null}
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
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 15, fontWeight: '800', color: colors.textDark },
  meta: { fontSize: 12, color: colors.textLight, marginTop: 4 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  actionBtn: { flex: 1, paddingVertical: 10 },
});
