import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { View } from 'react-native';
import { AgendaForm, type AgendaFormValues } from '@/components/AgendaForm';
import { HeaderWithBack } from '@/components/HeaderWithBack';
import { api, extractErrorMessage } from '@/lib/api';

export default function AgendaCreerScreen() {
  const queryClient = useQueryClient();

  const onSubmit = async (values: AgendaFormValues) => {
    try {
      await api.post('/agenda', values);
      queryClient.invalidateQueries({ queryKey: ['agenda'] });
      router.replace('/(member)/agenda');
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderWithBack title="Nouveau rappel" backTo="/(member)/agenda" />
      <AgendaForm submitLabel="Ajouter le rappel" onSubmit={onSubmit} />
    </View>
  );
}
