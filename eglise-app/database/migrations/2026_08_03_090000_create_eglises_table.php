<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('eglises', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('code', 10)->unique();
            $table->string('ville')->nullable();
            $table->string('adresse')->nullable();
            $table->string('statut')->default('en_attente');
            $table->string('contact_nom');
            $table->string('contact_email');
            $table->string('contact_telephone')->nullable();
            $table->string('admin_password_hash')->nullable();
            $table->unsignedInteger('membres_sequence')->default(0);
            $table->text('motif_refus')->nullable();
            $table->timestamp('approuvee_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('eglises');
    }
};
