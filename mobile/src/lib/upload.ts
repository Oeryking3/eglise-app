import { Platform } from 'react-native';
import type { ImagePickerAsset } from 'expo-image-picker';

// Sur le web, expo-image-picker expose le vrai fichier navigateur (File) via
// asset.file — FormData.append n'accepte un objet {uri, name, type} que sur
// natif (où le polyfill FormData de React Native sait aller lire l'uri
// lui-même). Sur le web, passer cet objet littéral n'attache aucune vraie
// donnée d'image, d'où l'erreur "The image field must be an image."
export function appendImageAsset(form: FormData, field: string, asset: ImagePickerAsset) {
  const webFile = (asset as unknown as { file?: Blob }).file;

  if (Platform.OS === 'web' && webFile) {
    form.append(field, webFile, asset.fileName ?? 'image.jpg');
    return;
  }

  form.append(field, {
    uri: asset.uri,
    name: asset.fileName ?? 'image.jpg',
    type: asset.mimeType ?? 'image/jpeg',
  } as unknown as Blob);
}
