import * as ImagePicker from 'expo-image-picker';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { PillButton } from '@/components/PillButton';
import { api, extractErrorMessage } from '@/lib/api';
import { appendImageAsset } from '@/lib/upload';
import { colors, radii, spacing } from '@/theme/tokens';

type CarouselSlide = {
  id: number;
  image_url: string;
  ordre: number;
  actif: boolean;
};

export default function AdminCarouselScreen() {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-carousel'],
    queryFn: async () => (await api.get<{ data: CarouselSlide[] }>('/admin/carousel')).data.data,
  });

  const uploadImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission nécessaire', 'Autorise l’accès aux photos pour ajouter une affiche.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      allowsEditing: false,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    const formData = new FormData();

    await appendImageAsset(formData, 'image', asset);
    formData.append('actif', '1');

    try {
      setIsUploading(true);
      await api.post('/admin/carousel', formData, {
        headers: { Accept: 'application/json' },
      });
      await queryClient.invalidateQueries({ queryKey: ['admin-carousel'] });
      Alert.alert('Image ajoutée', 'L’affiche est maintenant visible dans l’accueil membre.');
    } catch (error) {
      Alert.alert('Erreur', extractErrorMessage(error));
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = (slide: CarouselSlide) => {
    Alert.alert('Supprimer cette affiche ?', 'Elle disparaîtra du carrousel membre.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/carousel/${slide.id}`);
            await queryClient.invalidateQueries({ queryKey: ['admin-carousel'] });
          } catch (error) {
            Alert.alert('Erreur', extractErrorMessage(error));
          }
        },
      },
    ]);
  };

  const slides = data ?? [];

  return (
    <View style={styles.screen}>
      <AdminPageHeader
        title="Carrousel"
        subtitle="Gère les affiches de l’accueil membre."
        actionLabel="+ Ajouter"
        onAction={isUploading ? undefined : uploadImage}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? <Text style={styles.empty}>Chargement...</Text> : null}
        {!isLoading && slides.length === 0 ? (
          <View style={styles.emptyBlock}>
            <Text style={styles.emptyTitle}>Aucune affiche</Text>
            <Text style={styles.empty}>Ajoute une image pour la faire apparaître sur l’accueil membre.</Text>
            <PillButton
              title={isUploading ? 'Envoi en cours...' : 'Ajouter une image'}
              onPress={isUploading ? undefined : uploadImage}
              style={styles.addButton}
            />
          </View>
        ) : null}
        {slides.map((slide) => (
          <View key={slide.id} style={styles.card}>
            <Image source={{ uri: slide.image_url }} style={styles.image} resizeMode="cover" />
            <View style={styles.cardFooter}>
              <Text style={styles.order}>Affiche {slide.ordre + 1}</Text>
              <Pressable onPress={() => deleteImage(slide)} hitSlop={10}>
                <Text style={styles.delete}>Supprimer</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: spacing.xl, paddingBottom: 100 },
  card: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: colors.white,
  },
  image: { width: '100%', height: 180, backgroundColor: colors.orangeLight },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  order: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  delete: { color: colors.error, fontSize: 12, fontWeight: '800' },
  emptyBlock: { alignItems: 'center', paddingTop: spacing.xl, paddingHorizontal: spacing.lg },
  emptyTitle: { color: colors.textDark, fontSize: 16, fontWeight: '800', marginBottom: spacing.xs },
  empty: { color: colors.textFaint, fontSize: 13, textAlign: 'center' },
  addButton: { marginTop: spacing.lg },
});
