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
        Schema::create('programme_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eglise_id')->constrained('eglises')->cascadeOnDelete();
            $table->string('jour');
            $table->string('titre');
            $table->string('horaires');
            $table->unsignedInteger('ordre')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programme_items');
    }
};
