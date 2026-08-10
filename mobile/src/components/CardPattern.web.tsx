import { StyleSheet, View } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const source = require('../../assets/images/carte-fond.png');

// Sur le web, Image resizeMode="repeat" n'est pas correctement supporté par
// React Native Web (l'image est agrandie au lieu d'être répétée à sa taille
// normale). On passe donc par un vrai fond CSS répété.
export function CardPattern() {
  return (
    <View
      style={[
        styles.pattern,
        {
          containerType: 'inline-size',
          backgroundImage: `url(${source})`,
          backgroundRepeat: 'repeat',
          backgroundPosition: 'top left',
          // Le motif est réduit avant d'être répété (comme dans la maquette
          // fournie), sinon les icônes paraissent trop grandes.
          backgroundSize: '37.13cqw 23.51cqw',
        } as never,
      ]}
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
