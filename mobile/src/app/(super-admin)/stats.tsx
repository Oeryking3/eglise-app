import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { StatCard } from '@/components/StatCard';
import { api } from '@/lib/api';
import type { GlobalStats } from '@/lib/types';
import { colors, spacing } from '@/theme/tokens';

export default function SuperAdminStatsScreen() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['super-admin-stats'],
    queryFn: async () => (await api.get<GlobalStats>('/super-admin/stats')).data,
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Statistiques" subtitle="Toutes les églises confondues" />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading || !stats ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={colors.orange} />
        ) : (
          <>
            <View style={styles.grid}>
              <StatCard label="Membres" value={String(stats.membres)} />
              <StatCard label="Événements" value={String(stats.evenements)} />
              <StatCard label="Paiements réussis" value={String(stats.paiements)} />
              <StatCard label="Revenus (FCFA)" value={stats.revenus.toLocaleString('fr-FR')} />
            </View>

            <Text style={styles.sectionTitle}>Églises</Text>
            <View style={styles.grid}>
              <StatCard label="Total" value={String(stats.eglises.total)} />
              <StatCard label="Actives" value={String(stats.eglises.active)} />
              <StatCard label="En attente" value={String(stats.eglises.en_attente)} />
              <StatCard label="Désactivées" value={String(stats.eglises.desactivee)} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingTop: 0, paddingBottom: 80 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: colors.textDark, marginTop: spacing.lg, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
});
