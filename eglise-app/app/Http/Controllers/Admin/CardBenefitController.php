<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CardBenefit;
use Illuminate\Http\Request;

class CardBenefitController extends Controller
{
    public function index()
    {
        $benefits = CardBenefit::latest()->get();

        return view('admin.avantages.index', compact('benefits'));
    }

    public function create()
    {
        return view('admin.avantages.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        CardBenefit::create($data);

        return redirect()->route('admin.avantages.index')->with('success', 'Avantage ajouté.');
    }

    public function destroy(CardBenefit $benefit)
    {
        $benefit->delete();

        return back()->with('success', 'Avantage supprimé.');
    }
}