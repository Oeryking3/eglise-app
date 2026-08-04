import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { HeaderWithBack } from '@/components/HeaderWithBack';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/format';
import type { CardBenefit, User } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

type CardResponse = {
  user: User;
  benefits: { data: CardBenefit[] } | CardBenefit[];
};

export default function CarteScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['carte'],
    queryFn: async () => (await api.get<CardResponse>('/carte')).data,
  });

  const benefits = data ? (Array.isArray(data.benefits) ? data.benefits : data.benefits.data) : [];
  const user = data?.user;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderWithBack title="Ma carte de membre" backTo="/(member)/accueil" />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading || !user ? (
          <ActivityIndicator style={{ marginTop: 40 }} color={colors.orange} />
        ) : user.carte_est_valide ? (
          <>
            <View style={styles.card}>
              <Text style={styles.cardBadge}>CARTE DE MEMBRE</Text>
              {user.groupe_sanguin ? (
                <View style={styles.bloodChip}>
                  <Text style={styles.bloodChipText}>{user.groupe_sanguin}</Text>
                </View>
              ) : null}
              <View style={styles.cardBody}>
                {user.carte_photo_url ? (
                  <Image source={{ uri: user.carte_photo_url }} style={styles.photo} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoInitials}>
                      {user.prenom[0]}
                      {user.nom[0]}
                    </Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Row label="Nom" value={user.nom} />
                  <Row label="Prénom" value={user.prenom} />
                  <Row label="Date de naissance" value={formatDate(user.date_naissance)} />
                  <Row label="Sexe" value={user.sexe ?? '—'} />
                  <Row label="Lieu de résidence" value={user.lieu_residence ?? '—'} />
                  <Row label="Église" value={user.eglise_nom?.toUpperCase() ?? '—'} />
                </View>
              </View>
              {user.carte_expiration ? (
                <Text style={styles.footer}>Valide jusqu'au {formatDate(user.carte_expiration)}</Text>
              ) : null}
            </View>

            <Text style={styles.sectionTitle}>Tes avantages</Text>
            {benefits.length === 0 ? (
              <Text style={styles.empty}>Aucun avantage pour le moment.</Text>
            ) : (
              benefits.map((b) => (
                <View key={b.id} style={styles.benefitCard}>
                  <Text style={styles.benefitTitle}>{b.titre}</Text>
                  {b.description ? <Text style={styles.benefitDesc}>{b.description}</Text> : null}
                </View>
              ))
            )}
          </>
        ) : (
          <View style={styles.inactive}>
            <Text style={styles.inactiveTitle}>{user.eglise_nom ?? 'Église'}</Text>
            <Text style={styles.inactiveStatus}>
              {!user.carte_membre
                ? 'Carte non activée'
                : user.carte_expiration
                  ? `Carte expirée le ${formatDate(user.carte_expiration)}`
                  : 'Carte désactivée'}
            </Text>
            <Text style={styles.inactiveHint}>
              Contacte un administrateur de l'église pour activer ou renouveler ta carte de membre.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 60 },
  card: {
    backgroundColor: colors.orangeLight,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.orangeBorder,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.orangeDark,
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    marginBottom: spacing.md,
  },
  bloodChip: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.orangeDark,
    borderRadius: radii.pill,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodChipText: { color: '#fff', fontWeight: '800', fontSize: 11 },
  cardBody: { flexDirection: 'row', gap: spacing.lg },
  photo: { width: 72, height: 72, borderRadius: radii.md, backgroundColor: '#fff' },
  photoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: radii.md,
    backgroundColor: colors.orangeDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoInitials: { color: '#fff', fontWeight: '800', fontSize: 20 },
  row: { marginBottom: 4 },
  rowLabel: { fontSize: 9, color: colors.textLight, textTransform: 'uppercase', fontWeight: '700' },
  rowValue: { fontSize: 12, color: colors.textDark, fontWeight: '600' },
  footer: {
    marginTop: spacing.md,
    fontSize: 11,
    color: colors.orangeDark,
    fontWeight: '700',
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.textDark, marginBottom: spacing.md },
  empty: { fontSize: 13, color: colors.textFaint },
  benefitCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  benefitTitle: { fontWeight: '700', fontSize: 13, color: colors.textDark },
  benefitDesc: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  inactive: {
    backgroundColor: '#eee',
    borderRadius: radii.xl,
    padding: spacing.xxl,
    alignItems: 'center',
  },
  inactiveTitle: { fontWeight: '800', fontSize: 16, color: colors.textDark, marginBottom: spacing.md },
  inactiveStatus: { fontWeight: '700', fontSize: 14, color: colors.error, marginBottom: spacing.md },
  inactiveHint: { fontSize: 12, color: colors.textLight, textAlign: 'center', lineHeight: 18 },
});
