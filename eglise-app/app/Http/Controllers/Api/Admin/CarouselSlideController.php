<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CarouselSlide;
use App\Rules\ValidImage;
use Illuminate\Http\Request;

class CarouselSlideController extends Controller
{
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
                    'ordre' => $slide->ordre,
                    'actif' => $slide->actif,
                ]),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'image' => ['required', new ValidImage, 'max:4096'],
            'ordre' => ['nullable', 'integer', 'min:0'],
            'actif' => ['nullable', 'boolean'],
        ]);

        $data['ordre'] = $data['ordre'] ?? CarouselSlide::max('ordre') + 1;
        $data['actif'] = $request->boolean('actif', true);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('carousel', 'public');
        }

        $slide = CarouselSlide::create($data);

        return response()->json(['data' => ['id' => $slide->id, 'image_url' => $slide->image_url]], 201);
    }

    public function update(Request $request, CarouselSlide $slide)
    {
        $data = $request->validate([
            'image' => ['nullable', new ValidImage, 'max:4096'],
            'ordre' => ['nullable', 'integer', 'min:0'],
            'actif' => ['nullable', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('carousel', 'public');
        }

        if (array_key_exists('actif', $data)) {
            $data['actif'] = $request->boolean('actif');
        }

        $slide->update($data);

        return response()->json(['data' => ['id' => $slide->id, 'image_url' => $slide->image_url]]);
    }

    public function destroy(CarouselSlide $slide)
    {
        $slide->update(['actif' => false]);

        return response()->json(['message' => 'Image retirée du carrousel.']);
    }
}
