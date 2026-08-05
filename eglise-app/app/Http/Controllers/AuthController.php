<?php

namespace App\Http\Controllers;

use App\Models\Eglise;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => 'Email ou mot de passe incorrect.',
            ]);
        }

        $request->session()->regenerate();

        if (auth()->user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('saving');
    }

    public function showSignup()
    {
        $defaultEgliseId = Eglise::where('statut', 'active')->orderBy('id')->value('id');

        return view('signup', compact('defaultEgliseId'));
    }

    public function signup(Request $request)
    {
        $data = $request->validate([
            'nom'             => ['required', 'string', 'max:255'],
            'prenom'          => ['required', 'string', 'max:255'],
            'email'           => ['required', 'email', 'unique:users,email'],
            'password'        => ['required', 'string', 'min:8'],
            'date_naissance'  => ['nullable', 'date'],
            'sexe'            => ['nullable', 'string'],
            'lieu_residence'  => ['nullable', 'string'],
            'eglise_id'       => ['required', 'integer', Rule::exists('eglises', 'id')->where('statut', 'active')],
        ]);

        $user = User::create([
            'eglise_id'      => $data['eglise_id'],
            'nom'            => $data['nom'],
            'prenom'         => $data['prenom'],
            'email'          => $data['email'],
            'password'       => Hash::make($data['password']),
            'date_naissance' => $data['date_naissance'] ?? null,
            'sexe'           => $data['sexe'] ?? null,
            'lieu_residence' => $data['lieu_residence'] ?? null,
            'role'           => 'membre',
        ]);

        return redirect()->route('login');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}