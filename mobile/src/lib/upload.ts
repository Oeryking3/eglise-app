import { Platform } from 'react-native';
import type { ImagePickerAsset } from 'expo-image-picker';

// Sur le web, ImagePicker peut ne pas exposer directement le File navigateur.
// On reconstruit donc un vrai File à partir de l'URI pour que Laravel
// reçoive un fichier multipart valide et accepte bien le champ image.
export async function appendImageAsset(form: FormData, field: string, asset: ImagePickerAsset) {
  if (Platform.OS === 'web') {
    const webFile = (asset as unknown as { file?: File }).file;

    if (webFile) {
      form.append(field, webFile, asset.fileName ?? webFile.name ?? 'image.jpg');
      return;
    }

    const response = await fetch(asset.uri);
    const blob = await response.blob();
    const fileName = asset.fileName ?? `image-${Date.now()}.jpg`;
    const file = new File([blob], fileName, {
      type: blob.type || asset.mimeType || 'image/jpeg',
    });

    form.append(field, file, fileName);
    return;
  }

  form.append(field, {
    uri: asset.uri,
    name: asset.fileName ?? 'image.jpg',
    type: asset.mimeType ?? 'image/jpeg',
  } as unknown as Blob);
}
