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
        'livre_id',
        'type',
        'produit',
        'montant',
        'methode',
        'telephone',
        'statut',
        'reference',
        'provider_reference',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function livre()
    {
        return $this->belongsTo(Livre::class);
    }

    public function isDonation(): bool
    {
        return $this->type === 'don';
    }
}