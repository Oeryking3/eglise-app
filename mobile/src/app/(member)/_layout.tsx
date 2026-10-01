import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { MemberTabBar } from '@/components/MemberTabBar';
import { useAuth } from '@/lib/auth-context';
import { colors } from '@/theme/tokens';

export default function MemberLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.orange} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
      <MemberTabBar />
    </View>
  );
}
