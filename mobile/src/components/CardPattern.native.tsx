import { Image, StyleSheet } from 'react-native';

export function CardPattern() {
  return (
    <Image
      source={require('../../assets/images/carte-fond.png')}
      style={styles.pattern}
      resizeMode="repeat"
    />
  );
}

const styles = StyleSheet.create({
  pattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
