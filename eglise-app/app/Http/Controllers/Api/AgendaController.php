<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AgendaItemResource;
use App\Models\AgendaItem;
use Illuminate\Http\Request;

class AgendaController extends Controller
{
    public function index(Request $request)
    {
        $items = AgendaItem::where('user_id', $request->user()->id)
            ->orderBy('date_rappel')
            ->get();

        return AgendaItemResource::collection($items);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'date_rappel' => ['required', 'date'],
            'heure_rappel' => ['nullable'],
        ]);

        $item = AgendaItem::create([
            ...$data,
            'user_id' => $request->user()->id,
        ]);

        return response()->json(['item' => new AgendaItemResource($item)], 201);
    }

    public function update(Request $request, AgendaItem $item)
    {
        $this->authorize('update', $item);

        $data = $request->validate([
            'titre' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'date_rappel' => ['required', 'date'],
            'heure_rappel' => ['nullable'],
        ]);

        if ($data['date_rappel'] !== $item->date_rappel->format('Y-m-d')) {
            $data['notifie'] = false;
        }

        $item->update($data);

        return response()->json(['item' => new AgendaItemResource($item)]);
    }

    public function destroy(Request $request, AgendaItem $item)
    {
        $this->authorize('delete', $item);

        $item->delete();

        return response()->json(['message' => 'Rappel supprimé.']);
    }
}
