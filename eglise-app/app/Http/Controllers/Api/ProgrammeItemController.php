<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgrammeItemResource;
use App\Models\ProgrammeItem;

class ProgrammeItemController extends Controller
{
    public function index()
    {
        return ProgrammeItemResource::collection(ProgrammeItem::orderBy('ordre')->orderBy('id')->get());
    }
}
