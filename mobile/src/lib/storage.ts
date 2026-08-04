import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// expo-secure-store est un module natif (Keychain/Keystore) : pas d'implémentation
// sur le web. On retombe sur localStorage dans ce cas (utile pour tester via `w`
// dans Expo — sur iOS/Android, SecureStore reste utilisé normalement).
const isWeb = Platform.OS === 'web';

export async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  }
  return SecureStore.getItemAsync(key);
}

export async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function deleteItem(key: string): Promise<void> {
  if (isWeb) {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}
