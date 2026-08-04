import { Redirect, Slot } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { SuperAdminTabBar } from '@/components/SuperAdminTabBar';
import { useAuth } from '@/lib/auth-context';
import { colors } from '@/theme/tokens';

export default function SuperAdminLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.orange} />
      </View>
    );
  }

  if (!user || user.role !== 'super_admin') {
    return <Redirect href="/" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <SuperAdminTabBar />
    </View>
  );
}
