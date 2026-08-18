<?php

namespace App\Models;

use App\Models\Concerns\BelongsToEglise;
use Illuminate\Database\Eloquent\Model;

class LiveStreamLog extends Model
{
    use BelongsToEglise;

    protected $fillable = [
        'eglise_id',
        'url',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    /**
     * Garde une trace de chaque "session" de direct (quand il a commencé,
     * quand il s'est terminé/a été remplacé) pour l'historique admin — le
     * modèle LiveStream lui-même ne garde que l'état courant.
     */
    public static function logTransition(LiveStream $liveStream, ?string $newUrl, bool $newActif): void
    {
        $wasLive = $liveStream->actif;
        $urlChanged = $newUrl !== $liveStream->url;

        if ($wasLive && (! $newActif || $urlChanged)) {
            static::whereNull('ended_at')
                ->where('url', $liveStream->url)
                ->update(['ended_at' => now()]);
        }

        if ($newActif && $newUrl && (! $wasLive || $urlChanged)) {
            static::create([
                'url' => $newUrl,
                'started_at' => now(),
            ]);
        }
    }

    /**
     * Purge les entrées de plus d'une semaine à chaque consultation de
     * l'historique — évite de faire grossir la table indéfiniment sans
     * avoir besoin d'une tâche planifiée séparée.
     */
    public static function pruneOld(): void
    {
        static::where('started_at', '<', now()->subWeek())->delete();
    }
}
