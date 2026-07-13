<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
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