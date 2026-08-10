import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { DateField } from '@/components/DateField';
import { FormCheck, FormGroup } from '@/components/FormGroup';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import type { User } from '@/lib/types';
import { appendImageAsset } from '@/lib/upload';
import { colors, radii, spacing } from '@/theme/tokens';

const TODAY = new Date(new Date().setHours(0, 0, 0, 0));

export default function AdminCarteModifierScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: member, isLoading } = useQuery({
    queryKey: ['admin-carte', id],
    queryFn: async () => (await api.get<{ data: User }>(`/admin/cartes/${id}`)).data.data,
  });

  const [dateNaissance, setDateNaissance] = useState('');
  const [sexe, setSexe] = useState<'M' | 'F' | ''>('');
  const [groupeSanguin, setGroupeSanguin] = useState('');
  const [carteExpiration, setCarteExpiration] = useState('');
  const [carteMembre, setCarteMembre] = useState(false);
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setDateNaissance(member.date_naissance ?? '');
      setSexe((member.sexe as 'M' | 'F') ?? '');
      setGroupeSanguin(member.groupe_sanguin ?? '');
      setCarteExpiration(member.carte_expiration ?? '');
      setCarteMembre(member.carte_membre);
    }
  }, [member]);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0]);
    }
  };

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append('date_naissance', dateNaissance);
      form.append('sexe', sexe);
      form.append('groupe_sanguin', groupeSanguin);
      form.append('carte_expiration', carteExpiration);
      form.append('carte_membre', carteMembre ? '1' : '0');
      form.append('_method', 'PUT');
      if (photo) {
        appendImageAsset(form, 'carte_photo', photo);
      }

      await api.post(`/admin/cartes/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      queryClient.invalidateQueries({ queryKey: ['admin-cartes'] });
      router.replace('/(admin)/cartes');
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const previewUri = photo?.uri ?? member?.carte_photo_url ?? null;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader
        title={member ? `Carte de ${member.prenom} ${member.nom}` : 'Carte de membre'}
        actionLabel="Retour"
        onAction={() => router.back()}
      />
      {isLoading || !member ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.orange} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.label}>Photo</Text>
          {previewUri ? <Image source={{ uri: previewUri }} style={styles.preview} /> : null}
          <PillButton title="Choisir une photo" variant="outline" onPress={pickPhoto} style={{ marginBottom: spacing.lg }} />

          <DateField label="Date de naissance" value={dateNaissance} onChange={setDateNaissance} maximumDate={TODAY} />

          <Text style={styles.label}>Sexe</Text>
          <View style={styles.row}>
            {(['M', 'F'] as const).map((s) => (
              <Pressable
                key={s}
                style={[styles.choice, sexe === s && styles.choiceActive]}
                onPress={() => setSexe(s)}
              >
                <Text style={[styles.choiceText, sexe === s && styles.choiceTextActive]}>{s}</Text>
              </Pressable>
            ))}
          </View>

          <FormGroup label="Groupe sanguin" value={groupeSanguin} onChangeText={setGroupeSanguin} placeholder="B+" />
          <DateField label="Date d'expiration de la carte" value={carteExpiration} onChange={setCarteExpiration} minimumDate={TODAY} />

          <FormCheck label="Carte active" value={carteMembre} onValueChange={setCarteMembre} />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PillButton title="Enregistrer la carte" onPress={submit} loading={loading} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 60 },
  label: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginBottom: 6 },
  preview: { width: 130, height: 130, borderRadius: radii.md, marginBottom: spacing.md, backgroundColor: colors.orangeLight },
  row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  choice: {
    width: 60,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.sm,
    alignItems: 'center',
  },
  choiceActive: { borderColor: colors.orange, backgroundColor: colors.orangeLight },
  choiceText: { fontWeight: '700', color: colors.textMuted },
  choiceTextActive: { color: colors.orangeDark },
  error: { color: colors.error, fontSize: 13, marginBottom: spacing.lg, fontWeight: '700' },
});
