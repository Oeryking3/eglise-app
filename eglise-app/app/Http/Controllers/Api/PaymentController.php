<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Livre;
use App\Models\Payment;
use App\Services\CinetPayService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Crée le paiement côté CinetPay et renvoie l'URL de la page de paiement
     * hébergée par CinetPay. Le client mobile doit passer son propre
     * "return_url" (schéma personnalisé de l'app, ex: monapp://paiement-retour)
     * car CinetPay refuse les schémas personnalisés en success_url/failed_url —
     * on relaie donc via une route web (paiement.retour) qui, elle, redirige
     * vers ce schéma personnalisé une fois que CinetPay a redirigé chez nous.
     *
     * Le prix et le nom du produit viennent toujours du livre en base (jamais
     * du client), pour ne pas pouvoir être falsifiés depuis l'app.
     */
    public function store(Request $request, CinetPayService $cinetpay)
    {
        $data = $request->validate([
            'livre_id' => ['required', 'integer', 'exists:livres,id'],
            'methode' => ['required', 'in:wave,orange,mtn,moov,card'],
            'telephone' => ['required_unless:methode,card', 'nullable', 'string'],
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
            'methode' => $data['methode'],
            'telephone' => $data['telephone'] ?? null,
            'statut' => 'en_attente',
            'reference' => 'PAY-' . Str::uuid(),
        ]);

        $relayUrl = route('paiement.retour', [
            'payment_id' => $payment->id,
            'mobile_return' => $data['return_url'],
        ]);

        $result = $cinetpay->initiatePayment([
            'currency' => config('cinetpay.currency'),
            'merchant_transaction_id' => $payment->reference,
            'amount' => $livre->prix,
            'designation' => $livre->titre,
            'success_url' => $relayUrl . '&statut=succes',
            'failed_url' => $relayUrl . '&statut=echec',
            'notify_url' => $relayUrl . '&statut=notify',
        ]);

        $paymentUrl = $result['payment_url'] ?? null;

        if (! $paymentUrl) {
            $payment->update(['statut' => 'echoue']);

            return response()->json(['message' => 'Impossible de créer le paiement CinetPay.'], 502);
        }

        return response()->json([
            'payment' => new PaymentResource($payment),
            'payment_url' => $paymentUrl,
        ], 201);
    }

    public function show(Request $request, Payment $payment, CinetPayService $cinetpay)
    {
        abort_if($payment->user_id !== $request->user()->id, 403);

        if ($payment->statut === 'en_attente') {
            $this->refreshStatus($payment, $cinetpay);
        }

        return new PaymentResource($payment);
    }

    public function refreshStatus(Payment $payment, CinetPayService $cinetpay): void
    {
        try {
            $result = $cinetpay->checkStatus($payment->reference);
        } catch (\Throwable $e) {
            return;
        }

        $status = strtoupper((string) ($result['status'] ?? $result['data']['status'] ?? ''));

        // La doc publique CinetPay (API classique) documente ACCEPTED/REFUSED,
        // mais ce compte utilise la génération d'API plus récente
        // (api.cinetpay.net), dont le vocabulaire exact des statuts terminaux
        // n'a pas pu être confirmé (docs inaccessibles). Reconnaissance large
        // et défensive : par défaut on reste "en_attente" (jamais de faux
        // positif) tant qu'un vrai paiement complété n'a pas permis de
        // confirmer la valeur exacte retournée par CinetPay dans ce cas.
        $statut = match (true) {
            str_contains($status, 'ACCEPT') || str_contains($status, 'SUCCESS') || str_contains($status, 'PAYE') || str_contains($status, 'PAID') || str_contains($status, 'COMPLET') => 'reussi',
            str_contains($status, 'REFUS') || str_contains($status, 'FAIL') || str_contains($status, 'CANCEL') || str_contains($status, 'EXPIR') => 'echoue',
            default => 'en_attente',
        };

        if ($statut !== 'en_attente') {
            $payment->update(['statut' => $statut]);
        }
    }
}
