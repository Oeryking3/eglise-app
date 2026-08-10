import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CardPattern } from '@/components/CardPattern';
import { HeaderWithBack } from '@/components/HeaderWithBack';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { useThemeColors } from '@/lib/theme-context';
import type { CardBenefit, User } from '@/lib/types';
import { colors as staticColors, radii, spacing } from '@/theme/tokens';

type CardResponse = {
  user: User;
  benefits: { data: CardBenefit[] } | CardBenefit[];
};

export default function CarteScreen() {
  const colors = useThemeColors();
  const { data, isLoading } = useQuery({
    queryKey: ['carte'],
    queryFn: async () => (await api.get<CardResponse>('/carte')).data,
  });

  const benefits = data ? (Array.isArray(data.benefits) ? data.benefits : data.benefits.data) : [];
  const user = data?.user;
  const showAvantages = user?.eglise_features.avantages ?? true;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderWithBack title="Ma carte de membre" backTo="/(member)/accueil" />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading || !user ? (
          <ActivityIndicator style={{ marginTop: 40 }} color={colors.orange} />
        ) : (
          <>
            <Card user={user} colors={colors} />

            {!user.carte_est_valide ? (
              <Text style={styles.inactiveHint}>
                {!user.carte_membre
                  ? 'Ta carte n\'a pas encore été activée.'
                  : user.carte_expiration
                    ? `Ta carte a expiré le ${formatDate(user.carte_expiration)}.`
                    : 'Ta carte a été désactivée.'}{' '}
                Contacte un administrateur de l'église pour l'activer ou la renouveler.
              </Text>
            ) : null}

            {user.carte_est_valide && showAvantages ? (
              <>
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
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const PLACEHOLDER = '...';

function Card({ user, colors }: { user: User; colors: ReturnType<typeof useThemeColors> }) {
  const active = user.carte_est_valide;

  return (
    <View style={styles.card}>
      <CardPattern />

      <Text style={[styles.cardBadge, { backgroundColor: colors.orange }]}>CARTE DE MEMBRE</Text>

      {active && user.groupe_sanguin ? (
        <View style={[styles.bloodChip, { backgroundColor: colors.orange }]}>
          <Text style={styles.bloodChipText}>{user.groupe_sanguin}</Text>
        </View>
      ) : null}

      <View style={styles.cardBody}>
        {active && user.carte_photo_url ? (
          <Image source={{ uri: user.carte_photo_url }} style={styles.photo} />
        ) : (
          <View style={[styles.photoPlaceholder, { backgroundColor: colors.orangeDark }]}>
            <Text style={styles.photoInitials}>{active ? `${user.prenom[0]}${user.nom[0]}` : PLACEHOLDER}</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Row label="Nom" value={active ? user.nom : PLACEHOLDER} labelColor={colors.orange} valueColor={colors.orangeDark} />
          <Row label="Prénom" value={active ? user.prenom : PLACEHOLDER} labelColor={colors.orange} valueColor={colors.orangeDark} />
          <Row label="Date de naissance" value={active ? formatDate(user.date_naissance) : PLACEHOLDER} labelColor={colors.orange} valueColor={colors.orangeDark} />
          <Row label="Sexe" value={active ? user.sexe ?? '—' : PLACEHOLDER} labelColor={colors.orange} valueColor={colors.orangeDark} />
          <Row label="Lieu de résidence" value={active ? user.lieu_residence ?? '—' : PLACEHOLDER} labelColor={colors.orange} valueColor={colors.orangeDark} />
          <Row label="Église" value={active ? user.eglise_nom?.toUpperCase() ?? '—' : PLACEHOLDER} labelColor={colors.orange} valueColor={colors.orangeDark} />
        </View>
      </View>

      {active && user.carte_expiration ? (
        <Text style={[styles.footer, { color: colors.orangeDark }]}>Valide jusqu'au {formatDate(user.carte_expiration)}</Text>
      ) : null}
    </View>
  );
}

function Row({ label, value, labelColor, valueColor }: { label: string; value: string; labelColor: string; valueColor: string }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: labelColor }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 60 },
  card: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: radii.xl,
    padding: spacing.lg,
    paddingLeft: spacing.xl,
    paddingTop: spacing.xl,
    marginBottom: spacing.xl,
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
  },
  cardBadge: {
    alignSelf: 'center',
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.md,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  bloodChip: {
    position: 'absolute',
    top: 92,
    right: -8,
    borderRadius: radii.lg,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodChipText: { color: '#fff', fontWeight: '800', fontSize: 17 },
  cardBody: { flexDirection: 'row', gap: spacing.lg },
  photo: { width: 128, height: 158, borderRadius: radii.sm, backgroundColor: '#fff' },
  photoPlaceholder: {
    width: 128,
    height: 158,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoInitials: { color: '#fff', fontWeight: '800', fontSize: 26 },
  row: { marginBottom: 10 },
  rowLabel: { fontSize: 11, fontWeight: '500' },
  rowValue: { fontSize: 15, fontWeight: '800', marginTop: 1 },
  footer: {
    marginTop: spacing.md,
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: staticColors.textDark, marginBottom: spacing.md },
  empty: { fontSize: 13, color: staticColors.textFaint },
  benefitCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: staticColors.cardBorder,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  benefitTitle: { fontWeight: '700', fontSize: 13, color: staticColors.textDark },
  benefitDesc: { fontSize: 12, color: staticColors.textMuted, marginTop: 2 },
  inactiveHint: {
    fontSize: 12,
    color: staticColors.textLight,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: -spacing.md,
    marginBottom: spacing.xl,
  },
});
