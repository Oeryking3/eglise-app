<?php

namespace App\Models;

use App\Models\Concerns\BelongsToEglise;
use Illuminate\Database\Eloquent\Model;

class CarouselSlide extends Model
{
    use BelongsToEglise;

    protected $table = 'carousel_slides';

    protected $fillable = [
        'eglise_id',
        'image',
        'ordre',
        'actif',
    ];

    protected $casts = [
        'actif' => 'boolean',
        'ordre' => 'integer',
    ];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }
}
