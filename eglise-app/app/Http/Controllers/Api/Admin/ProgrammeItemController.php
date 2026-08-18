<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgrammeItemResource;
use App\Models\ProgrammeItem;
use App\Services\TenantContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProgrammeItemController extends Controller
{
    public function index()
    {
        return ProgrammeItemResource::collection(ProgrammeItem::orderBy('ordre')->orderBy('id')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'jour' => ['required', 'string', 'max:255'],
            'titre' => ['required', 'string', 'max:255'],
            'horaires' => ['required', 'string', 'max:255'],
            'ordre' => ['nullable', 'integer'],
        ]);

        $item = ProgrammeItem::create($data);
        $this->forgetCache();

        return response()->json(['item' => new ProgrammeItemResource($item)], 201);
    }

    public function update(Request $request, ProgrammeItem $item)
    {
        $data = $request->validate([
            'jour' => ['required', 'string', 'max:255'],
            'titre' => ['required', 'string', 'max:255'],
            'horaires' => ['required', 'string', 'max:255'],
            'ordre' => ['nullable', 'integer'],
        ]);

        $item->update($data);
        $this->forgetCache();

        return response()->json(['item' => new ProgrammeItemResource($item)]);
    }

    public function destroy(ProgrammeItem $item)
    {
        $item->delete();
        $this->forgetCache();

        return response()->json(['message' => 'Élément du programme supprimé.']);
    }

    private function forgetCache(): void
    {
        Cache::forget('programme:' . app(TenantContext::class)->egliseId());
    }
}
