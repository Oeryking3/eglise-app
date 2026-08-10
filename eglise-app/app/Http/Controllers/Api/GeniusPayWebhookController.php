<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\GeniusPayService;
use Illuminate\Http\Request;

class GeniusPayWebhookController extends Controller
{
    /**
     * Configuré une seule fois dans le dashboard GeniusPay (Webhooks >
     * Configuration), pas par transaction.
     *
     * Vérification conforme à la doc GeniusPay : signature =
     * HMAC-SHA256(timestamp + "." + json_payload, secret), avec protection
     * anti-rejeu (timestamp de plus de 5 minutes refusé).
     */
    public function handle(Request $request)
    {
        $signature = $request->header('X-Webhook-Signature', '');
        $timestamp = $request->header('X-Webhook-Timestamp', '');
        $event = $request->header('X-Webhook-Event', '');

        $payload = $request->all();
        $data = $timestamp . '.' . json_encode($payload);
        $expectedSignature = hash_hmac('sha256', $data, (string) config('geniuspay.webhook_secret'));

        if ($signature === '' || ! hash_equals($expectedSignature, $signature)) {
            return response()->json(['message' => 'Signature invalide.'], 401);
        }

        if ($timestamp === '' || abs(time() - (int) $timestamp) > 300) {
            return response()->json(['message' => 'Timestamp expiré.'], 400);
        }

        $statut = match ($event) {
            'payment.success' => 'reussi',
            'payment.failed', 'payment.cancelled', 'payment.expired' => 'echoue',
            default => null,
        };

        if ($statut !== null) {
            $reference = $payload['data']['metadata']['order_id'] ?? null;
            $providerReference = $payload['data']['reference'] ?? null;

            $payment = Payment::withoutGlobalScopes()
                ->where(function ($query) use ($reference, $providerReference) {
                    $query->where('reference', $reference)
                        ->orWhere('provider_reference', $providerReference);
                })
                ->first();

            if ($payment && $payment->statut === 'en_attente') {
                $provider = $payload['data']['provider'] ?? $payload['data']['payment_method'] ?? null;

                $payment->update([
                    'statut' => $statut,
                    'provider_reference' => $providerReference ?? $payment->provider_reference,
                    'methode' => GeniusPayService::mapProviderToMethode($provider) ?? $payment->methode,
                ]);
            }
        }

        return response()->json(['message' => 'OK']);
    }
}
