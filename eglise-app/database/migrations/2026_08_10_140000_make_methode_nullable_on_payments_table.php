<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Le mode de paiement n'est plus choisi dans l'app (GeniusPay ignorait
     * ce paramètre en Live) — il n'est plus connu qu'à la confirmation
     * (webhook), donc la colonne doit pouvoir rester vide entre-temps.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE payments MODIFY methode ENUM('wave','orange','mtn','moov','card') NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE payments MODIFY methode ENUM('wave','orange','mtn','moov','card') NOT NULL DEFAULT 'wave'");
    }
};
