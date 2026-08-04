<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Eglise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EgliseRequestController extends Controller
{
    public function store(Request $request)
    {
        $request->merge(['code' => strtoupper((string) $request->input('code'))]);

        $data = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'regex:/^[A-Z0-9]{2,6}$/', 'unique:eglises,code'],
            'ville' => ['nullable', 'string', 'max:255'],
            'adresse' => ['nullable', 'string', 'max:255'],
            'contact_nom' => ['required', 'string', 'max:255'],
            'contact_email' => ['required', 'email', 'max:255'],
            'contact_telephone' => ['nullable', 'string', 'max:50'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $eglise = Eglise::create([
            'nom' => $data['nom'],
            'code' => $data['code'],
            'ville' => $data['ville'] ?? null,
            'adresse' => $data['adresse'] ?? null,
            'statut' => 'en_attente',
            'contact_nom' => $data['contact_nom'],
            'contact_email' => $data['contact_email'],
            'contact_telephone' => $data['contact_telephone'] ?? null,
            'admin_password_hash' => Hash::make($data['password']),
        ]);

        return response()->json([
            'message' => 'Ta demande a été envoyée. Tu seras notifié après validation.',
            'eglise' => ['id' => $eglise->id, 'statut' => $eglise->statut],
        ], 201);
    }
}
