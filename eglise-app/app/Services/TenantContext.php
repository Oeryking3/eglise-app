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

    public function egliseId(): ?int
    {
        $this->resolve();

        return $this->egliseId;
    }

    public function bypassed(): bool
    {
        $this->resolve();

        return $this->bypass;
    }

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
