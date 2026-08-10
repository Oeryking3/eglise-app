<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Models\PushToken;
use App\Rules\ValidImage;
use App\Services\ExpoPushService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EventController extends Controller
{
    public function __construct(private ExpoPushService $push)
    {
    }

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

        if ($event->important) {
            $this->notifyImportantEvent($event);
        }

        return response()->json(['event' => new EventResource($event)], 201);
    }

    public function update(Request $request, Event $event)
    {
        $data = $this->validated($request);
        $becomesImportant = ($data['important'] ?? false) && ! $event->important;

        if ($becomesImportant) {
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

        if ($becomesImportant) {
            $this->notifyImportantEvent($event);
        }

        return response()->json(['event' => new EventResource($event)]);
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return response()->json(['message' => 'Événement supprimé.']);
    }

    private function notifyImportantEvent(Event $event): void
    {
        $tokens = PushToken::pluck('token')->all();

        $this->push->send(
            $tokens,
            'Nouvel événement à venir',
            $event->titre,
            ['type' => 'evenement', 'event_id' => $event->id],
        );
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'titre' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', new ValidImage, 'max:4096'],
            'date_evenement' => ['required', 'date', 'after_or_equal:today'],
            'heure_debut' => ['nullable', 'string'],
            'heure_fin' => ['nullable', 'string'],
            'important' => ['sometimes', 'boolean'],
        ]);
    }
}
