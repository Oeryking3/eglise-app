import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/tokens';

type Props = {
  title: string;
  subtitle?: string;
  backTo?: string;
};

export function HeaderWithBack({ title, subtitle, backTo }: Props) {
  return (
    <SafeAreaView edges={['top']} style={styles.wrap}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <Pressable
          hitSlop={12}
          onPress={() => (backTo ? router.replace(backTo as never) : router.back())}
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.orangeHeader,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: spacing.md,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 4,
  },
  back: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 32,
  },
});
