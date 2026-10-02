import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AdvertisementMedia } from '@/components/AdvertisementMedia';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { FormGroup } from '@/components/FormGroup';
import { PillButton } from '@/components/PillButton';
import { useActionSheet } from '@/components/ActionSheet';
import { api, extractErrorMessage } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { appendImageAsset } from '@/lib/upload';
import { colors, radii, spacing } from '@/theme/tokens';

type CarouselSlide = {
  id: number;
  image_url: string | null;
  video_url: string | null;
  ordre: number;
  actif: boolean;
};

export default function AdminCarouselScreen() {
  const queryClient = useQueryClient();
  const { activeEgliseId } = useAuth();
  const { show, sheet } = useActionSheet();
  const [uploading, setUploading] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [videoUrl, setVideoUrl] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['admin-carousel', activeEgliseId],
    queryFn: async () => (await api.get<{ data: CarouselSlide[] }>('/admin/carousel')).data.data,
  });

  const addImageAdvertisement = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    const image = result.assets?.[0];
    if (result.canceled || !image) return;

    setUploading(true);
    try {
      const form = new FormData();
      await appendImageAsset(form, 'image', image);
      await api.post('/admin/carousel', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      await queryClient.invalidateQueries({ queryKey: ['admin-carousel', activeEgliseId] });
      await queryClient.invalidateQueries({ queryKey: ['carousel'] });
    } catch (error) {
      show('Ajout impossible', extractErrorMessage(error), [{ text: 'OK' }]);
    } finally {
      setUploading(false);
    }
  };

  const addVideoAdvertisement = async () => {
    if (!videoUrl.trim()) {
      show('Lien requis', 'Saisis le lien de la vidéo publicitaire.', [{ text: 'OK' }]);
      return;
    }

    setUploading(true);
    try {
      await api.post('/admin/carousel', { video_url: videoUrl.trim() });
      setVideoUrl('');
      await queryClient.invalidateQueries({ queryKey: ['admin-carousel', activeEgliseId] });
      await queryClient.invalidateQueries({ queryKey: ['carousel'] });
    } catch (error) {
      show('Ajout impossible', extractErrorMessage(error), [{ text: 'OK' }]);
    } finally {
      setUploading(false);
    }
  };

  const deleteAdvertisement = (slide: CarouselSlide) => {
    show('Supprimer cette publicité ?', 'Cette action supprimera définitivement le média.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/carousel/${slide.id}`);
            await queryClient.invalidateQueries({ queryKey: ['admin-carousel', activeEgliseId] });
            await queryClient.invalidateQueries({ queryKey: ['carousel'] });
          } catch (error) {
            show('Suppression impossible', extractErrorMessage(error), [{ text: 'OK' }]);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <AdminPageHeader title="Publicités" subtitle="Carrousel de l’église active" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.segment}>
          {(['image', 'video'] as const).map((type) => (
            <Pressable key={type} style={[styles.segmentOption, mediaType === type && styles.segmentSelected]} onPress={() => setMediaType(type)}>
              <Feather name={type === 'image' ? 'image' : 'video'} size={16} color={mediaType === type ? colors.orangeDark : colors.textMuted} />
              <Text style={[styles.segmentText, mediaType === type && styles.segmentTextSelected]}>{type === 'image' ? 'Image' : 'Vidéo'}</Text>
            </Pressable>
          ))}
        </View>
        {mediaType === 'image' ? (
          <PillButton title="Ajouter une image" onPress={addImageAdvertisement} loading={uploading} />
        ) : (
          <>
            <FormGroup
              label="Lien de la vidéo"
              value={videoUrl}
              onChangeText={setVideoUrl}
              placeholder="https://www.youtube.com/watch?v=..."
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <PillButton title="Ajouter le lien vidéo" onPress={addVideoAdvertisement} loading={uploading} />
          </>
        )}
        {isLoading ? <ActivityIndicator style={styles.loading} color={colors.orange} /> : null}
        {!isLoading && data?.length === 0 ? <Text style={styles.empty}>Aucune publicité pour cette église.</Text> : null}
        {data?.map((slide) => (
          <View key={slide.id} style={styles.item}>
            <AdvertisementMedia imageUrl={slide.image_url} videoUrl={slide.video_url} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.meta}>{slide.video_url ? 'Vidéo' : 'Image'} · Ordre {slide.ordre}</Text>
              <PillButton title="Supprimer" variant="danger" onPress={() => deleteAdvertisement(slide)} style={styles.remove} />
            </View>
          </View>
        ))}
      </ScrollView>
      {sheet}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { paddingHorizontal: spacing.xl, paddingBottom: 80, gap: spacing.md },
  segment: { flexDirection: 'row', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radii.md, overflow: 'hidden' },
  segmentOption: { flex: 1, minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  segmentSelected: { backgroundColor: colors.orangeLight },
  segmentText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  segmentTextSelected: { color: colors.orangeDark },
  loading: { marginTop: spacing.xl },
  empty: { paddingVertical: spacing.xl, color: colors.textMuted, textAlign: 'center' },
  item: { borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radii.md, padding: spacing.sm },
  image: { width: '100%', aspectRatio: 16 / 7, borderRadius: radii.sm, backgroundColor: colors.orangeLight },
  details: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, paddingTop: spacing.sm },
  meta: { flex: 1, fontSize: 12, color: colors.textMuted, fontWeight: '700' },
  remove: { width: 'auto', paddingHorizontal: spacing.md, paddingVertical: 8 },
});
