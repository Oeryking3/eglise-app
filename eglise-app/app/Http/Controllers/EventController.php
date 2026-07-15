<?php

namespace App\Http\Controllers;

use App\Models\Event;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::orderBy('date_evenement', 'desc')->paginate(10);

        return view('events.index', compact('events'));
    }
}