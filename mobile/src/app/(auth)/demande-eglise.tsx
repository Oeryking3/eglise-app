import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconField } from '@/components/IconField';
import { PillButton } from '@/components/PillButton';
import { useAuth } from '@/lib/auth-context';
import { colors, spacing } from '@/theme/tokens';

export default function DemandeEgliseScreen() {
  const { requestChurchAdmin } = useAuth();
  const [form, setForm] = useState({
    nom: '',
    code: '',
    ville: '',
    adresse: '',
    contact_nom: '',
    contact_email: '',
    contact_telephone: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const msg = await requestChurchAdmin({
        ...form,
        ville: form.ville || undefined,
        adresse: form.adresse || undefined,
        contact_telephone: form.contact_telephone || undefined,
      });
      setMessage(msg);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la demande.');
    } finally {
      setLoading(false);
    }
  };

  if (message) {
    return (
      <LinearGradient colors={colors.sunsetGradient} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.title}>Demande envoyée</Text>
            <Text style={styles.subtitle}>{message}</Text>
            <PillButton title="Retour à la connexion" onPress={() => router.replace('/(auth)/login')} style={{ marginTop: spacing.xl }} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={colors.sunsetGradient} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Demander un espace église</Text>
            <Text style={styles.subtitle}>
              Ta demande sera examinée par l'administrateur principal avant activation.
            </Text>

            {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

            <IconField
              icon={<MaterialCommunityIcons name="church" size={18} color={colors.orange} />}
              placeholder="Nom de l'église"
              value={form.nom}
              onChangeText={set('nom')}
            />
            <IconField
              icon={<Feather name="hash" size={18} color={colors.orange} />}
              placeholder="Code court (ex: AM)"
              autoCapitalize="characters"
              value={form.code}
              onChangeText={set('code')}
            />
            <IconField
              icon={<MaterialCommunityIcons name="city-variant-outline" size={18} color={colors.orange} />}
              placeholder="Ville"
              value={form.ville}
              onChangeText={set('ville')}
            />
            <IconField
              icon={<Feather name="map-pin" size={18} color={colors.orange} />}
              placeholder="Adresse"
              value={form.adresse}
              onChangeText={set('adresse')}
            />
            <IconField
              icon={<Feather name="user" size={18} color={colors.orange} />}
              placeholder="Nom du responsable"
              value={form.contact_nom}
              onChangeText={set('contact_nom')}
            />
            <IconField
              icon={<Feather name="mail" size={18} color={colors.orange} />}
              placeholder="Email du responsable"
              autoCapitalize="none"
              keyboardType="email-address"
              value={form.contact_email}
              onChangeText={set('contact_email')}
            />
            <IconField
              icon={<Feather name="phone" size={18} color={colors.orange} />}
              placeholder="Téléphone du responsable"
              keyboardType="phone-pad"
              value={form.contact_telephone}
              onChangeText={set('contact_telephone')}
            />
            <IconField
              icon={<Feather name="lock" size={18} color={colors.orange} />}
              placeholder="Mot de passe admin"
              secureTextEntry
              value={form.password}
              onChangeText={set('password')}
            />
            <IconField
              icon={<Feather name="lock" size={18} color={colors.orange} />}
              placeholder="Confirmer le mot de passe"
              secureTextEntry
              value={form.password_confirmation}
              onChangeText={set('password_confirmation')}
            />

            <PillButton title="Envoyer la demande" onPress={onSubmit} loading={loading} style={{ marginTop: spacing.sm }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  subtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 10, marginBottom: spacing.xl, lineHeight: 20 },
  errorBanner: {
    backgroundColor: '#fff',
    color: colors.error,
    padding: 12,
    borderRadius: 12,
    marginBottom: spacing.lg,
    fontWeight: '700',
    fontSize: 13,
  },
});
