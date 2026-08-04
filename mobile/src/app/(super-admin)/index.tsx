import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { useActionSheet } from '@/components/ActionSheet';
import { Badge } from '@/components/Badge';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { Eglise } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

const STATUT_BADGE = {
  active: { label: 'Active', tone: 'success' as const },
  en_attente: { label: 'En attente', tone: 'pending' as const },
  desactivee: { label: 'Désactivée', tone: 'failed' as const },
  refusee: { label: 'Refusée', tone: 'failed' as const },
};

export default function SuperAdminEglisesScreen() {
  const { setActiveEglise } = useAuth();
  const queryClient = useQueryClient();
  const { show, sheet } = useActionSheet();
  const { data: eglises, isLoading } = useQuery({
    queryKey: ['super-admin-eglises'],
    queryFn: async () => (await api.get<{ data: Eglise[] }>('/super-admin/eglises')).data.data,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['super-admin-eglises'] });

  const onGerer = async (eglise: Eglise) => {
    await setActiveEglise(eglise.id);
    router.push('/(admin)');
  };

  const onDeactivate = (eglise: Eglise) => {
    show('Désactiver cette église ?', `${eglise.nom} — ses membres et son admin ne pourront plus se connecter.`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Désactiver',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.post(`/super-admin/eglises/${eglise.id}/desactiver`);
            refresh();
          } catch (e) {
            show('Erreur', extractErrorMessage(e), [{ text: 'OK' }]);
          }
        },
      },
    ]);
  };

  const onReactivate = async (eglise: Eglise) => {
    try {
      await api.post(`/super-admin/eglises/${eglise.id}/reactiver`);
      refresh();
    } catch (e) {
      show('Erreur', extractErrorMessage(e), [{ text: 'OK' }]);
    }
  };

  const onDelete = (eglise: Eglise) => {
    show('Supprimer définitivement ?', `${eglise.nom} — toutes ses données (membres, événements, paiements...) seront perdues. Action irréversible.`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/super-admin/eglises/${eglise.id}`);
            refresh();
          } catch (e) {
            show('Erreur', extractErrorMessage(e), [{ text: 'OK' }]);
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Églises" subtitle="Vue d'ensemble de toutes les églises" />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={colors.orange} />
        ) : !eglises || eglises.length === 0 ? (
          <Text style={styles.empty}>Aucune église.</Text>
        ) : (
          eglises.map((e) => {
            const badge = STATUT_BADGE[e.statut];
            return (
              <View key={e.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.title}>{e.nom}</Text>
                  <Badge label={badge.label} tone={badge.tone} />
                </View>
                <Text style={styles.meta}>
                  Code {e.code}
                  {e.ville ? ` · ${e.ville}` : ''}
                </Text>
                <View style={styles.actions}>
                  {e.statut === 'active' ? (
                    <>
                      <PillButton title="Gérer" variant="outline" style={styles.actionBtn} onPress={() => onGerer(e)} />
                      <PillButton title="Désactiver" variant="danger" style={styles.actionBtn} onPress={() => onDeactivate(e)} />
                    </>
                  ) : null}
                  {e.statut === 'desactivee' ? (
                    <PillButton title="Réactiver" variant="outline" style={styles.actionBtn} onPress={() => onReactivate(e)} />
                  ) : null}
                  {e.statut !== 'en_attente' ? (
                    <PillButton title="Supprimer" variant="danger" style={styles.actionBtn} onPress={() => onDelete(e)} />
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
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  actionBtn: { flexGrow: 1, paddingVertical: 10 },
});
