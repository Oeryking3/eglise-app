<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\CarteImport;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'Email ou mot de passe incorrect.',
            ]);
        }

        if (! $user->isSuperAdmin() && $user->eglise && $user->eglise->statut !== 'active') {
            throw ValidationException::withMessages([
                'email' => "L'espace de cette église est désactivé. Contacte l'administrateur principal.",
            ]);
        }

        $token = $user->createToken('mobile')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'prenom' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'date_naissance' => ['nullable', 'date'],
            'sexe' => ['nullable', 'string'],
            'lieu_residence' => ['nullable', 'string'],
            'eglise_id' => ['required', 'integer', Rule::exists('eglises', 'id')->where('statut', 'active')],
        ]);

        $user = User::create([
            ...$data,
            'password' => Hash::make($data['password']),
            'role' => 'membre',
        ]);

        // La carte de membre reste inactive tant qu'un admin ne l'a pas
        // activée explicitement — sauf si l'église avait déjà importé ses
        // informations de carte à l'avance (import CSV), auquel cas
        // l'activation a déjà été décidée par l'admin au moment de l'import.
        $pending = CarteImport::where('email', $user->email)->where('eglise_id', $user->eglise_id)->first();

        if ($pending) {
            $user->update([
                'date_naissance' => $user->date_naissance ?? $pending->date_naissance,
                'sexe' => $user->sexe ?? $pending->sexe,
                'groupe_sanguin' => $pending->groupe_sanguin,
                'carte_expiration' => $pending->carte_expiration,
                'carte_membre' => true,
            ]);

            $pending->delete();
        }

        $token = $user->createToken('mobile')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté.']);
    }

    public function me(Request $request)
    {
        return new UserResource($request->user());
    }
}
