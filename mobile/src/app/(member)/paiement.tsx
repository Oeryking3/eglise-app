import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import { colors, spacing } from '@/theme/tokens';

// Sur le web, il n'y a pas de "fermeture automatique du navigateur intégré"
// comme sur natif : GeniusPay redirige la page elle-même (plein écran, pas de
// popup fiable) vers cette même route /paiement avec ?statut=...&payment_id=...
// dans l'URL. Cet écran doit donc, à son chargement, détecter ce retour et
// vérifier le vrai statut auprès du backend avant d'afficher quoi que ce soit.
export default function PaiementScreen() {
  const params = useLocalSearchParams<{
    statut?: string;
    payment_id?: string;
    livre_id?: string;
    titre?: string;
    prix?: string;
  }>();
  const livreId = params.livre_id ? Number(params.livre_id) : null;
  const titre = params.titre ?? 'Livre';
  const prix = params.prix ? Number(params.prix) : 0;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingReturn, setCheckingReturn] = useState(Platform.OS === 'web' && !!params.payment_id);

  useEffect(() => {
    if (!params.payment_id) return;

    (async () => {
      try {
        const check = await api.get<{ data: { statut: string } }>(`/paiements/${params.payment_id}`);
        if (check.data.data.statut === 'reussi') {
          router.replace('/(member)/telechargement');
          return;
        }
        setError(
          check.data.data.statut === 'echoue'
            ? 'Le paiement a échoué. Réessaie.'
            : "Paiement non confirmé pour l'instant. Si tu as bien payé, réessaie dans un instant.",
        );
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setCheckingReturn(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.payment_id]);

  const onSubmit = async () => {
    if (!livreId) {
      setError('Choisis un livre à acheter.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const returnUrl =
        Platform.OS === 'web' && typeof window !== 'undefined'
          ? `${window.location.origin}/paiement`
          : Linking.createURL('paiement-retour');

      const { data } = await api.post<{ payment: { id: number }; payment_url: string }>('/paiement', {
        livre_id: livreId,
        return_url: returnUrl,
      });

      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        // Navigation plein écran : la page se recharge sur /paiement une fois
        // revenue de GeniusPay, avec le statut dans l'URL (voir useEffect).
        window.location.href = data.payment_url;
        return;
      }

      // Natif : ouvre la page de paiement sécurisée GeniusPay (le client y
      // choisit lui-même Wave/Orange Money/MTN/Moov/carte) dans un
      // navigateur intégré ; se ferme automatiquement dès que GeniusPay
      // redirige vers returnUrl (succès ou échec).
      await WebBrowser.openAuthSessionAsync(data.payment_url, returnUrl);

      // Le retour (succès, échec, ou fermeture manuelle par l'utilisateur)
      // ne dit pas la vérité sur le paiement — seul le backend, qui a
      // revérifié auprès de GeniusPay, fait foi. On vérifie donc toujours
      // l'état réel avant de décider où naviguer.
      const check = await api.get<{ data: { statut: string } }>(`/paiements/${data.payment.id}`);

      if (check.data.data.statut === 'reussi') {
        router.replace('/(member)/telechargement');
      } else {
        setError(
          check.data.data.statut === 'echoue'
            ? 'Le paiement a échoué. Réessaie.'
            : "Paiement non confirmé pour l'instant. Si tu as bien payé, réessaie dans un instant.",
        );
      }
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  if (checkingReturn) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.orange} />
      </View>
    );
  }

  if (!livreId) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: spacing.xxl }}>
        <Text style={{ fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.lg }}>
          Choisis d'abord un livre à acheter.
        </Text>
        <PillButton title="Voir les livres" onPress={() => router.replace('/(member)/livres')} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.title}>{titre}</Text>
        <Text style={styles.subtitle}>Débloque ce guide en PDF, téléchargeable après paiement.</Text>
        <Text style={styles.price}>{prix.toLocaleString('fr-FR')} FCFA</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.hint}>
          Tu choisiras Wave, Orange Money, MTN Money, Moov Money ou carte bancaire sur la page de paiement sécurisée.
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PillButton title={`Payer ${prix.toLocaleString('fr-FR')} FCFA`} onPress={onSubmit} loading={loading} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.orangeHeader,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: spacing.md },
  subtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 10, lineHeight: 19 },
  price: { color: '#fff', fontSize: 30, fontWeight: '800', marginTop: spacing.lg },
  content: { padding: spacing.xl, paddingBottom: 60 },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
});
