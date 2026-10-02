<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CarouselSlide;
use App\Rules\ValidImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CarouselSlideController extends Controller
{
    public function manage()
    {
        return response()->json([
            'data' => CarouselSlide::orderBy('ordre')
                ->orderBy('created_at')
                ->get()
                ->map(fn ($slide) => [
                    'id' => $slide->id,
                    'image_url' => $slide->image_url,
                    'video_url' => $slide->video_url,
                    'ordre' => $slide->ordre,
                    'actif' => $slide->actif,
                ]),
        ]);
    }

    public function index()
    {
        return response()->json([
            'data' => CarouselSlide::where('actif', true)
                ->orderBy('ordre')
                ->orderBy('created_at')
                ->get()
                ->map(fn ($slide) => [
                    'id' => $slide->id,
                    'image_url' => $slide->image_url,
                    'video_url' => $slide->video_url,
                    'ordre' => $slide->ordre,
                    'actif' => $slide->actif,
                ]),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'image' => ['nullable', 'required_without:video_url', new ValidImage, 'max:4096'],
            'video_url' => ['nullable', 'required_without:image', 'url', 'max:2048'],
            'ordre' => ['nullable', 'integer', 'min:0'],
            'actif' => ['nullable', 'boolean'],
        ]);

        $data['ordre'] = $data['ordre'] ?? CarouselSlide::max('ordre') + 1;
        $data['actif'] = $request->boolean('actif', true);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('carousel', 'public');
        } else {
            $data['image'] = null;
        }

        $slide = CarouselSlide::create($data);

        return response()->json(['data' => [
            'id' => $slide->id,
            'image_url' => $slide->image_url,
            'video_url' => $slide->video_url,
        ]], 201);
    }

    public function update(Request $request, CarouselSlide $slide)
    {
        $data = $request->validate([
            'image' => ['nullable', new ValidImage, 'max:4096'],
            'video_url' => ['nullable', 'url', 'max:2048'],
            'ordre' => ['nullable', 'integer', 'min:0'],
            'actif' => ['nullable', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($slide->image);
            $data['image'] = $request->file('image')->store('carousel', 'public');
            $data['video_url'] = null;
        } elseif ($request->filled('video_url')) {
            Storage::disk('public')->delete($slide->image);
            $data['image'] = null;
        }

        if (array_key_exists('actif', $data)) {
            $data['actif'] = $request->boolean('actif');
        }

        $slide->update($data);

        return response()->json(['data' => [
            'id' => $slide->id,
            'image_url' => $slide->image_url,
            'video_url' => $slide->video_url,
        ]]);
    }

    public function destroy(CarouselSlide $slide)
    {
        $paths = array_filter([$slide->image]);
        $slide->delete();
        Storage::disk('public')->delete($paths);

        return response()->json(['message' => 'Publicité supprimée.']);
    }
}
