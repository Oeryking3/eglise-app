<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EgliseResource;
use App\Models\Eglise;

class EgliseController extends Controller
{
    public function index()
    {
        return EgliseResource::collection(
            Eglise::where('statut', 'active')->orderBy('nom')->get()
        );
    }
}
