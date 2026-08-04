<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Resources\EgliseResource;
use App\Models\Eglise;
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
