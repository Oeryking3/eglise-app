<?php

namespace App\Models;

use App\Services\TenantContext;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'eglise_id',
        'member_id',
        'nom',
        'prenom',
        'email',
        'date_naissance',
        'sexe',
        'lieu_residence',
        'password',
        'role',
        'carte_membre',
        'carte_photo',
        'groupe_sanguin',
        'carte_expiration',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected static function booted(): void
    {
        static::creating(function (User $user) {
            if (empty($user->eglise_id) && ! in_array($user->role, ['super_admin'], true)) {
                $user->eglise_id = app(TenantContext::class)->egliseId();
            }

            if (empty($user->member_id) && $user->eglise_id) {
                $eglise = Eglise::findOrFail($user->eglise_id);
                $sequence = $eglise->nextMemberSequence();
                $user->member_id = $eglise->code . '-' . str_pad((string) $sequence, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    public function eglise()
    {
        return $this->belongsTo(Eglise::class);
    }

    public function scopeForActingTenant($query)
    {
        $context = app(TenantContext::class);

        return $context->bypassed() ? $query : $query->where('eglise_id', $context->egliseId());
    }

    protected function casts(): array
    {
        return [
            'date_naissance'    => 'date',
            'carte_expiration'  => 'date',
            'carte_membre'      => 'boolean',
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function isAdminEglise(): bool
    {
        return $this->role === 'admin_eglise';
    }

    public function isAdmin(): bool
    {
        return $this->isSuperAdmin() || $this->isAdminEglise();
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function getCartePhotoUrlAttribute(): ?string
    {
        return $this->carte_photo ? asset('storage/' . $this->carte_photo) : null;
    }

    public function getCarteEstValideAttribute(): bool
    {
        if (! $this->carte_membre) {
            return false;
        }

        if ($this->carte_expiration && $this->carte_expiration->isPast()) {
            return false;
        }

        return true;
    }
}