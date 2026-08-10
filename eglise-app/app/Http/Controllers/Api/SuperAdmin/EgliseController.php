<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Resources\EgliseResource;
use App\Models\Eglise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EgliseController extends Controller
{
    private const CHILD_TABLES = [
        'events', 'payments', 'agenda_items', 'livres',
        'card_benefits', 'church_notifications', 'live_streams',
    ];

    public function index()
    {
        return EgliseResource::collection(Eglise::orderBy('nom')->get());
    }

    public function deactivate(Eglise $eglise)
    {
        if ($eglise->statut !== 'active') {
            return response()->json(['message' => "Cette église n'est pas active."], 422);
        }

        $eglise->update(['statut' => 'desactivee']);

        foreach ($eglise->users as $user) {
            $user->tokens()->delete();
        }

        return response()->json(['eglise' => new EgliseResource($eglise)]);
    }

    public function reactivate(Eglise $eglise)
    {
        if ($eglise->statut !== 'desactivee') {
            return response()->json(['message' => "Cette église n'est pas désactivée."], 422);
        }

        $eglise->update(['statut' => 'active']);

        return response()->json(['eglise' => new EgliseResource($eglise)]);
    }

    public function updateFeatures(Request $request, Eglise $eglise)
    {
        $data = $request->validate([
            'features' => ['required', 'array'],
            'features.*' => ['boolean'],
        ]);

        $features = array_intersect_key($data['features'], array_flip(Eglise::FEATURES));

        $eglise->update(['features' => array_merge($eglise->featuresArray(), $features)]);

        return response()->json(['eglise' => new EgliseResource($eglise)]);
    }

    public function updateTheme(Request $request, Eglise $eglise)
    {
        $hex = ['nullable', 'regex:/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/'];

        $data = $request->validate([
            'couleur_primaire' => $hex,
            'couleur_primaire_sombre' => $hex,
            'couleur_entete' => $hex,
            'couleur_primaire_claire' => $hex,
            'couleur_bordure' => $hex,
        ]);

        $eglise->update($data);

        return response()->json(['eglise' => new EgliseResource($eglise)]);
    }

    public function destroy(Eglise $eglise)
    {
        DB::transaction(function () use ($eglise) {
            foreach ($eglise->users as $user) {
                $user->tokens()->delete();
            }

            foreach (self::CHILD_TABLES as $table) {
                DB::table($table)->where('eglise_id', $eglise->id)->delete();
            }

            DB::table('users')->where('eglise_id', $eglise->id)->delete();

            $eglise->delete();
        });

        return response()->json(['message' => 'Église supprimée définitivement.']);
    }
}
