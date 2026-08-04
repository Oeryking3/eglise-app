<?php

namespace App\Models;

use App\Models\Concerns\BelongsToEglise;
use Illuminate\Database\Eloquent\Model;

class CardBenefit extends Model
{
    use BelongsToEglise;

    protected $fillable = [
        'eglise_id',
        'titre',
        'description',
    ];
}