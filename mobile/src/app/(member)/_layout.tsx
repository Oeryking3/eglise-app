import { Stack } from 'expo-router';
import { View } from 'react-native';
import { MemberTabBar } from '@/components/MemberTabBar';

export default function MemberLayout() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
      <MemberTabBar />
    </View>
  );
}
