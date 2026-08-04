import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { NotificationForm } from '@/components/NotificationForm';
import { api, extractErrorMessage } from '@/lib/api';

export default function AdminAvantageCreerScreen() {
  const queryClient = useQueryClient();

  const onSubmit = async (values: { titre: string; message: string }) => {
    try {
      await api.post('/admin/avantages', { titre: values.titre, description: values.message });
      queryClient.invalidateQueries({ queryKey: ['admin-avantages'] });
      router.replace('/(admin)/avantages');
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Nouvel avantage" actionLabel="Retour" onAction={() => router.back()} />
      <NotificationForm submitLabel="Ajouter l'avantage" onSubmit={onSubmit} />
    </View>
  );
}
