<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ExpoPushService
{
    private const ENDPOINT = 'https://exp.host/--/api/v2/push/send';

    private const CHUNK_SIZE = 100;

    /**
     * Envoie une notification push aux tokens donnés. Expo limite chaque
     * requête à 100 tokens, on découpe donc si besoin.
     */
    public function send(array $tokens, string $title, string $body, array $data = []): void
    {
        $tokens = array_values(array_unique(array_filter($tokens)));

        if ($tokens === []) {
            return;
        }

        foreach (array_chunk($tokens, self::CHUNK_SIZE) as $chunk) {
            $messages = array_map(fn (string $token) => [
                'to' => $token,
                'title' => $title,
                'body' => $body,
                'data' => $data,
                'sound' => 'default',
            ], $chunk);

            $response = Http::post(self::ENDPOINT, $messages);

            if (! $response->successful()) {
                Log::warning('Expo push: échec de l\'envoi', ['status' => $response->status(), 'body' => $response->body()]);
            }
        }
    }
}
