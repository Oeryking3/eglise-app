import { Feather } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../lib/auth-context';
import { useThemeColors } from '../lib/theme-context';
import { colors as staticColors, spacing } from '../theme/tokens';

const TABS = [
  { icon: 'home', label: 'Églises', href: '/(super-admin)' },
  { icon: 'inbox', label: 'Demandes', href: '/(super-admin)/demandes' },
  { icon: 'bar-chart-2', label: 'Stats', href: '/(super-admin)/stats' },
] as const;

export function SuperAdminTabBar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const colors = useThemeColors();

  const onLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.bar}>
      {TABS.map((tab) => {
        const active = tab.href === '/(super-admin)' ? pathname === '/(super-admin)' || pathname === '/' : pathname.startsWith(tab.href);
        return (
          <Pressable key={tab.href} style={styles.tab} onPress={() => router.navigate(tab.href as never)}>
            <Feather name={tab.icon} size={18} color={active ? colors.orange : staticColors.textFaint} />
            <Text style={[styles.label, active && { color: colors.orange }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
      <Pressable style={styles.tab} onPress={onLogout}>
        <Feather name="log-out" size={18} color={staticColors.textFaint} />
        <Text style={styles.label}>Sortir</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: staticColors.cardBorder,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: 6,
  },
  label: { fontSize: 9, fontWeight: '700', color: staticColors.textFaint, marginTop: 2 },
});
