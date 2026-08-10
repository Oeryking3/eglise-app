<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EgliseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'code' => $this->code,
            'ville' => $this->ville,
            'adresse' => $this->adresse,
            'statut' => $this->statut,
            'contact_nom' => $this->contact_nom,
            'contact_email' => $this->contact_email,
            'contact_telephone' => $this->contact_telephone,
            'motif_refus' => $this->motif_refus,
            'approuvee_at' => $this->approuvee_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'features' => $this->featuresArray(),
            'theme' => $this->themeArray(),
        ];
    }
}
