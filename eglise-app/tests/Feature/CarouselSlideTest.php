<?php

namespace Tests\Feature;

use App\Http\Controllers\Api\Admin\CarouselSlideController;
use App\Models\CarouselSlide;
use App\Models\Eglise;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class CarouselSlideTest extends TestCase
{
    public function test_destroy_deactivates_slide_instead_of_deleting_it(): void
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

        Schema::create('carousel_slides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eglise_id');
            $table->string('image');
            $table->unsignedInteger('ordre')->default(0);
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });

        $eglise = Eglise::create([
            'nom' => 'Église Test',
            'code' => 'TEST',
            'ville' => 'Ville Test',
            'adresse' => 'Adresse Test',
            'statut' => 'active',
            'contact_nom' => 'Contact Test',
            'contact_email' => 'contact@example.com',
            'contact_telephone' => '0600000000',
            'admin_password_hash' => 'hash',
            'membres_sequence' => 1,
        ]);

        $slide = CarouselSlide::create([
            'eglise_id' => $eglise->id,
            'image' => 'carousel/test.jpg',
            'ordre' => 0,
            'actif' => true,
        ]);

        (new CarouselSlideController())->destroy($slide);

        $this->assertDatabaseHas('carousel_slides', [
            'id' => $slide->id,
            'actif' => false,
        ]);

        $this->assertNotNull(CarouselSlide::find($slide->id));
    }
}
