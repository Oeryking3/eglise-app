<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'description' => $this->description,
            'image_url' => $this->image_url,
            'date_evenement' => $this->date_evenement?->format('Y-m-d'),
            'heure_debut' => $this->heure_debut,
            'heure_fin' => $this->heure_fin,
            'important' => (bool) $this->important,
        ];
    }
}
