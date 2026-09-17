<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Livre;
use App\Models\Payment;
use App\Services\GeniusPayService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Crée le paiement côté GeniusPay et renvoie l'URL de la page de paiement
     * hébergée par GeniusPay. Le client mobile doit passer son propre
     * "return_url" (schéma personnalisé de l'app, ex: monapp://paiement-retour)
     * — on relaie donc via une route web (paiement.retour) qui redirige vers
     * ce schéma personnalisé une fois que GeniusPay a redirigé chez nous.
     *
     * Le prix et le nom du produit viennent toujours du livre en base (jamais
     * du client), pour ne pas pouvoir être falsifiés depuis l'app.
     */
    public function store(Request $request, GeniusPayService $geniuspay)
    {
        $data = $request->validate([
            'livre_id' => ['required', 'integer', 'exists:livres,id'],
            'return_url' => ['required', 'string'],
        ]);

        $livre = Livre::findOrFail($data['livre_id']);

        $dejaAchete = Payment::where('user_id', $request->user()->id)
            ->where('livre_id', $livre->id)
            ->where('statut', 'reussi')
            ->exists();

        if ($dejaAchete) {
            return response()->json(['message' => 'Tu as déjà acheté ce livre.'], 422);
        }

        $payment = Payment::create([
            'user_id' => $request->user()->id,
            'livre_id' => $livre->id,
            'produit' => $livre->titre,
            'montant' => $livre->prix,
            'statut' => 'en_attente',
            'reference' => 'PAY-' . Str::uuid(),
        ]);

        $relayUrl = route('paiement.retour', [
            'payment_id' => $payment->id,
            'mobile_return' => $data['return_url'],
        ]);

        try {
            // On ne précise volontairement pas `payment_method` : en mode
            // Live, l'API GeniusPay ignore ce paramètre et route toujours
            // vers Wave quoi qu'on envoie (bug confirmé côté GeniusPay, pas
            // chez nous). En omettant le champ, on bascule en "mode
            // checkout" — leur propre approche recommandée — où le client
            // choisit sa méthode directement sur leur page hébergée.
            $result = $geniuspay->initiatePayment([
                'amount' => $livre->prix,
                'currency' => 'XOF',
                'description' => $livre->titre,
                'customer' => [
                    'name' => trim($request->user()->prenom . ' ' . $request->user()->nom),
                    'email' => $request->user()->email,
                ],
                'success_url' => $relayUrl . '&statut=succes',
                'error_url' => $relayUrl . '&statut=echec',
                'metadata' => [
                    'order_id' => $payment->reference,
                ],
            ]);
        } catch (\Throwable $e) {
            $payment->update(['statut' => 'echoue']);

            return response()->json(['message' => $e->getMessage()], 502);
        }

        $paymentUrl = $result['data']['checkout_url'] ?? $result['data']['payment_url'] ?? null;

        if (! $paymentUrl) {
            $payment->update(['statut' => 'echoue']);

            return response()->json(['message' => 'Impossible de créer le paiement GeniusPay.'], 502);
        }

        $payment->update(['provider_reference' => $result['data']['reference'] ?? null]);

        return response()->json([
            'payment' => new PaymentResource($payment),
            'payment_url' => $paymentUrl,
        ], 201);
    }

    public function donation(Request $request, GeniusPayService $geniuspay)
    {
        $data = $request->validate([
            'montant' => ['required', 'integer', 'min:500', 'max:10000000'],
            'type' => ['required', 'in:dime,offrande,offrande_journaliere'],
            'return_url' => ['required', 'string'],
        ]);

        $produits = [
            'dime' => 'Dîme',
            'offrande' => 'Offrande',
            'offrande_journaliere' => 'Offrande journalière',
        ];

        if ($data['type'] === 'offrande_journaliere' && $data['montant'] < 1000) {
            return response()->json(['message' => 'Une offrande journalière doit être d’au moins 1 000 FCFA.'], 422);
        }

        $produit = $produits[$data['type']];

        $payment = Payment::create([
            'user_id' => $request->user()->id,
            'type' => $data['type'],
            'produit' => $produit,
            'montant' => $data['montant'],
            'statut' => 'en_attente',
            'reference' => 'DON-' . Str::uuid(),
        ]);

        $relayUrl = route('paiement.retour', [
            'payment_id' => $payment->id,
            'mobile_return' => $data['return_url'],
        ]);

        try {
            $result = $geniuspay->initiatePayment([
                'amount' => $payment->montant,
                'currency' => 'XOF',
                'description' => $produit,
                'customer' => [
                    'name' => trim($request->user()->prenom . ' ' . $request->user()->nom),
                    'email' => $request->user()->email,
                ],
                'success_url' => $relayUrl . '&statut=succes',
                'error_url' => $relayUrl . '&statut=echec',
                'metadata' => ['order_id' => $payment->reference],
            ]);
        } catch (\Throwable $e) {
            $payment->update(['statut' => 'echoue']);

            return response()->json(['message' => $e->getMessage()], 502);
        }

        $paymentUrl = $result['data']['checkout_url'] ?? $result['data']['payment_url'] ?? null;

        if (! $paymentUrl) {
            $payment->update(['statut' => 'echoue']);

            return response()->json(['message' => 'Impossible de créer le paiement GeniusPay.'], 502);
        }

        $payment->update(['provider_reference' => $result['data']['reference'] ?? null]);

        return response()->json([
            'payment' => new PaymentResource($payment),
            'payment_url' => $paymentUrl,
        ], 201);
    }

    public function show(Request $request, Payment $payment, GeniusPayService $geniuspay)
    {
        abort_if($payment->user_id !== $request->user()->id, 403);

        if ($payment->statut === 'en_attente') {
            $this->refreshStatus($payment, $geniuspay);
        }

        return new PaymentResource($payment);
    }

    /**
     * Confirmation de secours : GeniusPay recommande le webhook comme moyen
     * fiable de confirmation, mais expose aussi un vrai endpoint de
     * vérification par référence (contrairement à Kadev Pay) — on peut donc
     * revérifier activement dès que la référence GeniusPay est connue
     * (capturée dès la création du paiement).
     */
    public function refreshStatus(Payment $payment, GeniusPayService $geniuspay): void
    {
        if (! $payment->provider_reference) {
            return;
        }

        try {
            $result = $geniuspay->verifyTransaction($payment->provider_reference);
        } catch (\Throwable $e) {
            return;
        }

        // Statuts documentés par GeniusPay : pending, processing, completed,
        // failed, cancelled, refunded.
        $status = strtolower((string) ($result['data']['status'] ?? ''));

        $statut = match ($status) {
            'completed' => 'reussi',
            'failed', 'cancelled', 'expired' => 'echoue',
            default => 'en_attente',
        };

        if ($statut !== 'en_attente') {
            $provider = $result['data']['payment_provider'] ?? $result['data']['payment_method'] ?? null;

            $payment->update([
                'statut' => $statut,
                'methode' => GeniusPayService::mapProviderToMethode($provider) ?? $payment->methode,
            ]);
        }
    }
}
