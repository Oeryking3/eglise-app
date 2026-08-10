import type { ReactNode } from 'react';
import { useState } from 'react';
import { IconField } from './IconField';

type Props = {
  icon: ReactNode;
  value: string; // "AAAA-MM-JJ" ou ''
  onChange: (isoValue: string) => void;
};

// Saisie libre au format JJ/MM/AAAA (pas de calendrier) — l'utilisateur tape
// sa date lui-même, les "/" s'ajoutent automatiquement. On ne remonte une
// valeur ISO (attendue par le backend) que lorsque la date est complète et
// valide, pour éviter d'envoyer une date bancale pendant la saisie.
function formatAsTyped(digits: string): string {
  const d = digits.slice(0, 2);
  const m = digits.slice(2, 4);
  const y = digits.slice(4, 8);
  if (digits.length <= 2) return d;
  if (digits.length <= 4) return `${d}/${m}`;
  return `${d}/${m}/${y}`;
}

function toIsoIfValid(digits: string): string {
  if (digits.length !== 8) return '';
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900) return '';

  const date = new Date(year, month - 1, day);
  const isReal = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  if (!isReal) return '';

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function BirthDateField({ icon, value, onChange }: Props) {
  const initialDisplay = value ? value.split('-').reverse().join('/') : '';
  const [display, setDisplay] = useState(initialDisplay);

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    setDisplay(formatAsTyped(digits));
    onChange(toIsoIfValid(digits));
  };

  return (
    <IconField
      icon={icon}
      placeholder="Date de naissance (JJ/MM/AAAA)"
      keyboardType="number-pad"
      value={display}
      onChangeText={handleChange}
      maxLength={10}
    />
  );
}
