import { Feather } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../lib/auth-context';
import { useThemeColors } from '../lib/theme-context';
import type { EgliseFeatures } from '../lib/types';
import { colors as staticColors, spacing } from '../theme/tokens';

const TABS = [
  { icon: 'heart', label: 'Dîme', href: '/(member)/don', feature: null },
  { icon: 'book-open', label: 'Bible', href: '/(member)/bible', feature: null },
  { icon: 'book', label: 'Livres', href: '/(member)/livres', feature: 'livres' },
  { icon: 'calendar', label: 'Agenda', href: '/(member)/agenda', feature: 'agenda' },
  { icon: 'credit-card', label: 'Carte', href: '/(member)/carte', feature: 'carte' },
] as const;

export function MemberTabBar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const colors = useThemeColors();
  const features: EgliseFeatures | undefined = user?.eglise_features;
  const tabs = TABS.filter((tab) => tab.feature === null || features?.[tab.feature] !== false);

  return (
    <SafeAreaView edges={['bottom']} style={styles.bar}>
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Pressable key={tab.href} style={styles.tab} onPress={() => router.navigate(tab.href as never)}>
            <Feather name={tab.icon} size={23} color={active ? colors.orange : staticColors.textFaint} />
            <Text style={[styles.label, active && { color: colors.orange }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
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
  label: { fontSize: 11, fontWeight: '700', color: staticColors.textFaint, marginTop: 3 },
});