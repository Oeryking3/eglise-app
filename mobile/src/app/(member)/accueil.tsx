import { Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PillButton } from '@/components/PillButton';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { formatDateAndRange } from '@/lib/format';
import { AgendaItem, ChurchNotification, EventItem, LiveStream, User } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

type DashboardResponse = {
  user: User;
  upcoming_events: { data: EventItem[] } | EventItem[];
  notifications: { data: ChurchNotification[] } | ChurchNotification[];
  live_stream: LiveStream;
  agenda_reminders: { data: AgendaItem[] } | AgendaItem[];
};

function unwrap<T>(value: { data: T[] } | T[]): T[] {
  return Array.isArray(value) ? value : value.data;
}

// Largeur d'une carte événement (styles.eventCard.width) + son marginRight.
const EVENT_CARD_STRIDE = 220 + 12;

export default function AccueilScreen() {
  const { user, logout } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['accueil'],
    queryFn: async () => (await api.get<DashboardResponse>('/accueil')).data,
  });
  const onLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const events = data ? unwrap(data.upcoming_events) : [];
  const notifications = data ? unwrap(data.notifications) : [];
  const reminders = data ? unwrap(data.agenda_reminders) : [];

  const [remindersOpen, setRemindersOpen] = useState(false);

  const carouselRef = useRef<ScrollView>(null);
  const carouselIndex = useRef(0);

  useEffect(() => {
    carouselIndex.current = 0;
    if (events.length < 2) return;

    const interval = setInterval(() => {
      carouselIndex.current = (carouselIndex.current + 1) % events.length;
      carouselRef.current?.scrollTo({ x: carouselIndex.current * EVENT_CARD_STRIDE, animated: true });
    }, 3500);

    return () => clearInterval(interval);
  }, [events.length]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.orangeHeader }}>
      {/* Un seul ScrollView pour TOUT l'écran (en-tête, carte hero, contenu) :
          la carte hero doit défiler avec le reste, sinon elle reste fixe à
          l'écran et recouvre en permanence tout contenu qui défile dessous. */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['top']} style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Coucou, {user?.prenom}</Text>
              <Text style={styles.headerSub}>Que la paix du Seigneur soit avec toi.</Text>
            </View>
            <View style={styles.headerIcons}>
              <Pressable onPress={() => setRemindersOpen(true)} hitSlop={12} style={{ position: 'relative' }}>
                <Feather name="bell" size={20} color="#fff" />
                {reminders.length > 0 ? <View style={styles.bellBadge} /> : null}
              </Pressable>
              <Pressable onPress={onLogout} hitSlop={12}>
                <Feather name="log-out" size={20} color="#fff" />
              </Pressable>
            </View>
          </View>
        </SafeAreaView>

        {/* Carte hero : remontée dans le padding du bandeau via un marginTop
            fixe, et chevauchant le fond blanc via marginBottom négatif.
            position:relative + zIndex garantissent l'affichage au-dessus du
            fond blanc (sinon comportement par défaut : le sibling suivant
            peint par-dessus). Comme elle fait partie du même ScrollView que
            le contenu, elle défile avec lui — pas de recouvrement permanent. */}
        <View style={styles.heroShadow}>
          <View style={styles.heroWrap}>
            <Image
              source={require('../../../assets/images/brand/hero.png')}
              style={styles.hero}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.sheetContent}>
            {isLoading ? (
              <ActivityIndicator style={{ marginTop: 40 }} color={colors.orange} />
            ) : (
              <>
                <Text style={styles.sectionTitle}>Évènements à venir</Text>
                {events.length === 0 ? (
                  <Text style={styles.empty}>Aucun événement à venir pour le moment.</Text>
                ) : (
                  <ScrollView
                    ref={carouselRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: spacing.md }}
                  >
                    {events.map((ev) => (
                      <View key={ev.id} style={styles.eventCard}>
                        <Image source={{ uri: ev.image_url }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                        <LinearGradient
                          colors={['transparent', 'rgba(0,0,0,0.75)']}
                          style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.eventCardText}>
                          <Text style={styles.eventTitle} numberOfLines={2}>{ev.titre}</Text>
                          <Text style={styles.eventMeta}>{formatDateAndRange(ev.date_evenement, ev.heure_debut)}</Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                )}
                <Link href="/(member)/evenements" asChild>
                  <PillButton title="Voir tous les événements" variant="outline" />
                </Link>

                <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Notifications</Text>
                {notifications.length === 0 ? (
                  <Text style={styles.empty}>Aucune notification.</Text>
                ) : (
                  notifications.map((n) => (
                    <View key={n.id} style={styles.notifCard}>
                      <View style={styles.notifIcon}>
                        <Feather name="mail" size={16} color="#fff" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.notifTitle}>{n.titre}</Text>
                        <Text style={styles.notifMessage}>{n.message}</Text>
                      </View>
                    </View>
                  ))
                )}

                <View style={{ marginTop: spacing.xl }}>
                  <Link href="/(member)/livres" asChild>
                    <PillButton title="Livres PDF" />
                  </Link>
                  <View style={{ height: spacing.md }} />
                  <Link href="/(member)/agenda" asChild>
                    <PillButton title="Mon agenda" variant="outline" />
                  </Link>
                  <View style={{ height: spacing.md }} />
                  <Link href="/(member)/carte" asChild>
                    <PillButton title="Ma carte de membre" variant="outline" />
                  </Link>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <Modal visible={remindersOpen} transparent animationType="fade" onRequestClose={() => setRemindersOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setRemindersOpen(false)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Rappels du jour</Text>
            {reminders.length === 0 ? (
              <Text style={styles.empty}>Aucun rappel pour aujourd'hui.</Text>
            ) : (
              reminders.map((r) => (
                <View key={r.id} style={styles.reminderBanner}>
                  <Text style={styles.reminderTitle}>{r.titre}</Text>
                  <Text style={styles.reminderMeta}>{formatDateAndRange(r.date_rappel, r.heure_rappel)}</Text>
                  {r.description ? <Text style={styles.reminderText}>{r.description}</Text> : null}
                </View>
              ))
            )}
            <PillButton
              title="Fermer"
              variant="outline"
              style={{ marginTop: spacing.md }}
              onPress={() => setRemindersOpen(false)}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 90,
    zIndex: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: spacing.md,
  },
  headerIcons: { flexDirection: 'row', gap: spacing.md },
  bellBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.orangeHeader,
  },
  greeting: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },
  heroShadow: {
    // Requis pour que zIndex ait un effet sur le web (CSS n'applique
    // z-index qu'aux éléments positionnés, pas à ceux en position statique).
    position: 'relative',
    width: '90%',
    alignSelf: 'center',
    aspectRatio: 257 / 163,
    marginTop: -55,
    marginBottom: -120,
    borderRadius: radii.xl,
    backgroundColor: 'transparent',
    zIndex: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  heroWrap: {
    flex: 1,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  hero: {
    width: '100%',
    height: '100%',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    minHeight: 600,
  },
  sheetContent: {
    paddingHorizontal: spacing.xl,
    // Compense le chevauchement de la carte hero (heroShadow.marginBottom)
    // pour que "Évènements à venir" ne soit pas caché dessous.
    paddingTop: 140,
    paddingBottom: 60,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.textDark, marginBottom: spacing.md },
  empty: { fontSize: 13, color: colors.textFaint, marginBottom: spacing.md },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: radii.lg,
    padding: spacing.xl,
  },
  modalTitle: { fontSize: 16, fontWeight: '800', color: colors.textDark, marginBottom: spacing.md },
  eventCard: {
    width: 220,
    height: 130,
    borderRadius: radii.lg,
    marginRight: spacing.md,
    overflow: 'hidden',
    backgroundColor: colors.orangeLight,
  },
  eventCardText: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
  },
  eventTitle: { fontWeight: '800', fontSize: 14, color: '#fff' },
  eventMeta: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  reminderBanner: {
    backgroundColor: colors.orangeLight,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  reminderTitle: { fontWeight: '700', fontSize: 13, color: colors.orangeDark },
  reminderMeta: { fontSize: 11, color: colors.textLight, marginTop: 2 },
  reminderText: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.orangeDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTitle: { fontWeight: '700', fontSize: 13, color: colors.textDark },
  notifMessage: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
