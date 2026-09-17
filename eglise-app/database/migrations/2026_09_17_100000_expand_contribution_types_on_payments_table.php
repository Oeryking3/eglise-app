<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE payments MODIFY type ENUM('livre', 'don', 'dime', 'offrande', 'offrande_journaliere') NOT NULL DEFAULT 'livre'");
    }

    public function down(): void
    {
        DB::statement("UPDATE payments SET type = 'don' WHERE type IN ('dime', 'offrande', 'offrande_journaliere')");
        DB::statement("ALTER TABLE payments MODIFY type ENUM('livre', 'don') NOT NULL DEFAULT 'livre'");
    }
};