<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class CinetPayService
{
    public function initiatePayment(array $data): array
    {
        $response = $this->client()->post('/payment', $data);

        if (! $response->successful() || ($response->json('code') !== 200)) {
            throw new RuntimeException('CinetPay: échec de la création du paiement — ' . $response->body());
        }

        return $response->json();
    }

    public function checkStatus(string $merchantTransactionId): array
    {
        $response = $this->client()->get("/payment/{$merchantTransactionId}");

        if (! $response->successful()) {
            throw new RuntimeException('CinetPay: échec de la vérification du statut — ' . $response->body());
        }

        return $response->json();
    }

    private function client()
    {
        return Http::withToken($this->accessToken())
            ->withOptions($this->forceIpv4Options())
            ->baseUrl(config('cinetpay.base_url'))
            ->acceptJson();
    }

    private function accessToken(): string
    {
        return Cache::remember('cinetpay_access_token', now()->addHours(23), function () {
            $response = Http::asForm()
                ->withOptions($this->forceIpv4Options())
                ->post(config('cinetpay.base_url') . '/oauth/login', [
                    'api_key' => config('cinetpay.api_key'),
                    'api_password' => config('cinetpay.api_password'),
                ]);

            if (! $response->successful() || ! $response->json('access_token')) {
                throw new RuntimeException('CinetPay: échec de l\'authentification — ' . $response->body());
            }

            return $response->json('access_token');
        });
    }

    /**
     * CinetPay whiteliste des IP précises ; forcer IPv4 évite qu'une requête
     * parte en IPv6 (donc avec une IP différente de celle whitelistée) sur
     * les machines/serveurs en dual-stack. Option Guzzle native, fonctionne
     * avec le handler stream (utilisé ici, ext-curl n'est pas chargée) tout
     * comme avec curl.
     */
    private function forceIpv4Options(): array
    {
        return ['force_ip_resolve' => 'v4'];
    }
}
