<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChurchNotification extends Model
{
    protected $table = 'church_notifications';

    protected $fillable = [
        'titre',
        'message',
    ];
}