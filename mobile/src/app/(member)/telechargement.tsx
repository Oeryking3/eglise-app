import { Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PillButton } from '@/components/PillButton';
import { api } from '@/lib/api';
import type { Livre } from '@/lib/types';
import { colors, spacing } from '@/theme/tokens';

export default function TelechargementScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['livres'],
    queryFn: async () => (await api.get<{ data: Livre[] } | Livre[]>('/livres')).data,
  });

  const livres = Array.isArray(data) ? data : data?.data ?? [];

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.checkBadge}>
        <Feather name="check" size={28} color="#fff" />
      </View>
      <Text style={styles.title}>Paiement confirmé !</Text>
      <Text style={styles.subtitle}>Merci pour ton paiement. Télécharge ton/tes guide(s) ci-dessous.</Text>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 30 }} color={colors.orange} />
      ) : livres.length === 0 ? (
        <Text style={styles.empty}>Aucun livre disponible pour le moment.</Text>
      ) : (
        <View style={{ width: '100%', marginTop: spacing.xl }}>
          {livres.map((livre) => (
            <PillButton
              key={livre.id}
              title={`Télécharger : ${livre.titre}`}
              variant="outline"
              style={{ marginBottom: spacing.md }}
              onPress={() => livre.fichier_url && Linking.openURL(livre.fichier_url)}
            />
          ))}
        </View>
      )}

      <PillButton
        title="Retour à l'accueil"
        variant="dark"
        style={{ marginTop: spacing.xl }}
        onPress={() => router.replace('/(member)/accueil')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    backgroundColor: '#fff',
  },
  checkBadge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.successText,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.textDark, marginBottom: spacing.sm },
  subtitle: { fontSize: 13, color: colors.textLight, textAlign: 'center', lineHeight: 20 },
  empty: { fontSize: 13, color: colors.textFaint, marginTop: spacing.xl },
});
