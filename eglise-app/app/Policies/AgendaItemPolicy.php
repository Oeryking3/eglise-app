<?php

namespace App\Policies;

use App\Models\AgendaItem;
use App\Models\User;

class AgendaItemPolicy
{
    public function update(User $user, AgendaItem $item): bool
    {
        return $item->user_id === $user->id;
    }

    public function delete(User $user, AgendaItem $item): bool
    {
        return $item->user_id === $user->id;
    }
}
