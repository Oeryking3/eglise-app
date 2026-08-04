<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CardBenefitResource;
use App\Models\CardBenefit;
use Illuminate\Http\Request;

class CardBenefitController extends Controller
{
    public function index()
    {
        return CardBenefitResource::collection(CardBenefit::latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $benefit = CardBenefit::create($data);

        return response()->json(['benefit' => new CardBenefitResource($benefit)], 201);
    }

    public function destroy(CardBenefit $benefit)
    {
        $benefit->delete();

        return response()->json(['message' => 'Avantage supprimé.']);
    }
}
