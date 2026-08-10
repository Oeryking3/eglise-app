<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeniusPayService
{
    public function initiatePayment(array $data): array
    {
        $response = $this->client()->post('/merchant/payments', $data);

        if (! $response->successful() || ! ($response->json('success'))) {
            $message = $response->json('error.message') ?? $response->json('message') ?? $response->body();

            throw new RuntimeException("GeniusPay: échec de la création du paiement — {$message}");
        }

        return $response->json();
    }

    public function verifyTransaction(string $providerReference): array
    {
        $response = $this->client()->get("/merchant/payments/{$providerReference}");

        if (! $response->successful()) {
            throw new RuntimeException('GeniusPay: échec de la vérification — ' . $response->body());
        }

        return $response->json();
    }

    /**
     * Reconstitue notre code de méthode interne (utilisé côté admin
     * uniquement, à titre informatif) à partir du "provider" GeniusPay
     * transmis dans le webhook/la vérification — le client choisit sa
     * méthode sur leur page hébergée, on ne la connaît qu'après coup.
     */
    public static function mapProviderToMethode(?string $provider): ?string
    {
        return match ($provider) {
            'wave' => 'wave',
            'orange_money' => 'orange',
            'mtn_money' => 'mtn',
            'moov_money' => 'moov',
            'card' => 'card',
            default => null,
        };
    }

    private function client()
    {
        return Http::withHeaders([
            'X-API-Key' => config('geniuspay.api_key'),
            'X-API-Secret' => config('geniuspay.api_secret'),
        ])
            ->baseUrl(config('geniuspay.base_url'))
            ->acceptJson();
    }
}
