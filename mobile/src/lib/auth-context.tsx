import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import {
  api,
  clearActiveEgliseId,
  clearToken,
  extractErrorMessage,
  getActiveEgliseId,
  getToken,
  saveToken,
  setActiveEgliseId,
} from './api';
import type { User } from './types';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  activeEgliseId: number | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    nom: string;
    prenom: string;
    email: string;
    password: string;
    eglise_id: number;
    date_naissance?: string;
    sexe?: string;
    lieu_residence?: string;
  }) => Promise<void>;
  requestChurchAdmin: (data: {
    nom: string;
    code: string;
    ville?: string;
    adresse?: string;
    contact_nom: string;
    contact_email: string;
    contact_telephone?: string;
    password: string;
    password_confirmation: string;
  }) => Promise<string>;
  setActiveEglise: (id: number) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEgliseId, setActiveEgliseIdState] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await api.get<{ data: User }>('/me');
        setUser(data.data);
        setActiveEgliseIdState(await getActiveEgliseId());
      } catch {
        await clearToken();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post<{ user: User; token: string }>('/login', { email, password });
      await saveToken(data.token);
      setUser(data.user);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const register = async (payload: Parameters<AuthContextValue['register']>[0]) => {
    try {
      const { data } = await api.post<{ user: User; token: string }>('/register', payload);
      await saveToken(data.token);
      setUser(data.user);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const requestChurchAdmin = async (payload: Parameters<AuthContextValue['requestChurchAdmin']>[0]) => {
    try {
      const { data } = await api.post<{ message: string }>('/eglises/demandes', payload);
      return data.message;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  const setActiveEglise = async (id: number) => {
    await setActiveEgliseId(id);
    setActiveEgliseIdState(id);
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch {
      // le token est peut-être déjà invalide côté serveur, on nettoie quand même localement
    }
    await clearToken();
    await clearActiveEgliseId();
    setUser(null);
    setActiveEgliseIdState(null);
  };

  const value = useMemo(
    () => ({ user, isLoading, activeEgliseId, login, register, requestChurchAdmin, setActiveEglise, logout }),
    [user, isLoading, activeEgliseId],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return ctx;
}
