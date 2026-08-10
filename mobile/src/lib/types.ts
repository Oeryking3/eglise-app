export type Role = 'super_admin' | 'admin_eglise' | 'membre';

export type EgliseFeatures = {
  evenements: boolean;
  agenda: boolean;
  carte: boolean;
  livres: boolean;
  avantages: boolean;
  notifications: boolean;
  direct: boolean;
  programme: boolean;
};

export type EgliseTheme = {
  couleur_primaire: string | null;
  couleur_primaire_sombre: string | null;
  couleur_entete: string | null;
  couleur_primaire_claire: string | null;
  couleur_bordure: string | null;
};

export type User = {
  id: number;
  eglise_id: number | null;
  eglise_nom: string | null;
  eglise_features: EgliseFeatures;
  eglise_theme: EgliseTheme | null;
  member_id: string | null;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  date_naissance: string | null;
  sexe: string | null;
  lieu_residence: string | null;
  groupe_sanguin: string | null;
  carte_membre: boolean;
  carte_photo_url: string | null;
  carte_expiration: string | null;
  carte_est_valide: boolean;
};

export type Eglise = {
  id: number;
  nom: string;
  code: string;
  ville: string | null;
  adresse: string | null;
  statut: 'en_attente' | 'active' | 'desactivee' | 'refusee';
  contact_nom: string;
  contact_email: string;
  contact_telephone: string | null;
  motif_refus: string | null;
  approuvee_at: string | null;
  created_at: string;
  features: EgliseFeatures;
  theme: EgliseTheme;
};

export type GlobalStats = {
  eglises: {
    total: number;
    active: number;
    en_attente: number;
    desactivee: number;
    refusee: number;
  };
  membres: number;
  evenements: number;
  paiements: number;
  revenus: number;
};

export type EventItem = {
  id: number;
  titre: string;
  description: string | null;
  image_url: string;
  date_evenement: string;
  heure_debut: string | null;
  heure_fin: string | null;
  important: boolean;
};

export type AgendaItem = {
  id: number;
  titre: string;
  description: string | null;
  date_rappel: string;
  heure_rappel: string | null;
  notifie: boolean;
};

export type Payment = {
  id: number;
  user?: User;
  livre_id: number | null;
  produit: string;
  montant: number;
  methode: 'wave' | 'orange' | 'mtn' | 'moov' | 'card' | null;
  telephone: string | null;
  statut: 'en_attente' | 'reussi' | 'echoue';
  reference: string;
  created_at: string;
};

export type Livre = {
  id: number;
  titre: string;
  description: string | null;
  prix: number;
  achete: boolean;
  fichier_url: string | null;
};

export type CardBenefit = {
  id: number;
  titre: string;
  description: string | null;
};

export type ProgrammeItem = {
  id: number;
  jour: string;
  titre: string;
  horaires: string;
  ordre: number;
};

export type ChurchNotification = {
  id: number;
  titre: string;
  message: string;
  created_at: string;
};

export type LiveStream = {
  url: string | null;
  actif: boolean;
  embed_url: string | null;
};

export type Paginated<T> = {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
  links: {
    next: string | null;
    prev: string | null;
  };
};
