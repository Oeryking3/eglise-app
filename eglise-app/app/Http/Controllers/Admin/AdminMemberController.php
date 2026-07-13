<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminMemberController extends Controller
{
    public function index()
    {
        $members = User::orderBy('created_at', 'desc')->paginate(15);
        return view('admin.members.index', compact('members'));
    }

    public function edit(User $member)
    {
        return view('admin.members.edit', compact('member'));
    }

    public function update(Request $request, User $member)
    {
        $data = $request->validate([
            'nom'             => ['required', 'string', 'max:255'],
            'prenom'          => ['required', 'string', 'max:255'],
            'lieu_residence'  => ['nullable', 'string', 'max:255'],
            'role'            => ['required', 'in:admin,membre'],
        ]);

        // Empêche un admin de se retirer lui-même son propre accès par erreur
        if ($member->id === auth()->id() && $data['role'] !== 'admin') {
            return back()->withErrors(['role' => 'Tu ne peux pas retirer ton propre accès admin.']);
        }

        $member->update($data);

        return redirect()->route('admin.members.index')->with('success', 'Membre mis à jour.');
    }

    public function destroy(User $member)
    {
        if ($member->id === auth()->id()) {
            return back()->withErrors(['member' => 'Tu ne peux pas supprimer ton propre compte.']);
        }

        $member->delete();

        return back()->with('success', 'Membre supprimé.');
    }
}