<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PushToken;
use App\Models\Scopes\EgliseScope;
use Illuminate\Http\Request;

class PushTokenController extends Controller
{
    /**
     * Un même token (donc un même appareil) peut avoir été enregistré par un
     * autre membre auparavant (téléphone partagé, changement de compte) —
     * on ignore le scope d'église pour le retrouver et le réattribuer au
     * membre actuellement connecté plutôt que de planter sur la contrainte
     * d'unicité.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'token' => ['required', 'string'],
        ]);

        PushToken::withoutGlobalScope(EgliseScope::class)->updateOrCreate(
            ['token' => $data['token']],
            ['user_id' => $request->user()->id, 'eglise_id' => $request->user()->eglise_id],
        );

        return response()->json(['message' => 'Token enregistré.'], 201);
    }
}
