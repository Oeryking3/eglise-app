<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Eglise extends Model
{
    protected $fillable = [
        'nom', 'code', 'ville', 'adresse', 'statut',
        'contact_nom', 'contact_email', 'contact_telephone',
        'admin_password_hash', 'membres_sequence', 'motif_refus', 'approuvee_at',
    ];

    protected $hidden = ['admin_password_hash'];

    protected function casts(): array
    {
        return [
            'approuvee_at' => 'datetime',
        ];
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function nextMemberSequence(): int
    {
        return DB::transaction(function () {
            $eglise = self::whereKey($this->id)->lockForUpdate()->first();
            $eglise->increment('membres_sequence');

            return $eglise->membres_sequence;
        });
    }
}
