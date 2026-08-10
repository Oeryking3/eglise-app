<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Eglise extends Model
{
    /**
     * Fonctionnalités qui peuvent être bloquées/débloquées par le
     * super-admin pour une église donnée. Une clé absente de la colonne
     * "features" (église créée avant l'ajout de ce système, ou jamais
     * configurée) est considérée activée par défaut.
     */
    public const FEATURES = ['evenements', 'agenda', 'carte', 'livres', 'avantages', 'notifications', 'direct', 'programme'];

    protected $fillable = [
        'nom', 'code', 'ville', 'adresse', 'statut',
        'contact_nom', 'contact_email', 'contact_telephone',
        'admin_password_hash', 'membres_sequence', 'motif_refus', 'approuvee_at',
        'features',
        'couleur_primaire', 'couleur_primaire_sombre', 'couleur_entete',
        'couleur_primaire_claire', 'couleur_bordure',
    ];

    protected $hidden = ['admin_password_hash'];

    protected function casts(): array
    {
        return [
            'approuvee_at' => 'datetime',
            'features' => 'array',
        ];
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function hasFeature(string $key): bool
    {
        return (bool) ($this->featuresArray()[$key] ?? true);
    }

    public function featuresArray(): array
    {
        $stored = $this->features ?? [];

        return array_merge(array_fill_keys(self::FEATURES, true), $stored);
    }

    public function themeArray(): array
    {
        return [
            'couleur_primaire' => $this->couleur_primaire,
            'couleur_primaire_sombre' => $this->couleur_primaire_sombre,
            'couleur_entete' => $this->couleur_entete,
            'couleur_primaire_claire' => $this->couleur_primaire_claire,
            'couleur_bordure' => $this->couleur_bordure,
        ];
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
