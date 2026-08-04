import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { EventForm, type EventFormValues } from '@/components/EventForm';
import { api, extractErrorMessage } from '@/lib/api';
import type { EventItem } from '@/lib/types';
import { appendImageAsset } from '@/lib/upload';
import { colors } from '@/theme/tokens';

export default function AdminEvenementModifierScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ['admin-evenement', id],
    queryFn: async () => (await api.get<EventItem>(`/admin/evenements/${id}`)).data,
  });

  const onSubmit = async (values: EventFormValues) => {
    const form = new FormData();
    form.append('titre', values.titre);
    form.append('description', values.description);
    form.append('date_evenement', values.date_evenement);
    form.append('heure_debut', values.heure_debut);
    form.append('heure_fin', values.heure_fin);
    form.append('important', values.important ? '1' : '0');
    form.append('_method', 'PUT');
    if (values.image) {
      appendImageAsset(form, 'image', values.image);
    }

    try {
      await api.post(`/admin/evenements/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      queryClient.invalidateQueries({ queryKey: ['admin-evenements'] });
      router.replace('/(admin)/evenements');
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Modifier l'événement" actionLabel="Retour" onAction={() => router.back()} />
      {isLoading || !event ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.orange} />
      ) : (
        <EventForm
          submitLabel="Enregistrer les modifications"
          onSubmit={onSubmit}
          currentImageUrl={event.image_url}
          initialValues={{
            titre: event.titre,
            description: event.description ?? '',
            date_evenement: event.date_evenement,
            heure_debut: event.heure_debut ?? '',
            heure_fin: event.heure_fin ?? '',
            important: event.important,
          }}
        />
      )}
    </View>
  );
}
