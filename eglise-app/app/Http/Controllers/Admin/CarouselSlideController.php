<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CarouselSlide;
use App\Rules\ValidImage;
use Illuminate\Http\Request;

class CarouselSlideController extends Controller
{
    public function index()
    {
        $slides = CarouselSlide::orderBy('ordre')->orderBy('created_at')->get();

        return view('admin.carousel.index', compact('slides'));
    }

    public function create()
    {
        return view('admin.carousel.create');
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

        CarouselSlide::create($data);

        return redirect()->route('admin.carousel.index')->with('success', 'Image ajoutée au carrousel.');
    }

    public function destroy(CarouselSlide $slide)
    {
        $slide->update(['actif' => false]);

        return back()->with('success', 'Image retirée du carrousel.');
    }
}
