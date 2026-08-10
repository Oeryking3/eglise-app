import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../lib/auth-context';
import { useThemeColors } from '../lib/theme-context';
import type { EgliseFeatures } from '../lib/types';
import { colors as staticColors, radii, spacing } from '../theme/tokens';

const TABS = [
  { icon: 'home', label: 'Accueil', href: '/(admin)', feature: null },
  { icon: 'calendar', label: 'Évén.', href: '/(admin)/evenements', feature: 'evenements' },
  { icon: 'credit-card', label: 'Paiem.', href: '/(admin)/paiements', feature: 'livres' },
  { icon: 'users', label: 'Membres', href: '/(admin)/membres', feature: null },
] as const;

const MORE_LINKS = [
  { icon: 'bell', label: 'Notifications', href: '/(admin)/notifications', feature: 'notifications' },
  { icon: 'book-open', label: 'Livres', href: '/(admin)/livres', feature: 'livres' },
  { icon: 'radio', label: 'Direct', href: '/(admin)/direct', feature: 'direct' },
  { icon: 'gift', label: 'Avantages', href: '/(admin)/avantages', feature: 'avantages' },
  { icon: 'clock', label: 'Programme', href: '/(admin)/programme', feature: 'programme' },
] as const;

export function AdminTabBar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const colors = useThemeColors();
  const [moreOpen, setMoreOpen] = useState(false);

  const features: EgliseFeatures | undefined = user?.eglise_features;
  const hasFeature = (feature: string | null) => feature === null || features?.[feature as keyof EgliseFeatures] !== false;

  const tabs = TABS.filter((t) => hasFeature(t.feature));
  const moreLinks = MORE_LINKS.filter((l) => hasFeature(l.feature));
  const showCartes = hasFeature('carte');

  const isMoreActive =
    moreLinks.some((l) => pathname.startsWith(l.href)) || (showCartes && pathname.startsWith('/(admin)/cartes'));

  const onLogout = async () => {
    setMoreOpen(false);
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <>
      <SafeAreaView edges={['bottom']} style={styles.bar}>
        {tabs.map((tab) => {
          const active = tab.href === '/(admin)' ? pathname === '/(admin)' || pathname === '/' : pathname.startsWith(tab.href);
          return (
            <Pressable key={tab.href} style={styles.tab} onPress={() => router.navigate(tab.href as never)}>
              <Feather name={tab.icon} size={18} color={active ? colors.orange : staticColors.textFaint} />
              <Text style={[styles.label, active && { color: colors.orange }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
        <Pressable style={styles.tab} onPress={() => setMoreOpen(true)}>
          <Feather name="more-horizontal" size={18} color={isMoreActive ? colors.orange : staticColors.textFaint} />
          <Text style={[styles.label, isMoreActive && { color: colors.orange }]}>Plus</Text>
        </Pressable>
      </SafeAreaView>

      <Modal visible={moreOpen} transparent animationType="fade" onRequestClose={() => setMoreOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setMoreOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            {moreLinks.map((link) => (
              <Pressable
                key={link.href}
                style={styles.sheetItem}
                onPress={() => {
                  setMoreOpen(false);
                  router.navigate(link.href as never);
                }}
              >
                <Feather name={link.icon} size={18} color={staticColors.textDark} />
                <Text style={styles.sheetLabel}>{link.label}</Text>
              </Pressable>
            ))}
            {showCartes ? (
              <Pressable
                style={styles.sheetItem}
                onPress={() => {
                  setMoreOpen(false);
                  router.navigate('/(admin)/cartes' as never);
                }}
              >
                <MaterialCommunityIcons name="card-account-details-outline" size={18} color={staticColors.textDark} />
                <Text style={styles.sheetLabel}>Cartes de membre</Text>
              </Pressable>
            ) : null}
            <Pressable style={styles.sheetItem} onPress={onLogout}>
              <Feather name="log-out" size={18} color={staticColors.textDark} />
              <Text style={styles.sheetLabel}>Sortir</Text>
            </Pressable>
            <Pressable style={[styles.closeBtn, { backgroundColor: colors.orangeLight }]} onPress={() => setMoreOpen(false)}>
              <Text style={[styles.closeBtnText, { color: colors.orangeDark }]}>Fermer</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheet: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  sheetLabel: { fontSize: 15, fontWeight: '700', color: staticColors.textDark },
  closeBtn: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
  },
  closeBtnText: { fontWeight: '800' },
});
