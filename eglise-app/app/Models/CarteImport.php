<?php

namespace App\Models;

use App\Models\Concerns\BelongsToEglise;
use Illuminate\Database\Eloquent\Model;

class CarteImport extends Model
{
    use BelongsToEglise;

    protected $fillable = [
        'eglise_id', 'email', 'date_naissance', 'sexe', 'groupe_sanguin', 'carte_expiration',
    ];

    protected function casts(): array
    {
        return [
            'date_naissance' => 'date',
            'carte_expiration' => 'date',
        ];
    }
}
