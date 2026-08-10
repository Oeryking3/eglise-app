<?php

namespace App\Http\Resources;

use App\Models\Eglise;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'eglise_id' => $this->eglise_id,
            'eglise_nom' => $this->eglise?->nom,
            'eglise_features' => $this->eglise?->featuresArray() ?? array_fill_keys(Eglise::FEATURES, true),
            'eglise_theme' => $this->eglise?->themeArray(),
            'member_id' => $this->member_id,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'email' => $this->email,
            'role' => $this->role,
            'date_naissance' => $this->date_naissance?->format('Y-m-d'),
            'sexe' => $this->sexe,
            'lieu_residence' => $this->lieu_residence,
            'groupe_sanguin' => $this->groupe_sanguin,
            'carte_membre' => (bool) $this->carte_membre,
            'carte_photo_url' => $this->carte_photo_url,
            'carte_expiration' => $this->carte_expiration?->format('Y-m-d'),
            'carte_est_valide' => $this->carte_est_valide,
        ];
    }
}
