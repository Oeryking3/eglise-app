<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class AdminPaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('user')
            ->latest()
            ->paginate(10);

        return view('admin.payments.index', compact('payments'));
    }

    public function updateStatus(Request $request, Payment $payment)
    {
        $data = $request->validate([
            'statut' => ['required', 'in:en_attente,reussi,echoue'],
        ]);

        $payment->update(['statut' => $data['statut']]);

        return redirect()->route('admin.payments.index')
            ->with('success', 'Statut mis à jour.');
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        return redirect()->route('admin.payments.index')
            ->with('success', 'Le paiement a été supprimé.');
    }
}