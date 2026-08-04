import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { NotificationForm, type NotificationFormValues } from '@/components/NotificationForm';
import { api, extractErrorMessage } from '@/lib/api';

export default function AdminNotificationModifierScreen() {
  const { id, titre, message } = useLocalSearchParams<{ id: string; titre: string; message: string }>();
  const queryClient = useQueryClient();

  const onSubmit = async (values: NotificationFormValues) => {
    try {
      await api.put(`/admin/notifications/${id}`, values);
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      router.replace('/(admin)/notifications');
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Modifier la notification" actionLabel="Retour" onAction={() => router.back()} />
      <NotificationForm submitLabel="Mettre à jour" onSubmit={onSubmit} initialValues={{ titre, message }} />
    </View>
  );
}
