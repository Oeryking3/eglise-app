<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgendaItem extends Model
{
    protected $fillable = [
        'user_id',
        'titre',
        'description',
        'date_rappel',
        'heure_rappel',
        'notifie',
    ];

    protected $casts = [
        'date_rappel' => 'date',
        'notifie'     => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}