<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('live_streams', function (Blueprint $table) {
            $table->id();
            $table->string('url')->nullable();
            $table->boolean('actif')->default(false);
            $table->timestamps();
        });

        // Une seule ligne existera toujours dans cette table (config singleton)
        DB::table('live_streams')->insert([
            'url'        => null,
            'actif'      => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('live_streams');
    }
};