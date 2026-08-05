import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppFrame } from '@/components/AppFrame';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { registerForPushNotifications } from '@/lib/push-notifications';

function PushNotificationsRegistrar() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      registerForPushNotifications();
    }
  }, [user]);

  return null;
}

export default function RootLayout() {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="light" />
          <PushNotificationsRegistrar />
          <AppFrame>
            <Slot />
          </AppFrame>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
