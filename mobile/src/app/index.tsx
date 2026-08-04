import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/lib/auth-context';
import { colors } from '@/theme/tokens';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.orange} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (user.role === 'super_admin') {
    return <Redirect href={'/(super-admin)' as never} />;
  }

  return <Redirect href={user.role === 'admin_eglise' ? '/(admin)' : '/(member)/accueil'} />;
}
