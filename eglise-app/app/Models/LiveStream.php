<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LiveStream extends Model
{
    protected $fillable = [
        'url',
        'actif',
    ];

    protected $casts = [
        'actif' => 'boolean',
    ];

    public static function current(): self
    {
        return static::firstOrCreate(['id' => 1]);
    }

    public function getEmbedUrlAttribute(): ?string
    {
        if (! $this->url) {
            return null;
        }

        if (str_contains($this->url, 'youtube.com') || str_contains($this->url, 'youtu.be')) {
            if (preg_match('/(?:v=|youtu\.be\/|embed\/|live\/)([a-zA-Z0-9_-]{11})/', $this->url, $matches)) {
                return 'https://www.youtube.com/embed/' . $matches[1] . '?autoplay=0';
            }

            // Chaîne en direct sans ID vidéo précis (lien /live générique)
            if (preg_match('/youtube\.com\/(?:channel\/|c\/|@)([^\/\?]+)/', $this->url, $matches)) {
                return 'https://www.youtube.com/embed/live_stream?channel=' . $matches[1];
            }
        }

        // Facebook Live
        if (str_contains($this->url, 'facebook.com')) {
            return 'https://www.facebook.com/plugins/video.php?href=' . urlencode($this->url) . '&show_text=false';
        }

        return null;
    }
}