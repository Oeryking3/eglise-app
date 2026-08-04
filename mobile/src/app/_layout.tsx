import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppFrame } from '@/components/AppFrame';
import { AuthProvider } from '@/lib/auth-context';

export default function RootLayout() {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="light" />
          <AppFrame>
            <Slot />
          </AppFrame>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
