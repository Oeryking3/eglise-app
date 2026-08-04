<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class MemberController extends Controller
{
    public function index()
    {
        return UserResource::collection(
            User::forActingTenant()->orderBy('created_at', 'desc')->paginate(15)
        );
    }

    public function update(Request $request, User $member)
    {
        $this->authorize('update', $member);

        $data = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'prenom' => ['required', 'string', 'max:255'],
            'lieu_residence' => ['nullable', 'string', 'max:255'],
            'role' => ['required', Rule::in(['admin_eglise', 'membre'])],
        ]);

        if ($member->id === $request->user()->id && $data['role'] !== 'admin_eglise') {
            throw ValidationException::withMessages([
                'role' => 'Tu ne peux pas retirer ton propre accès admin.',
            ]);
        }

        $member->update($data);

        return response()->json(['member' => new UserResource($member)]);
    }

    public function destroy(Request $request, User $member)
    {
        $this->authorize('delete', $member);

        if ($member->id === $request->user()->id) {
            throw ValidationException::withMessages([
                'member' => 'Tu ne peux pas supprimer ton propre compte.',
            ]);
        }

        $member->delete();

        return response()->json(['message' => 'Membre supprimé.']);
    }
}
