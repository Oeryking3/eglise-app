<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Livre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LivreController extends Controller
{
    public function index()
    {
        $livres = Livre::latest()->get();

        return view('admin.livres.index', compact('livres'));
    }

    public function create()
    {
        return view('admin.livres.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'fichier'     => ['required', 'file', 'mimes:pdf', 'max:20480'], // 20 Mo max
        ]);

        $path = $request->file('fichier')->store('livres', 'public');

        Livre::create([
            'titre'       => $data['titre'],
            'description' => $data['description'] ?? null,
            'fichier'     => $path,
        ]);

        return redirect()->route('admin.livres.index')
            ->with('success', 'Le livre a été ajouté avec succès.');
    }

    public function destroy(Livre $livre)
    {
        if (Storage::disk('public')->exists($livre->fichier)) {
            Storage::disk('public')->delete($livre->fichier);
        }

        $livre->delete();

        return redirect()->route('admin.livres.index')
            ->with('success', 'Le livre a été supprimé.');
    }
}