<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'groupe_sanguin')) {
                $table->string('groupe_sanguin')->nullable()->after('sexe');
            }
            if (! Schema::hasColumn('users', 'carte_photo')) {
                $table->string('carte_photo')->nullable()->after('carte_membre');
            }
            if (! Schema::hasColumn('users', 'carte_expiration')) {
                $table->date('carte_expiration')->nullable()->after('carte_photo');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['groupe_sanguin', 'carte_photo', 'carte_expiration']);
        });
    }
};