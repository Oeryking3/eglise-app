import { useQuery } from '@tanstack/react-query';
import { Redirect, router, Slot } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { AdminTabBar } from '@/components/AdminTabBar';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { Eglise } from '@/lib/types';
import { colors, spacing } from '@/theme/tokens';

export default function AdminLayout() {
  const { user, isLoading, activeEgliseId } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.orange} />
      </View>
    );
  }

  if (!user || (user.role !== 'admin_eglise' && user.role !== 'super_admin')) {
    return <Redirect href="/" />;
  }

  return (
    <View style={{ flex: 1 }}>
      {user.role === 'super_admin' ? <ActiveEgliseBanner egliseId={activeEgliseId} /> : null}
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <AdminTabBar />
    </View>
  );
}

function ActiveEgliseBanner({ egliseId }: { egliseId: number | null }) {
  const { data: eglises } = useQuery({
    queryKey: ['super-admin-eglises'],
    queryFn: async () => (await api.get<{ data: Eglise[] }>('/super-admin/eglises')).data.data,
  });

  const nom = eglises?.find((e) => e.id === egliseId)?.nom ?? '…';

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>Église active : {nom}</Text>
      <Pressable onPress={() => router.replace('/(super-admin)' as never)}>
        <Text style={styles.bannerLink}>Changer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.orangeLight,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  bannerText: { fontSize: 12, fontWeight: '700', color: colors.orangeDark },
  bannerLink: { fontSize: 12, fontWeight: '800', color: colors.orangeDark, textDecorationLine: 'underline' },
});
