import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../theme/tokens';
import { FormGroup } from './FormGroup';
import { PillButton } from './PillButton';

export type NotificationFormValues = { titre: string; message: string };

type Props = {
  initialValues?: Partial<NotificationFormValues>;
  submitLabel: string;
  onSubmit: (values: NotificationFormValues) => Promise<void>;
};

export function NotificationForm({ initialValues, submitLabel, onSubmit }: Props) {
  const [values, setValues] = useState<NotificationFormValues>({
    titre: initialValues?.titre ?? '',
    message: initialValues?.message ?? '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <FormGroup label="Titre" value={values.titre} onChangeText={(v) => setValues((s) => ({ ...s, titre: v }))} />
      <FormGroup
        label="Message"
        value={values.message}
        onChangeText={(v) => setValues((s) => ({ ...s, message: v }))}
        multiline
        style={{ minHeight: 130 }}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PillButton title={submitLabel} onPress={submit} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 60 },
  error: { color: colors.error, fontSize: 13, marginBottom: spacing.lg, fontWeight: '700' },
});
