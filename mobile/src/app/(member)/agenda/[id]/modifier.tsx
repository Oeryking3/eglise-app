import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AgendaForm, type AgendaFormValues } from '@/components/AgendaForm';
import { HeaderWithBack } from '@/components/HeaderWithBack';
import { api, extractErrorMessage } from '@/lib/api';
import type { AgendaItem } from '@/lib/types';
import { colors } from '@/theme/tokens';

export default function AgendaModifierScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: item, isLoading } = useQuery({
    queryKey: ['agenda', id],
    queryFn: async () => {
      const all = await api.get<{ data: AgendaItem[] } | AgendaItem[]>('/agenda');
      const items = Array.isArray(all.data) ? all.data : all.data.data;
      return items.find((i) => String(i.id) === id) ?? null;
    },
  });

  const onSubmit = async (values: AgendaFormValues) => {
    try {
      await api.put(`/agenda/${id}`, values);
      queryClient.invalidateQueries({ queryKey: ['agenda'] });
      router.replace('/(member)/agenda');
    } catch (e) {
      throw new Error(extractErrorMessage(e));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderWithBack title="Modifier le rappel" backTo="/(member)/agenda" />
      {isLoading || !item ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.orange} />
      ) : (
        <AgendaForm
          submitLabel="Enregistrer"
          onSubmit={onSubmit}
          initialValues={{
            titre: item.titre,
            description: item.description ?? '',
            date_rappel: item.date_rappel,
            heure_rappel: item.heure_rappel ?? '',
          }}
        />
      )}
    </View>
  );
}
