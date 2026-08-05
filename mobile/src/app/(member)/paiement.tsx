import { Feather } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconField } from '@/components/IconField';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import { colors, radii, spacing } from '@/theme/tokens';

const METHODS = [
  { value: 'wave', label: 'Wave', dot: 'W', color: colors.wave },
  { value: 'orange', label: 'Orange Money', dot: 'OM', color: colors.orangeMoney },
  { value: 'mtn', label: 'MTN Money', dot: 'MTN', color: colors.mtn, textColor: '#111' },
  { value: 'moov', label: 'Moov Money', dot: 'M', color: colors.moov },
  { value: 'card', label: 'Carte bancaire', dot: '💳', color: colors.card },
] as const;

type Methode = (typeof METHODS)[number]['value'];

// Sur le web, il n'y a pas de "fermeture automatique du navigateur intégré"
// comme sur natif : CinetPay redirige la page elle-même (plein écran, pas de
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
  const [methode, setMethode] = useState<Methode>('wave');
  const [telephone, setTelephone] = useState('');
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
        methode,
        telephone: methode !== 'card' ? telephone : undefined,
        return_url: returnUrl,
      });

      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        // Navigation plein écran : la page se recharge sur /paiement une fois
        // revenue de CinetPay, avec le statut dans l'URL (voir useEffect).
        window.location.href = data.payment_url;
        return;
      }

      // Natif : ouvre la page de paiement sécurisée CinetPay dans un
      // navigateur intégré ; se ferme automatiquement dès que CinetPay
      // redirige vers returnUrl (succès ou échec).
      await WebBrowser.openAuthSessionAsync(data.payment_url, returnUrl);

      // Le retour (succès, échec, ou fermeture manuelle par l'utilisateur)
      // ne dit pas la vérité sur le paiement — seul le backend, qui a
      // revérifié auprès de CinetPay, fait foi. On vérifie donc toujours
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
        <Text style={styles.sectionLabel}>Choisir un mode de paiement</Text>
        <View style={styles.grid}>
          {METHODS.map((m) => {
            const selected = methode === m.value;
            return (
              <Pressable
                key={m.value}
                onPress={() => setMethode(m.value)}
                style={[styles.methodCard, selected && styles.methodCardSelected]}
              >
                <View style={[styles.dot, { backgroundColor: m.color }]}>
                  <Text style={[styles.dotText, 'textColor' in m ? { color: m.textColor } : null]}>{m.dot}</Text>
                </View>
                <Text style={styles.methodLabel}>{m.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {methode !== 'card' ? (
          <IconField
            icon={<Feather name="phone" size={18} color={colors.orange} />}
            placeholder="Numéro de téléphone (ex: 07 00 00 00 00)"
            keyboardType="phone-pad"
            value={telephone}
            onChangeText={setTelephone}
          />
        ) : (
          <Text style={styles.cardHint}>
            Tu saisiras les informations de ta carte sur la page de paiement sécurisée CinetPay.
          </Text>
        )}

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
  sectionLabel: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  methodCard: {
    width: '31%',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  methodCardSelected: {
    borderColor: colors.orange,
    backgroundColor: colors.orangeLight,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  dotText: { color: '#fff', fontWeight: '800', fontSize: 11 },
  methodLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted, textAlign: 'center' },
  cardHint: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
});
