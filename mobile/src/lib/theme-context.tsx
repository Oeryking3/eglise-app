import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import { colors as defaultColors } from '../theme/tokens';
import { useAuth } from './auth-context';

type ThemeColors = typeof defaultColors;

const ThemeContext = createContext<ThemeColors>(defaultColors);

/**
 * Résout les couleurs "de marque" (orange*) de l'église active à la place
 * des valeurs par défaut. Le reste de la palette (textes, statuts, couleurs
 * de moyens de paiement...) reste toujours fixe — seule l'identité visuelle
 * de l'église est personnalisable.
 */
export function ThemeProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const theme = user?.eglise_theme;

  const value = useMemo<ThemeColors>(() => {
    if (!theme) return defaultColors;

    return {
      ...defaultColors,
      orange: theme.couleur_primaire ?? defaultColors.orange,
      orangeDark: theme.couleur_primaire_sombre ?? defaultColors.orangeDark,
      orangeHeader: theme.couleur_entete ?? defaultColors.orangeHeader,
      orangeLight: theme.couleur_primaire_claire ?? defaultColors.orangeLight,
      orangeBorder: theme.couleur_bordure ?? defaultColors.orangeBorder,
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeColors(): ThemeColors {
  return useContext(ThemeContext);
}
