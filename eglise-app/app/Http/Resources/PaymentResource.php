<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => new UserResource($this->whenLoaded('user')),
            'livre_id' => $this->livre_id,
            'produit' => $this->produit,
            'montant' => $this->montant,
            'methode' => $this->methode,
            'telephone' => $this->telephone,
            'statut' => $this->statut,
            'reference' => $this->reference,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
