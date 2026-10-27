<?php

namespace App\Policies;

use App\Models\AgendaItem;
use App\Models\User;

class AgendaItemPolicy
{
    /** Un membre ne peut modifier que l'élément qu'il a créé. */
    public function update(User $user, AgendaItem $item): bool
    {
        return $item->user_id === $user->id;
    }

    /** La suppression suit la même règle de propriété que la modification. */
    public function delete(User $user, AgendaItem $item): bool
    {
        return $item->user_id === $user->id;
    }
}
