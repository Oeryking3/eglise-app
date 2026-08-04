<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\CarteImport;
use App\Models\Scopes\EgliseScope;
use App\Models\User;
use App\Services\TenantContext;
use Illuminate\Http\Request;

class MembershipCardController extends Controller
{
    public function index()
    {
        return UserResource::collection(
            User::forActingTenant()->where('role', 'membre')->orderBy('nom')->paginate(15)
        );
    }

    public function edit(User $member)
    {
        $this->authorize('view', $member);

        return new UserResource($member);
    }

    public function update(Request $request, User $member)
    {
        $this->authorize('update', $member);

        $data = $request->validate([
            'carte_photo' => ['nullable', 'image', 'max:4096'],
            'date_naissance' => ['nullable', 'date'],
            'sexe' => ['nullable', 'in:M,F'],
            'groupe_sanguin' => ['nullable', 'string', 'max:5'],
            'carte_expiration' => ['nullable', 'date'],
            'carte_membre' => ['sometimes', 'boolean'],
        ]);

        $data['carte_membre'] = $request->boolean('carte_membre');

        if ($request->hasFile('carte_photo')) {
            $data['carte_photo'] = $request->file('carte_photo')->store('cartes', 'public');
        }

        $member->update($data);

        return response()->json(['member' => new UserResource($member)]);
    }

    public function destroy(User $member)
    {
        $this->authorize('update', $member);

        $member->update([
            'carte_membre' => false,
            'carte_photo' => null,
            'date_naissance' => null,
            'sexe' => null,
            'groupe_sanguin' => null,
            'carte_expiration' => null,
        ]);

        return response()->json(['message' => 'Carte supprimée.']);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
        ]);

        $rows = array_map('str_getcsv', file($request->file('file')->getRealPath()));
        $header = array_map(fn ($h) => strtolower(trim($h)), array_shift($rows) ?? []);

        $required = ['email', 'date_naissance', 'sexe', 'groupe_sanguin', 'carte_expiration'];
        if (array_diff($required, $header) !== []) {
            return response()->json([
                'message' => 'Colonnes attendues : email, date_naissance, sexe, groupe_sanguin, carte_expiration.',
            ], 422);
        }

        $imported = 0;
        $pending = 0;
        $errors = [];
        $egliseId = app(TenantContext::class)->egliseId();

        foreach ($rows as $i => $row) {
            if (count(array_filter($row, fn ($v) => trim((string) $v) !== '')) === 0) {
                continue;
            }

            $data = array_combine($header, array_pad($row, count($header), null));
            $line = $i + 2;
            $email = trim((string) ($data['email'] ?? ''));

            if ($email === '') {
                $errors[] = ['ligne' => $line, 'message' => 'Email manquant.'];
                continue;
            }

            $sexe = strtoupper(trim((string) ($data['sexe'] ?? '')));
            if ($sexe !== '' && ! in_array($sexe, ['M', 'F'], true)) {
                $errors[] = ['ligne' => $line, 'email' => $email, 'message' => 'Sexe invalide (M ou F attendu).'];
                continue;
            }

            $invalidDate = false;
            foreach (['date_naissance', 'carte_expiration'] as $dateField) {
                $value = trim((string) ($data[$dateField] ?? ''));
                if ($value !== '' && ! strtotime($value)) {
                    $errors[] = ['ligne' => $line, 'email' => $email, 'message' => "Date invalide pour {$dateField}."];
                    $invalidDate = true;
                    break;
                }
            }
            if ($invalidDate) {
                continue;
            }

            $cardData = [
                'date_naissance' => $data['date_naissance'] ?: null,
                'sexe' => $sexe ?: null,
                'groupe_sanguin' => trim((string) ($data['groupe_sanguin'] ?? '')) ?: null,
                'carte_expiration' => $data['carte_expiration'] ?: null,
            ];

            $member = User::forActingTenant()->where('role', 'membre')->where('email', $email)->first();

            if ($member) {
                $member->update([...$cardData, 'carte_membre' => true]);
                $imported++;
                continue;
            }

            $existingPending = CarteImport::withoutGlobalScope(EgliseScope::class)->where('email', $email)->first();
            if ($existingPending && $existingPending->eglise_id !== $egliseId) {
                $errors[] = ['ligne' => $line, 'email' => $email, 'message' => 'Cette adresse est déjà en attente pour une autre église.'];
                continue;
            }

            CarteImport::updateOrCreate(['email' => $email], $cardData);
            $pending++;
        }

        return response()->json(['imported' => $imported, 'pending' => $pending, 'errors' => $errors]);
    }
}
