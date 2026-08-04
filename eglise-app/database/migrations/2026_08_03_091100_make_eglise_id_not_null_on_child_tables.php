<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $tables = [
        'events', 'payments', 'agenda_items', 'livres',
        'card_benefits', 'church_notifications', 'live_streams',
    ];

    public function up(): void
    {
        foreach ($this->tables as $table) {
            DB::statement("ALTER TABLE {$table} MODIFY eglise_id BIGINT UNSIGNED NOT NULL");
        }

        Schema::table('live_streams', function (Blueprint $table) {
            $table->unique('eglise_id');
        });
    }

    public function down(): void
    {
        Schema::table('live_streams', function (Blueprint $table) {
            $table->dropUnique(['eglise_id']);
        });

        foreach ($this->tables as $table) {
            DB::statement("ALTER TABLE {$table} MODIFY eglise_id BIGINT UNSIGNED NULL");
        }
    }
};
