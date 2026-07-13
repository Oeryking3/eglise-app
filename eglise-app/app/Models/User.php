<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'member_id',
        'nom',
        'prenom',
        'email',
        'date_naissance',
        'sexe',
        'lieu_residence',
        'password',
        'role',
    ];

    protected static function booted(): void
    {
        static::creating(function (User $user) {
            if (empty($user->member_id)) {
                $lastId = (int) static::max('id');
                $user->member_id = 'AM-' . str_pad($lastId + 1, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'date_naissance'    => 'date',
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}