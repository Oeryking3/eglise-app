<?php

namespace App\Http\Middleware;

use App\Models\Eglise;
use App\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFeatureEnabled
{
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        $egliseId = app(TenantContext::class)->egliseId();

        if ($egliseId === null) {
            return $next($request);
        }

        $eglise = Eglise::find($egliseId);

        if ($eglise && ! $eglise->hasFeature($feature)) {
            return response()->json([
                'message' => "Cette fonctionnalité a été désactivée pour ton église par l'administrateur principal.",
            ], 403);
        }

        return $next($request);
    }
}
