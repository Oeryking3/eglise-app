import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { View } from 'react-native';
import { AdminPageHeader } from '@/components/AdminPageHeader';
import { NotificationForm, type NotificationFormValues } from '@/components/NotificationForm';
import { api, extractErrorMessage } from '@/lib/api';

export default function AdminNotificationCreerScreen() {
  const queryClient = useQueryClient();

  const onSubmit = async (values: NotificationFormValues) => {
    try {
      await api.post('/admin/notifications', values);
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      router.replace('/(admin)/notifications');
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminPageHeader title="Nouvelle notification" actionLabel="Retour" onAction={() => router.back()} />
      <NotificationForm submitLabel="Publier" onSubmit={onSubmit} />
    </View>
  );
}
