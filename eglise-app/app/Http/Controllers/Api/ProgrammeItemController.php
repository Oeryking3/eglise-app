<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgrammeItemResource;
use App\Models\ProgrammeItem;
use App\Services\TenantContext;
use Illuminate\Support\Facades\Cache;

class ProgrammeItemController extends Controller
{
    /**
     * Le programme de la semaine change rarement mais est consulté par
     * chaque membre à chaque ouverture de l'accueil — mis en cache par
     * église pour éviter une requête DB à chaque chargement.
     */
    public function index()
    {
        $egliseId = app(TenantContext::class)->egliseId();

        $items = Cache::remember("programme:{$egliseId}", now()->addHour(), function () {
            return ProgrammeItem::orderBy('ordre')->orderBy('id')->get();
        });

        return ProgrammeItemResource::collection($items);
    }
}
