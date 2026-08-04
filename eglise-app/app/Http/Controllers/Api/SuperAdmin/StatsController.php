<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Eglise;
use App\Models\Event;
use App\Models\Payment;
use App\Models\Scopes\EgliseScope;
use App\Models\User;

class StatsController extends Controller
{
    public function index()
    {
        return response()->json([
            'eglises' => [
                'total' => Eglise::count(),
                'active' => Eglise::where('statut', 'active')->count(),
                'en_attente' => Eglise::where('statut', 'en_attente')->count(),
                'desactivee' => Eglise::where('statut', 'desactivee')->count(),
                'refusee' => Eglise::where('statut', 'refusee')->count(),
            ],
            'membres' => User::where('role', 'membre')->count(),
            'evenements' => Event::withoutGlobalScope(EgliseScope::class)->count(),
            'paiements' => Payment::withoutGlobalScope(EgliseScope::class)->withTrashed()->where('statut', 'reussi')->count(),
            'revenus' => Payment::withoutGlobalScope(EgliseScope::class)->withTrashed()->where('statut', 'reussi')->sum('montant'),
        ]);
    }
}
