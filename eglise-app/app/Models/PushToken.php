<?php

namespace App\Models;

use App\Models\Concerns\BelongsToEglise;
use Illuminate\Database\Eloquent\Model;

class PushToken extends Model
{
    use BelongsToEglise;

    protected $fillable = ['eglise_id', 'user_id', 'token'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
