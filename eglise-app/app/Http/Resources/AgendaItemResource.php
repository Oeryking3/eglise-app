<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgendaItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'description' => $this->description,
            'date_rappel' => $this->date_rappel?->format('Y-m-d'),
            'heure_rappel' => $this->heure_rappel,
            'notifie' => (bool) $this->notifie,
        ];
    }
}
