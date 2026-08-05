<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Livre;
use App\Rules\ValidPdf;
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
            'prix'        => ['required', 'integer', 'min:1'],
            'fichier'     => ['required', 'file', new ValidPdf, 'max:20480'], // 20 Mo max
        ]);

        $path = $request->file('fichier')->store('livres', 'public');

        Livre::create([
            'titre'       => $data['titre'],
            'description' => $data['description'] ?? null,
            'prix'        => $data['prix'],
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