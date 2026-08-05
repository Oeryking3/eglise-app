import { Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { HeaderWithBack } from '@/components/HeaderWithBack';
import { PillButton } from '@/components/PillButton';
import { api } from '@/lib/api';
import type { Livre } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

export default function LivresScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['livres'],
    queryFn: async () => (await api.get<{ data: Livre[] } | Livre[]>('/livres')).data,
  });

  const livres = Array.isArray(data) ? data : data?.data ?? [];

  const acheter = (livre: Livre) => {
    router.push({
      pathname: '/(member)/paiement',
      params: { livre_id: String(livre.id), titre: livre.titre, prix: String(livre.prix) },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderWithBack title="Livres" subtitle="Guides PDF à télécharger" />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={colors.orange} />
        ) : livres.length === 0 ? (
          <Text style={styles.empty}>Aucun livre disponible pour le moment.</Text>
        ) : (
          livres.map((livre) => (
            <View key={livre.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.title}>{livre.titre}</Text>
                {livre.achete ? (
                  <View style={styles.badge}>
                    <Feather name="check" size={12} color={colors.successText} />
                    <Text style={styles.badgeText}>Acheté</Text>
                  </View>
                ) : null}
              </View>
              {livre.description ? <Text style={styles.description}>{livre.description}</Text> : null}
              {livre.achete ? (
                <PillButton
                  title="Télécharger le PDF"
                  variant="outline"
                  onPress={() => livre.fichier_url && Linking.openURL(livre.fichier_url)}
                  style={{ marginTop: spacing.md }}
                />
              ) : (
                <PillButton
                  title={`Acheter — ${livre.prix.toLocaleString('fr-FR')} FCFA`}
                  onPress={() => acheter(livre)}
                  style={{ marginTop: spacing.md }}
                />
              )}
            </View>
          ))
        )}
      </ScrollView>
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
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 15, fontWeight: '800', color: colors.textDark, flex: 1 },
  description: { fontSize: 13, color: colors.textMuted, marginTop: 6, lineHeight: 19 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.successText },
});
