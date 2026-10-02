<?php

namespace Tests\Feature;

use App\Http\Controllers\Api\Admin\CarouselSlideController;
use App\Models\CarouselSlide;
use App\Models\Eglise;
use App\Services\TenantContext;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CarouselSlideTest extends TestCase
{
    public function test_destroy_deletes_slide_and_its_stored_image(): void
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

        $migration = require database_path('migrations/2026_10_02_000001_add_video_to_carousel_slides_table.php');
        $migration->up();
        $this->assertTrue(Schema::hasColumn('carousel_slides', 'video'));
        $videoLinkMigration = require database_path('migrations/2026_10_02_000002_use_video_links_for_carousel_ads.php');
        $videoLinkMigration->up();
        $this->assertTrue(Schema::hasColumn('carousel_slides', 'video_url'));

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

        $this->app->instance(TenantContext::class, new class($eglise->id)
        {
            public function __construct(private int $egliseId)
            {
            }

            public function egliseId(): int
            {
                return $this->egliseId;
            }

            public function bypassed(): bool
            {
                return false;
            }
        });

        Storage::fake('public');
        $image = UploadedFile::fake()->createWithContent(
            'publicite.png',
            base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/pWQAAAAASUVORK5CYII=')
        );
        $imageResponse = (new CarouselSlideController())->store(Request::create('/', 'POST', [], [], ['image' => $image]));
        $this->assertSame(201, $imageResponse->getStatusCode());

        $videoUrl = 'https://www.youtube.com/watch?v=test-video';
        $videoResponse = (new CarouselSlideController())->store(Request::create('/', 'POST', ['video_url' => $videoUrl]));
        $this->assertSame(201, $videoResponse->getStatusCode());
        $this->assertDatabaseHas('carousel_slides', ['video_url' => $videoUrl, 'image' => null]);

        $slide = CarouselSlide::create([
            'eglise_id' => $eglise->id,
            'image' => 'carousel/test.jpg',
            'video_url' => 'https://www.youtube.com/watch?v=test-video',
            'ordre' => 0,
            'actif' => true,
        ]);
        Storage::disk('public')->put('carousel/test.jpg', 'image-content');

        (new CarouselSlideController())->destroy($slide);

        $this->assertDatabaseMissing('carousel_slides', ['id' => $slide->id]);
        Storage::disk('public')->assertMissing('carousel/test.jpg');
    }
}
