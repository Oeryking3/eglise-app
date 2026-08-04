import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { FormGroup } from '@/components/FormGroup';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import type { Role } from '@/lib/types';
import { colors, radii, spacing } from '@/theme/tokens';

export default function AdminMembreModifierScreen() {
  const params = useLocalSearchParams<{
    id: string;
    nom: string;
    prenom: string;
    email: string;
    lieu_residence: string;
    role: Role;
  }>();
  const queryClient = useQueryClient();

  const [nom, setNom] = useState(params.nom);
  const [prenom, setPrenom] = useState(params.prenom);
  const [lieuResidence, setLieuResidence] = useState(params.lieu_residence);
  const [role, setRole] = useState<Role>(params.role);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      await api.put(`/admin/membres/${params.id}`, {
        nom,
        prenom,
        lieu_residence: lieuResidence,
        role,
      });
      queryClient.invalidateQueries({ queryKey: ['admin-membres'] });
      router.replace('/(admin)/membres');
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Modifier le membre" actionLabel="Retour" onAction={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <FormGroup label="Email" value={params.email} editable={false} style={styles.disabled} />
        <FormGroup label="Nom" value={nom} onChangeText={setNom} />
        <FormGroup label="Prénom" value={prenom} onChangeText={setPrenom} />
        <FormGroup label="Lieu de résidence" value={lieuResidence} onChangeText={setLieuResidence} />

        <Text style={styles.label}>Rôle</Text>
        <View style={styles.roleRow}>
          <Pressable style={[styles.roleBtn, role === 'membre' && styles.roleBtnActive]} onPress={() => setRole('membre')}>
            <Text style={[styles.roleText, role === 'membre' && styles.roleTextActive]}>Utilisateur</Text>
          </Pressable>
          <Pressable style={[styles.roleBtn, role === 'admin_eglise' && styles.roleBtnActive]} onPress={() => setRole('admin_eglise')}>
            <Text style={[styles.roleText, role === 'admin_eglise' && styles.roleTextActive]}>Admin</Text>
          </Pressable>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PillButton title="Mettre à jour" onPress={submit} loading={loading} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 60 },
  disabled: { color: colors.textFaint },
  label: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginBottom: 6 },
  roleRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  roleBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.sm,
    paddingVertical: 12,
    alignItems: 'center',
  },
  roleBtnActive: { borderColor: colors.orange, backgroundColor: colors.orangeLight },
  roleText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  roleTextActive: { color: colors.orangeDark },
  error: { color: colors.error, fontSize: 13, marginBottom: spacing.lg, fontWeight: '700' },
});
