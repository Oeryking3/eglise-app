<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
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
        'important'     => 'boolean',
    ];

    public function getImageUrlAttribute(): string
    {
        return $this->image ? asset('storage/' . $this->image) : asset('img/hero.png');
    }
}
