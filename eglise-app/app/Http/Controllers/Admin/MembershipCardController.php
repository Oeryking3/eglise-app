<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class MembershipCardController extends Controller
{
    public function index()
    {
        $members = User::forActingTenant()
            ->where('role', 'membre')
            ->orderBy('nom')
            ->paginate(15);

        return view('admin.cartes.index', compact('members'));
    }

    public function edit(User $member)
    {
        $this->authorize('view', $member);

        return view('admin.cartes.edit', compact('member'));
    }

    public function update(Request $request, User $member)
    {
        $this->authorize('update', $member);

        $data = $request->validate([
            'carte_photo'       => ['nullable', 'image', 'max:4096'],
            'date_naissance'    => ['nullable', 'date'],
            'sexe'              => ['nullable', 'in:M,F'],
            'groupe_sanguin'    => ['nullable', 'string', 'max:5'],
            'carte_expiration'  => ['nullable', 'date'],
            'carte_membre'      => ['sometimes', 'boolean'],
        ]);

        $data['carte_membre'] = $request->boolean('carte_membre');

        if ($request->hasFile('carte_photo')) {
            $data['carte_photo'] = $request->file('carte_photo')->store('cartes', 'public');
        }

        $member->update($data);

        return redirect()->route('admin.cartes.index')->with('success', 'Carte mise à jour.');
    }

    public function destroy(User $member)
    {
        $this->authorize('update', $member);

        $member->update([
            'carte_membre'      => false,
            'carte_photo'       => null,
            'date_naissance'    => null,
            'sexe'              => null,
            'groupe_sanguin'    => null,
            'carte_expiration'  => null,
        ]);

        return back()->with('success', 'Carte supprimée.');
    }
}