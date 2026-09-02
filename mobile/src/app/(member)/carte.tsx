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
  const fullName = active ? `${user.prenom} ${user.nom}` : PLACEHOLDER;
  const churchName = active ? user.eglise_nom?.toUpperCase() ?? PLACEHOLDER : PLACEHOLDER;

  return (
    <View style={styles.card}>
      <CardPattern />

      <Text style={styles.cardFullName} numberOfLines={1}>{fullName}</Text>
      <Text style={styles.cardChurch} numberOfLines={1}>{churchName}</Text>
      <Text style={styles.cardResidence} numberOfLines={1}>{active ? user.lieu_residence ?? '—' : PLACEHOLDER}</Text>
      <Text style={styles.cardBloodLabel}>GROUPE SANGUIN</Text>
      <Text style={styles.cardBlood} numberOfLines={1}>{active ? user.groupe_sanguin ?? '—' : PLACEHOLDER}</Text>
      <Text style={styles.cardMemberLabel}>NUMÉRO DE MEMBRE</Text>
      <Text style={styles.cardMemberId} numberOfLines={1}>{active ? user.member_id ?? `EADM-${user.id}` : PLACEHOLDER}</Text>

      {active && user.carte_photo_url ? (
        <Image source={{ uri: user.carte_photo_url }} style={styles.photo} />
      ) : (
        <View style={[styles.photoPlaceholder, { backgroundColor: colors.orangeDark }]}>
          <Text style={styles.photoInitials}>{active ? `${user.prenom[0]}${user.nom[0]}` : PLACEHOLDER}</Text>
        </View>
      )}

      <Text style={styles.footer}>Valide jusqu'au {active && user.carte_expiration ? formatDate(user.carte_expiration) : PLACEHOLDER}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 60 },
  card: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: radii.xl,
    marginBottom: spacing.xl,
    width: '100%',
    maxWidth: 460,
    aspectRatio: 1.594,
    alignSelf: 'center',
  },
  cardFullName: {
    position: 'absolute',
    left: '37.3%',
    top: '41%',
    right: '4%',
    color: '#381916',
    fontSize: 18,
    fontWeight: '800',
  },
  cardChurch: { position: 'absolute', left: '37.3%', top: '50%', right: '4%', color: '#381916', fontSize: 11, fontWeight: '800' },
  cardResidence: { position: 'absolute', left: '37.3%', top: '56%', right: '4%', color: '#381916', fontSize: 11, fontWeight: '600' },
  cardBloodLabel: { position: 'absolute', left: '37.3%', top: '62%', color: '#381916', fontSize: 10, fontWeight: '800' },
  cardBlood: { position: 'absolute', left: '37.3%', top: '67%', right: '4%', color: '#b52b1d', fontSize: 17, fontWeight: '900' },
  cardMemberLabel: { position: 'absolute', left: '37.3%', top: '76%', color: '#381916', fontSize: 10, fontWeight: '800' },
  cardMemberId: { position: 'absolute', left: '37.3%', top: '82%', right: '4%', color: '#381916', fontSize: 10, fontWeight: '700' },
  photo: { position: 'absolute', left: '6.5%', top: '36%', width: '28.7%', height: '53%', borderWidth: 2, borderColor: '#d28d00', backgroundColor: '#fff' },
  photoPlaceholder: {
    position: 'absolute',
    left: '6.5%',
    top: '36%',
    width: '28.7%',
    height: '53%',
    borderWidth: 2,
    borderColor: '#d28d00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoInitials: { color: '#fff', fontWeight: '800', fontSize: 26 },
  footer: {
    position: 'absolute',
    left: '7.5%',
    bottom: '3.5%',
    color: '#381916',
    fontSize: 9,
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
