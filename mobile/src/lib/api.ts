import axios from 'axios';
import { deleteItem, getItem, setItem } from './storage';

const TOKEN_KEY = 'eglise_auth_token';
const ACTIVE_EGLISE_KEY = 'eglise_active_eglise_id';

// En dev, remplace par l'IP locale de ta machine (ex: http://192.168.1.10:8000/api)
// si tu testes sur un téléphone physique via Expo Go — "localhost" ne fonctionne
// que sur un émulateur tournant sur la même machine que le serveur Laravel.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const activeEgliseId = await getItem(ACTIVE_EGLISE_KEY);
  if (activeEgliseId) {
    config.headers['X-Eglise-Id'] = activeEgliseId;
  }
  return config;
});

export async function saveToken(token: string) {
  await setItem(TOKEN_KEY, token);
}

export async function clearToken() {
  await deleteItem(TOKEN_KEY);
}

export async function getToken() {
  return getItem(TOKEN_KEY);
}

export async function setActiveEgliseId(id: number) {
  await setItem(ACTIVE_EGLISE_KEY, String(id));
}

export async function clearActiveEgliseId() {
  await deleteItem(ACTIVE_EGLISE_KEY);
}

export async function getActiveEgliseId(): Promise<number | null> {
  const value = await getItem(ACTIVE_EGLISE_KEY);
  return value ? Number(value) : null;
}

export type ApiValidationError = {
  message: string;
  errors?: Record<string, string[]>;
};

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiValidationError | undefined;
    if (data?.errors) {
      const first = Object.values(data.errors)[0]?.[0];
      if (first) return first;
    }
    if (data?.message) return data.message;
  }
  return "Une erreur est survenue. Réessaie.";
}
