import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppFrame } from '@/components/AppFrame';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { registerForPushNotifications } from '@/lib/push-notifications';
import { ThemeProvider } from '@/lib/theme-context';

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
          <ThemeProvider>
            <StatusBar style="light" />
            <PushNotificationsRegistrar />
            <AppFrame>
              <Slot />
            </AppFrame>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
