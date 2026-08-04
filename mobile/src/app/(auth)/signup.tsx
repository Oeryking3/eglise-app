import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActionSheet } from '@/components/ActionSheet';
import { DateField } from '@/components/DateField';
import { IconField } from '@/components/IconField';
import { PillButton } from '@/components/PillButton';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { colors, spacing } from '@/theme/tokens';
import type { Eglise } from '@/lib/types';

const TODAY = new Date(new Date().setHours(0, 0, 0, 0));

export default function SignupScreen() {
  const { register } = useAuth();
  const { show, sheet } = useActionSheet();
  const { data: eglises } = useQuery({
    queryKey: ['eglises-actives'],
    queryFn: async () => (await api.get<{ data: Eglise[] }>('/eglises')).data.data,
  });
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    date_naissance: '',
    sexe: '',
    lieu_residence: '',
  });
  const [egliseId, setEgliseId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const selectedEgliseNom = eglises?.find((e) => e.id === egliseId)?.nom ?? '';

  const openEglisePicker = () => {
    if (!eglises || eglises.length === 0) return;
    show(
      'Choisir ton église',
      undefined,
      eglises.map((e) => ({ text: e.nom, onPress: () => setEgliseId(e.id) })),
    );
  };

  const onSubmit = async () => {
    setError(null);
    if (!egliseId) {
      setError('Choisis ton église.');
      return;
    }
    setLoading(true);
    try {
      await register({
        ...form,
        eglise_id: egliseId,
        email: form.email.trim(),
        date_naissance: form.date_naissance || undefined,
        sexe: form.sexe || undefined,
        lieu_residence: form.lieu_residence || undefined,
      });
      router.replace('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#ffffff', '#ffffff']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoins la communauté de ton église.</Text>

            {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

            <Pressable onPress={openEglisePicker}>
              <View pointerEvents="none">
                <IconField
                  icon={<MaterialCommunityIcons name="church" size={18} color={colors.orange} />}
                  placeholder="Choisir ton église"
                  value={selectedEgliseNom}
                  editable={false}
                />
              </View>
            </Pressable>

            <IconField icon={<Feather name="user" size={18} color={colors.orange} />} placeholder="Nom" value={form.nom} onChangeText={set('nom')} />
            <IconField icon={<Feather name="user" size={18} color={colors.orange} />} placeholder="Prénom" value={form.prenom} onChangeText={set('prenom')} />
            <IconField
              icon={<Feather name="mail" size={18} color={colors.orange} />}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={form.email}
              onChangeText={set('email')}
            />
            <IconField
              icon={<Feather name="lock" size={18} color={colors.orange} />}
              placeholder="Mot de passe"
              secureTextEntry
              value={form.password}
              onChangeText={set('password')}
            />
            <DateField
              label="Date de naissance"
              value={form.date_naissance}
              onChange={set('date_naissance')}
              maximumDate={TODAY}
            />
            <IconField
              icon={<Feather name="users" size={18} color={colors.orange} />}
              placeholder="Sexe (Homme / Femme)"
              value={form.sexe}
              onChangeText={set('sexe')}
            />
            <IconField
              icon={<Feather name="map-pin" size={18} color={colors.orange} />}
              placeholder="Lieu de résidence"
              value={form.lieu_residence}
              onChangeText={set('lieu_residence')}
            />

            <PillButton title="S'inscrire" onPress={onSubmit} loading={loading} style={{ marginTop: spacing.sm }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {sheet}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: { fontSize: 22, fontWeight: '800', color: colors.textDark },
  subtitle: { fontSize: 13, color: colors.textLight, marginTop: 8, marginBottom: spacing.xl, lineHeight: 20 },
  errorBanner: {
    backgroundColor: colors.failedBg,
    color: colors.error,
    padding: 12,
    borderRadius: 12,
    marginBottom: spacing.lg,
    fontWeight: '700',
    fontSize: 13,
  },
});
