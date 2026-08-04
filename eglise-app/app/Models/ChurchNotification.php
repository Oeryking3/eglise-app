<?php

namespace App\Models;

use App\Models\Concerns\BelongsToEglise;
use Illuminate\Database\Eloquent\Model;

class ChurchNotification extends Model
{
    use BelongsToEglise;

    protected $table = 'church_notifications';

    protected $fillable = [
        'eglise_id',
        'titre',
        'message',
    ];
}