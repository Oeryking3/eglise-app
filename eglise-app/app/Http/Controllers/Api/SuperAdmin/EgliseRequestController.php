<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Resources\EgliseResource;
use App\Http\Resources\UserResource;
use App\Models\Eglise;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class EgliseRequestController extends Controller
{
    public function index(Request $request)
    {
        $statut = $request->query('statut', 'en_attente');

        return EgliseResource::collection(
            Eglise::where('statut', $statut)->orderBy('created_at')->paginate(15)
        );
    }

    public function approve(Request $request, Eglise $eglise)
    {
        $request->validate([
            'code' => ['nullable', 'string', 'regex:/^[A-Z0-9]{2,6}$/'],
        ]);

        $admin = DB::transaction(function () use ($request, $eglise) {
            if ($request->filled('code')) {
                $eglise->code = strtoupper($request->input('code'));
            }

            $eglise->statut = 'active';
            $eglise->approuvee_at = now();
            $eglise->save();

            [$prenom, $nom] = $this->splitContactName($eglise->contact_nom);

            $admin = User::create([
                'eglise_id' => $eglise->id,
                'nom' => $nom,
                'prenom' => $prenom,
                'email' => $eglise->contact_email,
                'password' => $eglise->admin_password_hash,
                'role' => 'admin_eglise',
            ]);

            $eglise->update(['admin_password_hash' => null]);

            return $admin;
        });

        Cache::forget('eglises:actives');

        return response()->json([
            'eglise' => new EgliseResource($eglise->fresh()),
            'admin' => new UserResource($admin),
        ]);
    }

    public function reject(Request $request, Eglise $eglise)
    {
        $data = $request->validate([
            'motif' => ['nullable', 'string', 'max:500'],
        ]);

        $eglise->update([
            'statut' => 'refusee',
            'motif_refus' => $data['motif'] ?? null,
            'admin_password_hash' => null,
        ]);

        return response()->json(['eglise' => new EgliseResource($eglise)]);
    }

    private function splitContactName(string $contactNom): array
    {
        $parts = preg_split('/\s+/', trim($contactNom), 2);

        return [$parts[0], $parts[1] ?? ''];
    }
}
