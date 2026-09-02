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
  const active = true;
  const fullName = `${user.prenom} ${user.nom}`;
  const churchName = user.eglise_nom?.toUpperCase() ?? '—';
  const bloodGroup = user.groupe_sanguin ?? '—';
  const memberId = user.member_id ?? `EADM-${user.id}`;
  const expiry = user.carte_expiration ? formatMonthYear(user.carte_expiration) : '—';

  return (
    <View style={styles.card}>
      <CardPattern />

      <Text style={styles.cardNameLabel}>NOM COMPLET</Text>
      <Text style={styles.cardFullName} numberOfLines={1}>{fullName}</Text>
      <Text style={styles.cardChurchLabel}>NOM DE L'ÉGLISE</Text>
      <Text style={styles.cardChurch} numberOfLines={1}>{churchName}</Text>
      <Text style={styles.cardBloodLabel}>GROUPE SANGUIN</Text>
      <Text style={styles.cardBlood} numberOfLines={1}>{bloodGroup}</Text>
      <Text style={styles.cardMemberLabel}>NUMÉRO DE MEMBRE</Text>
      <Text style={styles.cardMemberIdLabel}>MEMBER ID</Text>
      <Text style={styles.cardMemberId} numberOfLines={1}>{memberId}</Text>

      {user.carte_photo_url ? (
        <Image source={{ uri: user.carte_photo_url }} style={styles.photo} />
      ) : (
        <View style={[styles.photoPlaceholder, { backgroundColor: colors.orangeDark }]}>
          <Text style={styles.photoInitials}>{`${user.prenom[0]}${user.nom[0]}`}</Text>
        </View>
      )}

      <Text style={styles.footer}>Valide jusqu'au {expiry}</Text>
    </View>
  );
}

function formatMonthYear(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
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
    top: '43%',
    right: '4%',
    color: '#381916',
    fontFamily: 'Arial',
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '800',
  },
  cardNameLabel: { position: 'absolute', left: '37.3%', top: '38%', color: '#381916', fontFamily: 'Arial', fontSize: 10, lineHeight: 12, fontWeight: '800' },
  cardChurchLabel: { position: 'absolute', left: '37.3%', top: '51%', color: '#381916', fontFamily: 'Arial', fontSize: 10, lineHeight: 12, fontWeight: '800' },
  cardChurch: { position: 'absolute', left: '37.3%', top: '55%', right: '4%', color: '#381916', fontFamily: 'Arial', fontSize: 12, lineHeight: 15, fontWeight: '800' },
  cardBloodLabel: { position: 'absolute', left: '37.3%', top: '64%', color: '#381916', fontFamily: 'Arial', fontSize: 10, lineHeight: 12, fontWeight: '800' },
  cardBlood: { position: 'absolute', left: '37.3%', top: '69%', right: '4%', color: '#b52b1d', fontFamily: 'Arial', fontSize: 16, lineHeight: 19, fontWeight: '900' },
  cardMemberLabel: { position: 'absolute', left: '37.3%', top: '77%', color: '#381916', fontFamily: 'Arial', fontSize: 10, lineHeight: 12, fontWeight: '800' },
  cardMemberIdLabel: { position: 'absolute', left: '37.3%', top: '81%', color: '#381916', fontFamily: 'Arial', fontSize: 10, lineHeight: 12, fontWeight: '800' },
  cardMemberId: { position: 'absolute', left: '37.3%', top: '85%', right: '4%', color: '#381916', fontFamily: 'Arial', fontSize: 12, lineHeight: 15, fontWeight: '700' },
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
  photoInitials: { color: '#fff', fontFamily: 'Arial', fontWeight: '800', fontSize: 20, lineHeight: 24 },
  footer: {
    position: 'absolute',
    left: '7.5%',
    bottom: '3.5%',
    color: '#381916',
    fontFamily: 'Arial',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
  },
  inactiveOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.74)' },
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
