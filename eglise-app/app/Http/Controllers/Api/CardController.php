<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CardBenefitResource;
use App\Http\Resources\UserResource;
use App\Models\CardBenefit;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load('eglise');
        $eglise = $user->eglise;

        $benefits = $eglise && ! $eglise->hasFeature('avantages')
            ? collect()
            : CardBenefit::latest()->get();

        return response()->json([
            'user' => new UserResource($user),
            'benefits' => CardBenefitResource::collection($benefits),
        ]);
    }
}
