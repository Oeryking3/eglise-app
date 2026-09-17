import { Feather } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../lib/auth-context';
import { useThemeColors } from '../lib/theme-context';
import type { EgliseFeatures } from '../lib/types';
import { colors as staticColors, radii, spacing } from '../theme/tokens';

const TABS = [
  { icon: 'home', label: 'Accueil', href: '/(member)/accueil', feature: null },
  { icon: 'book-open', label: 'Bible', href: '/(member)/bible', feature: null },
  { icon: 'heart', label: 'Dîme', href: '/(member)/don', feature: null },
  { icon: 'gift', label: 'Offrandes', href: '/(member)/offrandes', feature: null },
  { icon: 'credit-card', label: 'Carte', href: '/(member)/carte', feature: 'carte' },
] as const;

const MORE_LINKS = [
  { icon: 'book', label: 'Livres', href: '/(member)/livres', feature: 'livres' },
  { icon: 'calendar', label: 'Ordre du jour', href: '/(member)/agenda', feature: 'agenda' },
  { icon: 'calendar', label: 'Évènements', href: '/(member)/evenements', feature: 'evenements' },
  { icon: 'edit-3', label: 'Notes', href: '/(member)/notes', feature: null },
] as const;

export function MemberTabBar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const colors = useThemeColors();
  const [moreOpen, setMoreOpen] = useState(false);
  const features: EgliseFeatures | undefined = user?.eglise_features;
  const tabs = TABS.filter((tab) => tab.feature === null || features?.[tab.feature] !== false);
  const moreLinks = MORE_LINKS.filter((link) => link.feature === null || features?.[link.feature] !== false);
  const isMoreActive = moreLinks.some((link) => pathname.startsWith(link.href));

  return (
    <>
      <SafeAreaView edges={['bottom']} style={styles.bar}>
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Pressable key={tab.href} style={styles.tab} onPress={() => router.navigate(tab.href as never)}>
            <Feather name={tab.icon} size={23} color={active ? colors.orange : staticColors.textFaint} />
            <Text numberOfLines={2} style={[styles.label, active && { color: colors.orange }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
      <Pressable style={styles.tab} onPress={() => setMoreOpen(true)}>
        <Feather name="more-horizontal" size={23} color={isMoreActive ? colors.orange : staticColors.textFaint} />
        <Text style={[styles.label, isMoreActive && { color: colors.orange }]}>Plus</Text>
      </Pressable>
      </SafeAreaView>

      <Modal visible={moreOpen} transparent animationType="fade" onRequestClose={() => setMoreOpen(false)}>
      <Pressable style={styles.overlay} onPress={() => setMoreOpen(false)}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
            {moreLinks.map((link) => (
              <Pressable key={link.href} style={styles.sheetItem} onPress={() => {
                setMoreOpen(false);
                router.navigate(link.href as never);
              }}>
                <Feather name={link.icon} size={20} color={staticColors.textDark} />
                <Text style={styles.sheetLabel}>{link.label}</Text>
              </Pressable>
            ))}
            <Pressable style={[styles.closeBtn, { backgroundColor: colors.orangeLight }]} onPress={() => setMoreOpen(false)}>
              <Text style={[styles.closeBtnText, { color: colors.orangeDark }]}>Fermer</Text>
            </Pressable>
          </ScrollView>
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
    minHeight: 64,
  },
  label: { fontSize: 9, lineHeight: 11, fontWeight: '700', color: staticColors.textFaint, marginTop: 3, textAlign: 'center' },
  overlay: { backgroundColor: 'rgba(0,0,0,0.45)', flex: 1, justifyContent: 'flex-end' },
  sheet: { alignSelf: 'center', backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, maxHeight: '75%', maxWidth: 480, overflow: 'hidden', width: '100%' },
  sheetContent: { paddingBottom: spacing.lg, paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  sheetItem: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.md },
  sheetLabel: { color: staticColors.textDark, fontSize: 15, fontWeight: '700' },
  closeBtn: { alignItems: 'center', borderRadius: radii.md, marginTop: spacing.md, paddingVertical: spacing.md },
  closeBtnText: { fontWeight: '800' },
});