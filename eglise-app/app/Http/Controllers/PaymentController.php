<?php

namespace App\Http\Controllers;

use App\Models\Livre;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function show()
    {
        return view('payment');
    }

    public function process(Request $request)
    {
        $data = $request->validate([
            'methode'   => ['required', 'in:wave,orange,mtn,moov,card'],
            'telephone' => ['required_unless:methode,card', 'nullable', 'string'],
        ]);

        $payment = Payment::create([
            'user_id'   => auth()->id(),
            'produit'   => 'Comment créer un miracle',
            'montant'   => 2000,
            'methode'   => $data['methode'],
            'telephone' => $data['telephone'] ?? null,
            'statut'    => 'en_attente',
            'reference' => 'PAY-' . strtoupper(Str::random(10)),
        ]);

        $payment->update(['statut' => 'reussi']);

        session(['last_payment_reference' => $payment->reference]);

        return redirect()->route('download');
    }

    public function download()
    {
        $reference = session('last_payment_reference');
        $payment = Payment::where('reference', $reference)->first();
        $livres = Livre::latest()->get();

        return view('download', compact('payment', 'livres'));
    }
}