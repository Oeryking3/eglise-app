<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

/**
 * La règle "image" de Laravel s'appuie sur la détection système du type du
 * fichier, qui se trompe pour certaines photos pourtant valides (rejette des
 * fichiers réellement au format image). On vérifie ici directement la
 * signature du fichier (ses premiers octets), ce qui est plus fiable.
 */
class ValidImage implements ValidationRule
{
    private const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $value instanceof UploadedFile) {
            $fail('Le champ :attribute doit être un fichier.');

            return;
        }

        $extension = strtolower((string) $value->getClientOriginalExtension());

        if (! in_array($extension, self::ALLOWED_EXTENSIONS, true)) {
            $fail('Le champ :attribute doit être une image (jpg, png, gif, webp ou bmp).');

            return;
        }

        $handle = fopen($value->getRealPath(), 'rb');
        $header = $handle ? fread($handle, 12) : false;
        if ($handle) {
            fclose($handle);
        }

        if ($header === false || ! $this->hasImageSignature($header)) {
            $fail('Le champ :attribute doit être une image valide.');
        }
    }

    private function hasImageSignature(string $header): bool
    {
        return str_starts_with($header, "\xFF\xD8\xFF") // JPEG
            || str_starts_with($header, "\x89PNG\x0D\x0A\x1A\x0A") // PNG
            || str_starts_with($header, 'GIF87a') || str_starts_with($header, 'GIF89a') // GIF
            || str_starts_with($header, 'BM') // BMP
            || (str_starts_with($header, 'RIFF') && substr($header, 8, 4) === 'WEBP'); // WEBP
    }
}
