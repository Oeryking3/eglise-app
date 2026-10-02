import { Platform } from 'react-native';
import type { ImagePickerAsset } from 'expo-image-picker';

// Sur le web, ImagePicker peut ne pas exposer directement le File navigateur.
// On reconstruit donc un vrai File à partir de l'URI pour que Laravel
// reçoive un fichier multipart valide et accepte bien le champ image.
async function appendMediaAsset(form: FormData, field: string, asset: ImagePickerAsset, fallbackName: string) {
  const fileName = asset.fileName ?? fallbackName;

  if (Platform.OS === 'web') {
    const webFile = (asset as unknown as { file?: File }).file;

    if (webFile) {
      form.append(field, webFile, asset.fileName ?? webFile.name ?? fallbackName);
      return;
    }

    const response = await fetch(asset.uri);
    const blob = await response.blob();
    const resolvedName = asset.fileName ?? `${fallbackName.split('.')[0]}-${Date.now()}.${fallbackName.split('.').at(-1)}`;
    const file = new File([blob], resolvedName, {
      type: blob.type || asset.mimeType || (fallbackName.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg'),
    });

    form.append(field, file, resolvedName);
    return;
  }

  form.append(field, {
    uri: asset.uri,
    name: fileName,
    type: asset.mimeType ?? (fallbackName.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg'),
  } as unknown as Blob);
}

export function appendImageAsset(form: FormData, field: string, asset: ImagePickerAsset) {
  return appendMediaAsset(form, field, asset, 'image.jpg');
}
