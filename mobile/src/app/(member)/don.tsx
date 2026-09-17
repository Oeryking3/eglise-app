import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import { colors, radii, spacing } from '@/theme/tokens';

const PRESETS = [1000, 2000, 5000, 10000];

export default function DonScreen() {
  const params = useLocalSearchParams<{ payment_id?: string }>();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingReturn, setCheckingReturn] = useState(Platform.OS === 'web' && !!params.payment_id);

  useEffect(() => {
    if (!params.payment_id) return;

    (async () => {
      try {
        const check = await api.get<{ data: { statut: string } }>(`/paiements/${params.payment_id}`);
        if (check.data.data.statut === 'reussi') {
          setSuccess(true);
        } else {
          setError(check.data.data.statut === 'echoue' ? 'Le don a échoué. Réessaie.' : 'Le don n’est pas encore confirmé.');
        }
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setCheckingReturn(false);
      }
    })();
  }, [params.payment_id]);

  const onSubmit = async () => {
    const donationAmount = Number(amount);
    if (!Number.isInteger(donationAmount) || donationAmount < 500) {
      setError('Le montant minimum est de 500 FCFA.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const returnUrl =
        Platform.OS === 'web' && typeof window !== 'undefined'
          ? `${window.location.origin}/don`
          : Linking.createURL('don-retour');
      const { data } = await api.post<{ payment: { id: number }; payment_url: string }>('/don', {
        montant: donationAmount,
        type: 'dime',
        return_url: returnUrl,
      });

      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.location.href = data.payment_url;
        return;
      }

      await WebBrowser.openAuthSessionAsync(data.payment_url, returnUrl);
      const check = await api.get<{ data: { statut: string } }>(`/paiements/${data.payment.id}`);
      if (check.data.data.statut === 'reussi') {
        setSuccess(true);
      } else {
        setError(check.data.data.statut === 'echoue' ? 'Le don a échoué. Réessaie.' : 'Le don n’est pas encore confirmé.');
      }
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  if (checkingReturn) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.orange} /></View>;
  }

  if (success) {
    return (
      <View style={styles.center}>
        <View style={styles.successIcon}><Feather name="heart" size={30} color={colors.orange} /></View>
        <Text style={styles.successTitle}>Merci pour ton don</Text>
        <Text style={styles.successText}>Ton soutien aide l’église à poursuivre sa mission.</Text>
        <PillButton title="Retour à l’accueil" onPress={() => router.replace('/(member)/accueil')} />
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Dîme</Text>
        <Text style={styles.subtitle}>La dîme est une part consacrée à Dieu, destinée à soutenir l’œuvre et la mission de l’église.</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Choisis un montant</Text>
        <View style={styles.presets}>
          {PRESETS.map((preset) => (
            <Pressable key={preset} onPress={() => setAmount(String(preset))} style={[styles.preset, amount === String(preset) && styles.presetActive]}>
              <Text style={[styles.presetText, amount === String(preset) && styles.presetTextActive]}>{preset.toLocaleString('fr-FR')} F</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>Ou indique un autre montant</Text>
        <View style={styles.amountInput}>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="number-pad"
            placeholder="Montant"
            placeholderTextColor={colors.textPlaceholder}
            style={styles.input}
          />
          <Text style={styles.currency}>FCFA</Text>
        </View>
        <Text style={styles.hint}>Le paiement sécurisé te permettra de choisir Wave, Orange Money, MTN Money, Moov Money ou carte bancaire.</Text>
        <Pressable onPress={() => router.push('/(member)/offrandes' as never)} style={styles.offrandesLink}>
          <Text style={styles.offrandesLinkText}>Voir les offrandes et les offrandes journalières</Text>
        </Pressable>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PillButton title="Continuer vers le paiement" onPress={onSubmit} loading={loading} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: colors.orangeHeader, paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  back: { marginTop: spacing.md, marginBottom: spacing.md },
  title: { color: '#fff', fontSize: 24, fontWeight: '800' },
  subtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 20, marginTop: spacing.sm },
  content: { padding: spacing.xl, paddingBottom: 60 },
  label: { color: colors.textDark, fontSize: 14, fontWeight: '800', marginBottom: spacing.md, marginTop: spacing.md },
  offrandesLink: { marginBottom: spacing.lg, marginTop: spacing.md },
  offrandesLinkText: { color: colors.orangeDark, fontSize: 13, fontWeight: '800', textAlign: 'center' },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  preset: { borderColor: colors.orangeBorder, borderRadius: radii.md, borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  presetActive: { backgroundColor: colors.orange, borderColor: colors.orange },
  presetText: { color: colors.orangeDark, fontSize: 14, fontWeight: '700' },
  presetTextActive: { color: '#fff' },
  amountInput: { alignItems: 'center', borderColor: colors.cardBorder, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', paddingHorizontal: spacing.md },
  input: { color: colors.textDark, flex: 1, fontSize: 18, paddingVertical: spacing.md },
  currency: { color: colors.textMuted, fontSize: 13, fontWeight: '700' },
  hint: { color: colors.textMuted, fontSize: 13, lineHeight: 20, marginBottom: spacing.xl, marginTop: spacing.xl },
  error: { color: colors.error, fontSize: 13, fontWeight: '700', marginBottom: spacing.md },
  center: { alignItems: 'center', backgroundColor: '#fff', flex: 1, justifyContent: 'center', padding: spacing.xxl },
  successIcon: { alignItems: 'center', backgroundColor: colors.orangeLight, borderRadius: radii.pill, height: 72, justifyContent: 'center', marginBottom: spacing.lg, width: 72 },
  successTitle: { color: colors.textDark, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  successText: { color: colors.textMuted, fontSize: 14, lineHeight: 21, marginBottom: spacing.xl, marginTop: spacing.sm, textAlign: 'center' },
});