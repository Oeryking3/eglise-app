<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\PaymentController;
use App\Models\Payment;
use App\Services\GeniusPayService;
use Illuminate\Http\Request;

class PaymentRelayController extends Controller
{
    /**
     * GeniusPay redirige le navigateur (ouvert dans la WebView/WebBrowser de
     * l'app mobile) vers cette route web après le paiement — un schéma
     * personnalisé (monapp://...) n'est pas accepté directement en
     * success_url/error_url, donc on relaie ici vers le vrai retour app.
     */
    public function retour(Request $request, PaymentController $paymentController, GeniusPayService $geniuspay)
    {
        $statut = $request->query('statut', 'echec');
        $mobileReturn = $request->query('mobile_return');
        $paymentId = $request->query('payment_id');

        $payment = Payment::withoutGlobalScopes()->find($paymentId);

        if ($statut === 'succes' && $payment && $payment->statut === 'en_attente') {
            $paymentController->refreshStatus($payment, $geniuspay);
        }

        if (! $mobileReturn) {
            return response('Paramètre de retour manquant.', 400);
        }

        $separator = str_contains($mobileReturn, '?') ? '&' : '?';

        return redirect()->away($mobileReturn . $separator . "statut={$statut}&payment_id={$paymentId}");
    }
}
