<?php

namespace App\Models;

use App\Models\Concerns\BelongsToEglise;
use Illuminate\Database\Eloquent\Model;

class AgendaItem extends Model
{
    use BelongsToEglise;

    protected $fillable = [
        'eglise_id',
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