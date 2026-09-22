import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { EventForm, type EventFormValues } from '@/components/EventForm';
import { api, extractErrorMessage } from '@/lib/api';
import { appendImageAsset } from '@/lib/upload';

export default function AdminEvenementCreerScreen() {
  const queryClient = useQueryClient();

  const onSubmit = async (values: EventFormValues) => {
    const form = new FormData();
    form.append('titre', values.titre);
    form.append('description', values.description);
    form.append('date_evenement', values.date_evenement);
    form.append('heure_debut', values.heure_debut);
    form.append('heure_fin', values.heure_fin);
    form.append('important', values.important ? '1' : '0');
    if (values.image) {
      await appendImageAsset(form, 'image', values.image);
    }

    try {
      await api.post('/admin/evenements', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      queryClient.invalidateQueries({ queryKey: ['admin-evenements'] });
      router.replace('/(admin)/evenements');
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Nouvel événement" actionLabel="Retour" onAction={() => router.back()} />
      <EventForm submitLabel="Publier l'événement" onSubmit={onSubmit} />
    </View>
  );
}
