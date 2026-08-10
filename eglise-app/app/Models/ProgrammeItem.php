<?php

namespace App\Models;

use App\Models\Concerns\BelongsToEglise;
use Illuminate\Database\Eloquent\Model;

class ProgrammeItem extends Model
{
    use BelongsToEglise;

    protected $fillable = [
        'eglise_id',
        'jour',
        'titre',
        'horaires',
        'ordre',
    ];
}
