// Formatage centralisé des dates/heures pour toute l'app, en français.
// Le backend renvoie des dates au format ISO "AAAA-MM-JJ" et des heures
// "HH:MM" (chaînes brutes, pas des objets Date) — ces helpers les rendent
// lisibles de façon cohérente partout où elles s'affichent.

export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '—';
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(hhmm: string | null | undefined): string {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':');
  if (!h || !m) return hhmm;
  return `${h}h${m}`;
}

export function formatDateTime(isoDateTime: string | null | undefined): string {
  if (!isoDateTime) return '—';
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return isoDateTime;
  return date.toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Pour "date · heure_debut–heure_fin" (événements, agenda).
export function formatDateAndRange(
  isoDate: string | null | undefined,
  start: string | null | undefined,
  end?: string | null | undefined,
): string {
  const datePart = formatDate(isoDate);
  if (!start) return datePart;
  const range = end ? `${formatTime(start)}–${formatTime(end)}` : formatTime(start);
  return `${datePart} · ${range}`;
}
