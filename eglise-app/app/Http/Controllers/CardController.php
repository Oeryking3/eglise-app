<?php

namespace App\Http\Controllers;

use App\Models\CardBenefit;

class CardController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        $benefits = CardBenefit::latest()->get();

        return view('carte', compact('user', 'benefits'));
    }
}