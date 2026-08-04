<?php

namespace App\Models\Concerns;

use App\Models\Eglise;
use App\Models\Scopes\EgliseScope;
use App\Services\TenantContext;

trait BelongsToEglise
{
    public static function bootBelongsToEglise(): void
    {
        static::addGlobalScope(new EgliseScope());

        static::creating(function ($model) {
            if (empty($model->eglise_id)) {
                $model->eglise_id = app(TenantContext::class)->egliseId();
            }
        });
    }

    public function eglise()
    {
        return $this->belongsTo(Eglise::class);
    }
}
