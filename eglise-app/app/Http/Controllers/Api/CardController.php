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
        return response()->json([
            'user' => new UserResource($request->user()->load('eglise')),
            'benefits' => CardBenefitResource::collection(CardBenefit::latest()->get()),
        ]);
    }
}
