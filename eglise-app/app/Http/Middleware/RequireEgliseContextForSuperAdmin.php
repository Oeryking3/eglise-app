<?php

namespace App\Http\Middleware;

use App\Models\Eglise;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireEgliseContextForSuperAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->isSuperAdmin()) {
            return $next($request);
        }

        $egliseId = $request->header('X-Eglise-Id') ?? $request->query('eglise_id');

        if ($egliseId === null) {
            return response()->json(['message' => "Précise l'église sur laquelle agir (X-Eglise-Id)."], 400);
        }

        if (! Eglise::where('id', $egliseId)->where('statut', 'active')->exists()) {
            return response()->json(['message' => "Église introuvable ou inactive."], 400);
        }

        return $next($request);
    }
}
