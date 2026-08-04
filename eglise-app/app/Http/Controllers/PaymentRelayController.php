<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\PaymentController;
use App\Models\Payment;
use App\Services\CinetPayService;
use Illuminate\Http\Request;

class PaymentRelayController extends Controller
{
    /**
     * CinetPay redirige le navigateur (ouvert dans la WebView/WebBrowser de
     * l'app mobile) vers cette route web après le paiement — un schéma
     * personnalisé (monapp://...) n'est pas accepté directement par CinetPay
     * en success_url/failed_url, donc on relaie ici vers le vrai retour app.
     */
    public function retour(Request $request, PaymentController $paymentController, CinetPayService $cinetpay)
    {
        $statut = $request->query('statut', 'echec');
        $mobileReturn = $request->query('mobile_return');
        $paymentId = $request->query('payment_id');

        if ($statut === 'notify') {
            $payment = Payment::withoutGlobalScopes()->find($paymentId);
            if ($payment) {
                $paymentController->refreshStatus($payment, $cinetpay);
            }

            return response('OK', 200);
        }

        if (! $mobileReturn) {
            return response('Paramètre de retour manquant.', 400);
        }

        $separator = str_contains($mobileReturn, '?') ? '&' : '?';

        return redirect()->away($mobileReturn . $separator . "statut={$statut}&payment_id={$paymentId}");
    }
}
