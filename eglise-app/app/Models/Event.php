<?php

namespace App\Models;

use App\Models\Concerns\BelongsToEglise;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use BelongsToEglise;

    protected $fillable = [
        'eglise_id',
        'titre',
        'description',
        'image',
        'date_evenement',
        'heure_debut',
        'heure_fin',
        'important',
    ];

    protected $casts = [
        'date_evenement' => 'date',
        'important' => 'boolean',
    ];

    public function getImageUrlAttribute(): string
    {
        return $this->image
            ? asset('storage/' . $this->image)
            : asset('img/hero.png');
    }
}