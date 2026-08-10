<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('eglises', function (Blueprint $table) {
            $table->json('features')->nullable()->after('statut');
            $table->string('couleur_primaire', 9)->nullable()->after('features');
            $table->string('couleur_primaire_sombre', 9)->nullable()->after('couleur_primaire');
            $table->string('couleur_entete', 9)->nullable()->after('couleur_primaire_sombre');
            $table->string('couleur_primaire_claire', 9)->nullable()->after('couleur_entete');
            $table->string('couleur_bordure', 9)->nullable()->after('couleur_primaire_claire');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('eglises', function (Blueprint $table) {
            $table->dropColumn([
                'features',
                'couleur_primaire',
                'couleur_primaire_sombre',
                'couleur_entete',
                'couleur_primaire_claire',
                'couleur_bordure',
            ]);
        });
    }
};
