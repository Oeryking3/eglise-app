<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        return PaymentResource::collection(
            Payment::with('user')->latest()->paginate(15)
        );
    }

    public function updateStatus(Request $request, Payment $payment)
    {
        $data = $request->validate([
            'statut' => ['required', 'in:en_attente,reussi,echoue'],
        ]);

        $payment->update($data);

        return response()->json(['payment' => new PaymentResource($payment)]);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        return response()->json(['message' => 'Paiement supprimé.']);
    }
}
