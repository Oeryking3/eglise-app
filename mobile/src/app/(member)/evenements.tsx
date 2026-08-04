import { Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/Badge';
import { HeaderWithBack } from '@/components/HeaderWithBack';
import { api } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/format';
import type { EventItem, Paginated } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

export default function EvenementsScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['evenements'],
    queryFn: async () => (await api.get<Paginated<EventItem>>('/evenements')).data,
  });

  const events = data?.data ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderWithBack title="Tous les événements" subtitle="Passés et à venir" backTo="/(member)/accueil" />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 40 }} color={colors.orange} />
        ) : events.length === 0 ? (
          <Text style={styles.empty}>Aucun événement pour le moment.</Text>
        ) : (
          events.map((ev) => (
            <View key={ev.id} style={styles.card}>
              <View>
                <Image source={{ uri: ev.image_url }} style={styles.image} />
                {ev.important ? (
                  <View style={styles.badgeWrap}>
                    <Badge label="Important" tone="important" />
                  </View>
                ) : null}
              </View>
              <View style={styles.body}>
                <Text style={styles.title}>{ev.titre}</Text>
                <View style={styles.metaRow}>
                  <Feather name="calendar" size={12} color={colors.textLight} />
                  <Text style={styles.meta}>{formatDate(ev.date_evenement)}</Text>
                  {ev.heure_debut ? (
                    <>
                      <Text style={styles.metaDot}>·</Text>
                      <Feather name="clock" size={12} color={colors.textLight} />
                      <Text style={styles.meta}>
                        {formatTime(ev.heure_debut)}
                        {ev.heure_fin ? `–${formatTime(ev.heure_fin)}` : ''}
                      </Text>
                    </>
                  ) : null}
                </View>
                {ev.description ? <Text style={styles.description}>{ev.description}</Text> : null}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 60 },
  empty: { fontSize: 13, color: colors.textFaint, marginTop: 20 },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  image: { width: '100%', height: 170, backgroundColor: colors.orangeLight },
  badgeWrap: { position: 'absolute', top: 10, right: 10 },
  body: { padding: spacing.lg },
  title: { fontSize: 16, fontWeight: '800', color: colors.textDark },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  meta: { fontSize: 12, color: colors.textLight },
  metaDot: { fontSize: 12, color: colors.textLight, marginHorizontal: 2 },
  description: { fontSize: 13, color: colors.textMuted, marginTop: 10, lineHeight: 19 },
});
