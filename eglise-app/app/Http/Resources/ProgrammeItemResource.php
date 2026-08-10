<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProgrammeItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'jour' => $this->jour,
            'titre' => $this->titre,
            'horaires' => $this->horaires,
            'ordre' => $this->ordre,
        ];
    }
}
