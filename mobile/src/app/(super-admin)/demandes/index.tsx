import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { PillButton } from '@/components/PillButton';
import { api } from '@/lib/api';
import type { Eglise, Paginated } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

export default function SuperAdminDemandesScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['super-admin-demandes'],
    queryFn: async () => (await api.get<Paginated<Eglise>>('/super-admin/demandes', { params: { statut: 'en_attente' } })).data,
  });

  const demandes = data?.data ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Demandes" subtitle="Espaces église en attente de validation" />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={colors.orange} />
        ) : demandes.length === 0 ? (
          <Text style={styles.empty}>Aucune demande en attente.</Text>
        ) : (
          demandes.map((d) => (
            <View key={d.id} style={styles.card}>
              <Text style={styles.title}>{d.nom}</Text>
              <Text style={styles.meta}>
                Code {d.code}
                {d.ville ? ` · ${d.ville}` : ''}
              </Text>
              <Text style={styles.meta}>{d.contact_nom} · {d.contact_email}</Text>
              <PillButton
                title="Examiner"
                variant="outline"
                style={styles.actionBtn}
                onPress={() =>
                  router.push({
                    pathname: '/(super-admin)/demandes/[id]',
                    params: {
                      id: String(d.id),
                      nom: d.nom,
                      code: d.code,
                      ville: d.ville ?? '',
                      contact_nom: d.contact_nom,
                      contact_email: d.contact_email,
                      contact_telephone: d.contact_telephone ?? '',
                    },
                  })
                }
              />
            </View>
          ))
        )}
      </ScrollView>
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
  actionBtn: { marginTop: spacing.md, paddingVertical: 10 },
});
