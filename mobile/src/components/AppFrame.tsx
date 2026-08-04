import { type PropsWithChildren } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

// Largeur au-delà de laquelle on "encadre" le contenu façon téléphone plutôt
// que de l'étirer sur toute la largeur — couvre à la fois le navigateur web
// redimensionné en grand et les tablettes (natif ou web).
const MAX_CONTENT_WIDTH = 480;

export function AppFrame({ children }: PropsWithChildren) {
  const { width } = useWindowDimensions();
  const isWide = width > MAX_CONTENT_WIDTH;

  return (
    <View style={[styles.outer, isWide && styles.outerWide]}>
      <View style={[styles.inner, isWide && styles.innerWide]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
  },
  outerWide: {
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
  },
  innerWide: {
    maxWidth: MAX_CONTENT_WIDTH,
    flex: 1,
  },
});
