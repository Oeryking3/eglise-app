<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EgliseResource;
use App\Models\Eglise;
use Illuminate\Support\Facades\Cache;

class EgliseController extends Controller
{
    /**
     * Liste publique consultée à chaque écran de connexion/inscription —
     * change rarement, mise en cache pour ne pas taper la base à chaque
     * ouverture de l'app.
     */
    public function index()
    {
        $eglises = Cache::remember('eglises:actives', now()->addMinutes(10), function () {
            return Eglise::where('statut', 'active')->orderBy('nom')->get();
        });

        return EgliseResource::collection($eglises);
    }
}
