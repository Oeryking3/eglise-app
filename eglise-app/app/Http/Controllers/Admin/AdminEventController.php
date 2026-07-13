<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class AdminEventController extends Controller
{
    public function index()
    {
        $events = Event::orderBy('date_evenement', 'desc')->paginate(10);
        return view('admin.events.index', compact('events'));
    }

    public function create()
    {
        return view('admin.events.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre'           => ['required', 'string', 'max:255'],
            'description'     => ['nullable', 'string'],
            'image'           => ['nullable', 'image', 'max:4096'],
            'date_evenement'  => ['required', 'date'],
            'heure_debut'     => ['nullable', 'string'],
            'heure_fin'       => ['nullable', 'string'],
            'important'       => ['sometimes', 'boolean'],
        ]);

        $data['important'] = $request->boolean('important');

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('events', 'public');
        }

        Event::create($data);

        return redirect()->route('admin.events.index')->with('success', 'Événement créé.');
    }

    public function edit(Event $event)
    {
        return view('admin.events.edit', compact('event'));
    }

    public function update(Request $request, Event $event)
    {
        $data = $request->validate([
            'titre'           => ['required', 'string', 'max:255'],
            'description'     => ['nullable', 'string'],
            'image'           => ['nullable', 'image', 'max:4096'],
            'date_evenement'  => ['required', 'date'],
            'heure_debut'     => ['nullable', 'string'],
            'heure_fin'       => ['nullable', 'string'],
            'important'       => ['sometimes', 'boolean'],
        ]);

        $data['important'] = $request->boolean('important');

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('events', 'public');
        }

        $event->update($data);

        return redirect()->route('admin.events.index')->with('success', 'Événement mis à jour.');
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return back()->with('success', 'Événement supprimé.');
    }
}