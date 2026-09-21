import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconField } from '@/components/IconField';
import { PillButton } from '@/components/PillButton';
import { useAuth } from '@/lib/auth-context';
import { colors, spacing } from '@/theme/tokens';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={colors.sunsetGradient} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.top}>
              <Text style={styles.title}>Connexion</Text>
              <Text style={styles.subtitle}>
                Accède à ton espace membre : événements, agenda, carte de membre et plus.
              </Text>
            </View>

            {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

            <View style={styles.form}>
              <IconField
                icon={<Feather name="mail" size={18} color={colors.orange} />}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <IconField
                icon={<Feather name="lock" size={18} color={colors.orange} />}
                placeholder="Mot de passe"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <PillButton title="Connexion" onPress={onSubmit} loading={loading} style={{ marginTop: spacing.sm }} />

              <Text style={styles.switchText}>Vous n&apos;avez pas de compte ? inscrivez-vous</Text>
              <Link href="/(auth)/signup" asChild>
                <PillButton title="S'inscrire" variant="dark" />
              </Link>

              <Link href="/(auth)/demande-eglise" style={styles.linkText}>
                Tu représentes une église ? Demande ton espace admin
              </Link>

              <Link href="/(auth)/confidentialite" style={styles.linkText}>
                Politique de confidentialité
              </Link>
            </View>
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
  top: { marginBottom: spacing.xl },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    marginTop: 10,
    lineHeight: 20,
  },
  errorBanner: {
    backgroundColor: '#fff',
    color: colors.error,
    padding: 12,
    borderRadius: 12,
    marginBottom: spacing.lg,
    fontWeight: '700',
    fontSize: 13,
  },
  form: {
    marginTop: spacing.md,
  },
  switchText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    fontSize: 13,
  },
  linkText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: spacing.lg,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
