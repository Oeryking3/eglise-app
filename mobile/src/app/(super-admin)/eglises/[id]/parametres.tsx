import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { FormCheck, FormGroup } from '@/components/FormGroup';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import type { Eglise, EgliseFeatures, EgliseTheme } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

const FEATURE_LABELS: Record<keyof EgliseFeatures, string> = {
  evenements: 'Événements',
  agenda: 'Agenda personnel',
  carte: 'Carte de membre',
  livres: 'Livres PDF (paiement)',
  avantages: 'Avantages de la carte',
  notifications: 'Notifications',
  direct: 'Direct (live)',
  programme: 'Programme de la semaine',
};

const COLOR_LABELS: { key: keyof EgliseTheme; label: string }[] = [
  { key: 'couleur_primaire', label: 'Couleur principale (boutons, icônes)' },
  { key: 'couleur_primaire_sombre', label: 'Couleur principale foncée' },
  { key: 'couleur_entete', label: "Couleur d'en-tête" },
  { key: 'couleur_primaire_claire', label: 'Couleur principale claire (fonds)' },
  { key: 'couleur_bordure', label: 'Couleur de bordure des champs' },
];

const HEX_REGEX = /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/;

export default function EgliseParametresScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const egliseId = Number(id);
  const queryClient = useQueryClient();

  const { data: eglises, isLoading } = useQuery({
    queryKey: ['super-admin-eglises'],
    queryFn: async () => (await api.get<{ data: Eglise[] }>('/super-admin/eglises')).data.data,
  });
  const eglise = eglises?.find((e) => e.id === egliseId);

  const [features, setFeatures] = useState<EgliseFeatures | null>(null);
  const [theme, setTheme] = useState<EgliseTheme | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (eglise) {
      setFeatures(eglise.features);
      setTheme(eglise.theme);
    }
  }, [eglise]);

  const toggleFeature = (key: keyof EgliseFeatures) => (value: boolean) => {
    setFeatures((f) => (f ? { ...f, [key]: value } : f));
  };

  const setColor = (key: keyof EgliseTheme) => (value: string) => {
    setTheme((t) => (t ? { ...t, [key]: value } : t));
  };

  const onSave = async () => {
    if (!features || !theme) return;
    setError(null);

    for (const c of COLOR_LABELS) {
      const value = theme[c.key];
      if (value && !HEX_REGEX.test(value)) {
        setError(`Couleur invalide pour "${c.label}" — attendu un code hexadécimal comme #F0602E.`);
        return;
      }
    }

    setSaving(true);
    try {
      await api.put(`/super-admin/eglises/${egliseId}/fonctionnalites`, { features });
      await api.put(`/super-admin/eglises/${egliseId}/theme`, theme);
      queryClient.invalidateQueries({ queryKey: ['super-admin-eglises'] });
      router.back();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !features || !theme) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <AdminPageHeader title="Paramètres" actionLabel="Retour" onAction={() => router.back()} />
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.orange} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Paramètres" subtitle={eglise?.nom} actionLabel="Retour" onAction={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.sectionTitle}>Fonctionnalités</Text>
        <Text style={styles.sectionHint}>
          Désactive ce qui ne s'applique pas à cette église. Une fonctionnalité désactivée disparaît de
          l'app (membre et admin) et n'est plus accessible du tout.
        </Text>
        {(Object.keys(FEATURE_LABELS) as (keyof EgliseFeatures)[]).map((key) => (
          <FormCheck key={key} label={FEATURE_LABELS[key]} value={features[key]} onValueChange={toggleFeature(key)} />
        ))}

        <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Couleurs</Text>
        <Text style={styles.sectionHint}>
          Code hexadécimal (ex : #F0602E). Laisse vide pour garder la couleur par défaut de l'app.
        </Text>
        {COLOR_LABELS.map((c) => (
          <View key={c.key} style={styles.colorRow}>
            <View style={[styles.swatch, { backgroundColor: theme[c.key] || colors.cardBorder }]} />
            <View style={{ flex: 1 }}>
              <FormGroup
                label={c.label}
                value={theme[c.key] ?? ''}
                onChangeText={setColor(c.key)}
                placeholder="#F0602E"
                autoCapitalize="none"
              />
            </View>
          </View>
        ))}

        <PillButton title="Enregistrer" onPress={onSave} loading={saving} style={{ marginTop: spacing.md }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 80 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.textDark, marginBottom: 6 },
  sectionHint: { fontSize: 12, color: colors.textLight, marginBottom: spacing.md, lineHeight: 18 },
  error: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.lg,
  },
});
