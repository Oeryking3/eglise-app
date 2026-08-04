<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LivreResource;
use App\Models\Livre;

class LivreController extends Controller
{
    public function index()
    {
        return LivreResource::collection(Livre::latest()->get());
    }
}
