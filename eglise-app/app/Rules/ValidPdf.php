<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

/**
 * La règle "mimes:pdf" de Laravel s'appuie sur la détection système du type
 * du fichier, qui se trompe pour certains PDF pourtant valides (rejette des
 * fichiers réellement au format PDF). On vérifie ici directement la
 * signature du fichier ("%PDF-"), ce qui est plus fiable.
 */
class ValidPdf implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $value instanceof UploadedFile) {
            $fail('Le champ :attribute doit être un fichier.');

            return;
        }

        if (strtolower((string) $value->getClientOriginalExtension()) !== 'pdf') {
            $fail('Le champ :attribute doit être un fichier PDF.');

            return;
        }

        $handle = fopen($value->getRealPath(), 'rb');
        $header = $handle ? fread($handle, 5) : false;
        if ($handle) {
            fclose($handle);
        }

        if ($header !== '%PDF-') {
            $fail('Le champ :attribute doit être un fichier PDF valide.');
        }
    }
}
