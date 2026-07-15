<?php

namespace App\Http\Controllers;

use App\Models\AgendaItem;
use Illuminate\Http\Request;

class AgendaController extends Controller
{
    public function index()
    {
        $items = AgendaItem::where('user_id', auth()->id())
            ->orderBy('date_rappel')
            ->get();

        return view('agenda.index', compact('items'));
    }

    public function create()
    {
        return view('agenda.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre'        => ['required', 'string', 'max:255'],
            'description'  => ['nullable', 'string'],
            'date_rappel'  => ['required', 'date'],
            'heure_rappel' => ['nullable'],
        ]);

        $data['user_id'] = auth()->id();

        AgendaItem::create($data);

        return redirect()->route('agenda.index')->with('success', 'Rappel ajouté à ton agenda.');
    }

    public function edit(AgendaItem $item)
    {
        abort_if($item->user_id !== auth()->id(), 403);

        return view('agenda.edit', compact('item'));
    }

    public function update(Request $request, AgendaItem $item)
    {
        abort_if($item->user_id !== auth()->id(), 403);

        $data = $request->validate([
            'titre'        => ['required', 'string', 'max:255'],
            'description'  => ['nullable', 'string'],
            'date_rappel'  => ['required', 'date'],
            'heure_rappel' => ['nullable'],
        ]);

        // Si la date change, on réarme la notification
        if ($data['date_rappel'] !== $item->date_rappel->format('Y-m-d')) {
            $data['notifie'] = false;
        }

        $item->update($data);

        return redirect()->route('agenda.index')->with('success', 'Rappel mis à jour.');
    }

    public function destroy(AgendaItem $item)
    {
        abort_if($item->user_id !== auth()->id(), 403);

        $item->delete();

        return back()->with('success', 'Rappel supprimé.');
    }
}