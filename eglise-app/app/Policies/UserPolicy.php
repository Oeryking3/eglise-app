<?php

namespace App\Policies;

use App\Models\User;
use App\Services\TenantContext;

class UserPolicy
{
    public function __construct(private TenantContext $tenant)
    {
    }

    /** L'accès à un membre est limité à son église, y compris pour un admin. */
    public function view(User $actor, User $member): bool
    {
        return $this->sameTenant($actor, $member);
    }

    /** La modification ne permet pas de franchir la limite d'une église. */
    public function update(User $actor, User $member): bool
    {
        return $this->sameTenant($actor, $member);
    }

    /** La suppression ne permet pas de franchir la limite d'une église. */
    public function delete(User $actor, User $member): bool
    {
        return $this->sameTenant($actor, $member);
    }

    private function sameTenant(User $actor, User $member): bool
    {
        // Un super-admin agit sur l'église sélectionnée dans la requête ; un
        // admin d'église reste limité à l'église de son propre compte.
        if ($actor->isSuperAdmin()) {
            return $member->eglise_id === $this->tenant->egliseId();
        }

        return $member->eglise_id === $actor->eglise_id;
    }
}
