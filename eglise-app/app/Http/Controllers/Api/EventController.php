<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;

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
}
