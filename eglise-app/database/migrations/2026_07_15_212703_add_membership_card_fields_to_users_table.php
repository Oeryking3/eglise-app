<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('groupe_sanguin')->nullable()->after('sexe');
            $table->date('carte_expiration')->nullable()->after('carte_photo');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['groupe_sanguin', 'carte_expiration']);
        });
    }
};