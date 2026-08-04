<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carte_imports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eglise_id')->constrained('eglises')->cascadeOnDelete();
            $table->string('email')->unique();
            $table->date('date_naissance')->nullable();
            $table->string('sexe', 1)->nullable();
            $table->string('groupe_sanguin', 5)->nullable();
            $table->date('carte_expiration')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carte_imports');
    }
};
