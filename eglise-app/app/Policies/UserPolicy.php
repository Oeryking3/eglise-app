<?php

namespace App\Policies;

use App\Models\User;
use App\Services\TenantContext;

class UserPolicy
{
    public function __construct(private TenantContext $tenant)
    {
    }

    public function view(User $actor, User $member): bool
    {
        return $this->sameTenant($actor, $member);
    }

    public function update(User $actor, User $member): bool
    {
        return $this->sameTenant($actor, $member);
    }

    public function delete(User $actor, User $member): bool
    {
        return $this->sameTenant($actor, $member);
    }

    private function sameTenant(User $actor, User $member): bool
    {
        if ($actor->isSuperAdmin()) {
            return $member->eglise_id === $this->tenant->egliseId();
        }

        return $member->eglise_id === $actor->eglise_id;
    }
}
