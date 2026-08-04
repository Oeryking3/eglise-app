import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme/tokens';

export type ActionSheetButton = {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
};

type ActionSheetState = {
  title: string;
  message?: string;
  buttons: ActionSheetButton[];
};

// Remplace Alert.alert(title, message, buttons) : react-native-web ne gère
// pas fiablement les alertes à plusieurs boutons (le callback du bouton
// "destructive" ne se déclenche pas toujours au clic sur navigateur), donc
// tous les boutons Supprimer/Annuler basés sur Alert.alert restaient sans
// effet sur le web. Ce composant reproduit la même API en JS pur.
export function useActionSheet() {
  const [state, setState] = useState<ActionSheetState | null>(null);

  const show = (title: string, message: string | undefined, buttons: ActionSheetButton[]) => {
    setState({ title, message, buttons });
  };

  const close = () => setState(null);

  const sheet = state ? (
    <Modal transparent visible animationType="fade" onRequestClose={close}>
      <Pressable style={styles.overlay} onPress={close}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{state.title}</Text>
          {state.message ? <Text style={styles.message}>{state.message}</Text> : null}
          <View style={styles.buttons}>
            {state.buttons.map((b, i) => (
              <Pressable
                key={i}
                style={[styles.btn, b.style === 'cancel' && styles.btnCancel]}
                onPress={() => {
                  close();
                  b.onPress?.();
                }}
              >
                <Text
                  style={[
                    styles.btnText,
                    b.style === 'destructive' && styles.destructiveText,
                    b.style === 'cancel' && styles.cancelText,
                  ]}
                >
                  {b.text}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  ) : null;

  return { show, sheet };
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: radii.lg,
    padding: spacing.xl,
  },
  title: { fontSize: 16, fontWeight: '800', color: colors.textDark },
  message: { fontSize: 13, color: colors.textMuted, marginTop: 8, lineHeight: 19 },
  buttons: { marginTop: spacing.xl, gap: spacing.sm },
  btn: {
    paddingVertical: 12,
    borderRadius: radii.sm,
    alignItems: 'center',
    backgroundColor: colors.orangeLight,
  },
  btnCancel: { backgroundColor: '#f2f2f2' },
  btnText: { fontSize: 14, fontWeight: '700', color: colors.orangeDark },
  destructiveText: { color: colors.error },
  cancelText: { color: colors.textMuted },
});
