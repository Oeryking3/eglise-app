<?php

namespace App\Models;

use App\Models\Concerns\BelongsToEglise;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, SoftDeletes, BelongsToEglise;

    protected $fillable = [
        'eglise_id',
        'user_id',
        'produit',
        'montant',
        'methode',
        'telephone',
        'statut',
        'reference',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}