<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EventController extends Controller
{
    public function index()
    {
        return EventResource::collection(
            Event::orderBy('date_evenement', 'desc')->paginate(10)
        );
    }

    public function show(Event $event)
    {
        return new EventResource($event);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);

        if ($data['important'] ?? false) {
            if (Event::where('important', true)->count() >= 3) {
                throw ValidationException::withMessages([
                    'important' => 'Tu as déjà 3 événements marqués "à venir". Retire-en un avant d\'en ajouter un nouveau.',
                ]);
            }
        }

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('events', 'public');
        }

        $event = Event::create($data);

        return response()->json(['event' => new EventResource($event)], 201);
    }

    public function update(Request $request, Event $event)
    {
        $data = $this->validated($request);

        if (($data['important'] ?? false) && ! $event->important) {
            if (Event::where('important', true)->where('id', '!=', $event->id)->count() >= 3) {
                throw ValidationException::withMessages([
                    'important' => 'Tu as déjà 3 événements marqués "à venir". Retire-en un avant d\'en ajouter un nouveau.',
                ]);
            }
        }

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('events', 'public');
        }

        $event->update($data);

        return response()->json(['event' => new EventResource($event)]);
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return response()->json(['message' => 'Événement supprimé.']);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'titre' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:4096'],
            'date_evenement' => ['required', 'date', 'after_or_equal:today'],
            'heure_debut' => ['nullable', 'string'],
            'heure_fin' => ['nullable', 'string'],
            'important' => ['sometimes', 'boolean'],
        ]);
    }
}
