<?php

namespace App\Services;

use Illuminate\Http\Request;

class TenantContext
{
    private bool $resolved = false;

    private ?int $egliseId = null;

    private bool $bypass = false;

    public function __construct(private Request $request)
    {
    }

    /** Retourne l'église définie pour la requête en cours. */
    public function egliseId(): ?int
    {
        $this->resolve();

        return $this->egliseId;
    }

    /** Indique qu'aucun filtre d'église ne doit être appliqué à cette requête. */
    public function bypassed(): bool
    {
        $this->resolve();

        return $this->bypass;
    }

    /**
    * Résout une seule fois le contexte : sans utilisateur authentifié, le
    * filtre est contourné ; un super-admin peut choisir une église par en-tête
    * ou paramètre, tandis que les autres utilisateurs restent dans la leur.
     */
    private function resolve(): void
    {
        if ($this->resolved) {
            return;
        }

        $this->resolved = true;

        $user = $this->request->user();

        if (! $user) {
            $this->bypass = true;

            return;
        }

        if ($user->isSuperAdmin()) {
            $value = $this->request->header('X-Eglise-Id') ?? $this->request->query('eglise_id');
            $this->egliseId = $value !== null ? (int) $value : null;

            return;
        }

        $this->egliseId = $user->eglise_id;
    }
}
