<?php

namespace App\Models;

use App\Models\Concerns\BelongsToEglise;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Livre extends Model
{
    use HasFactory, BelongsToEglise;

    protected $fillable = [
        'eglise_id',
        'titre',
        'description',
        'fichier',
    ];
}