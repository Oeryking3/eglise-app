import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../theme/tokens';
import { DateField } from './DateField';
import { FormGroup } from './FormGroup';
import { PillButton } from './PillButton';
import { TimeField } from './TimeField';

const TODAY = new Date(new Date().setHours(0, 0, 0, 0));

export type AgendaFormValues = {
  titre: string;
  description: string;
  date_rappel: string;
  heure_rappel: string;
};

type Props = {
  initialValues?: Partial<AgendaFormValues>;
  submitLabel: string;
  onSubmit: (values: AgendaFormValues) => Promise<void>;
};

export function AgendaForm({ initialValues, submitLabel, onSubmit }: Props) {
  const [values, setValues] = useState<AgendaFormValues>({
    titre: initialValues?.titre ?? '',
    description: initialValues?.description ?? '',
    date_rappel: initialValues?.date_rappel ?? '',
    heure_rappel: initialValues?.heure_rappel ?? '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof AgendaFormValues) => (value: string) => setValues((v) => ({ ...v, [key]: value }));

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
      <FormGroup label="Titre" value={values.titre} onChangeText={set('titre')} placeholder="Ex: Réunion de prière" />
      <FormGroup
        label="Description"
        value={values.description}
        onChangeText={set('description')}
        placeholder="Détails (optionnel)"
        multiline
      />
      <DateField label="Date" value={values.date_rappel} onChange={set('date_rappel')} minimumDate={TODAY} />
      <TimeField label="Heure (optionnel)" value={values.heure_rappel} onChange={set('heure_rappel')} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PillButton title={submitLabel} onPress={submit} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 60 },
  error: { color: colors.error, fontSize: 13, marginBottom: spacing.lg, fontWeight: '700' },
});
