import { Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatCard } from '@/components/StatCard';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { colors, radii, spacing } from '@/theme/tokens';

type Stats = {
  membres: number;
  evenements: number;
  paiements: number;
  revenus: number;
};

export default function AdminDashboardScreen() {
  const { user, logout } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => (await api.get<Stats>('/admin/dashboard')).data,
  });

  const onLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.orangeHeader }}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Espace Admin</Text>
            <Text style={styles.subtitle}>Connecté en tant que {user?.prenom}</Text>
          </View>
          <Pressable onPress={onLogout} hitSlop={12}>
            <Feather name="log-out" size={20} color="#fff" />
          </Pressable>
        </View>
      </SafeAreaView>

      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Tableau de bord</Text>
          {isLoading || !data ? (
            <ActivityIndicator style={{ marginTop: 40 }} color={colors.orange} />
          ) : (
            <View style={styles.grid}>
              <StatCard label="Membres" value={data.membres} />
              <StatCard label="Événements" value={data.evenements} />
              <StatCard label="Paiements réussis" value={data.paiements} />
              <StatCard label="FCFA de revenus" value={data.revenus.toLocaleString('fr-FR')} />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.xl, paddingBottom: 40 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: spacing.md,
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '800' },
  subtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },
  sheet: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    marginTop: -20,
  },
  sheetContent: { padding: spacing.xl },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textDark, marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
