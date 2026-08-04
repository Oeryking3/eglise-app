import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme/tokens';
import { DateField } from './DateField';
import { FormCheck, FormGroup } from './FormGroup';
import { PillButton } from './PillButton';
import { TimeField } from './TimeField';

// Le backend exige date_evenement >= aujourd'hui (validation Laravel
// "after_or_equal:today") — on empêche donc de choisir une date passée.
const TODAY = new Date(new Date().setHours(0, 0, 0, 0));

export type EventFormValues = {
  titre: string;
  description: string;
  date_evenement: string;
  heure_debut: string;
  heure_fin: string;
  important: boolean;
  image: ImagePicker.ImagePickerAsset | null;
};

type Props = {
  initialValues?: Partial<EventFormValues>;
  currentImageUrl?: string | null;
  submitLabel: string;
  onSubmit: (values: EventFormValues) => Promise<void>;
};

export function EventForm({ initialValues, currentImageUrl, submitLabel, onSubmit }: Props) {
  const [values, setValues] = useState<EventFormValues>({
    titre: initialValues?.titre ?? '',
    description: initialValues?.description ?? '',
    date_evenement: initialValues?.date_evenement ?? '',
    heure_debut: initialValues?.heure_debut ?? '',
    heure_fin: initialValues?.heure_fin ?? '',
    important: initialValues?.important ?? false,
    image: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof EventFormValues>(key: K) => (value: EventFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      set('image')(result.assets[0]);
    }
  };

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

  const previewUri = values.image?.uri ?? currentImageUrl ?? null;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.label}>Photo</Text>
      {previewUri ? <Image source={{ uri: previewUri }} style={styles.preview} /> : null}
      <PillButton title="Choisir une image" variant="outline" onPress={pickImage} style={{ marginBottom: spacing.lg }} />

      <FormGroup label="Titre" value={values.titre} onChangeText={set('titre')} placeholder="Titre de l'événement" />
      <FormGroup label="Description" value={values.description} onChangeText={set('description')} multiline />

      <DateField label="Date de l'événement" value={values.date_evenement} onChange={set('date_evenement')} minimumDate={TODAY} />
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <TimeField label="Heure début" value={values.heure_debut} onChange={set('heure_debut')} />
        </View>
        <View style={styles.rowItem}>
          <TimeField label="Heure fin" value={values.heure_fin} onChange={set('heure_fin')} />
        </View>
      </View>

      <FormCheck
        label='Marquer comme événement à venir (3 maximum)'
        value={values.important}
        onValueChange={set('important')}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PillButton title={submitLabel} onPress={submit} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 60 },
  label: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginBottom: 6 },
  preview: { width: 130, height: 130, borderRadius: radii.md, marginBottom: spacing.md, backgroundColor: colors.orangeLight },
  row: { flexDirection: 'row', gap: spacing.md },
  rowItem: { flex: 1 },
  error: { color: colors.error, fontSize: 13, marginBottom: spacing.lg, fontWeight: '700' },
});
