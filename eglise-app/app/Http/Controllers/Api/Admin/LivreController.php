<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\LivreResource;
use App\Models\Livre;
use App\Rules\ValidPdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LivreController extends Controller
{
    public function index()
    {
        return LivreResource::collection(Livre::latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'prix' => ['required', 'integer', 'min:1'],
            'fichier' => ['required', 'file', new ValidPdf, 'max:20480'],
        ]);

        $data['fichier'] = $request->file('fichier')->store('livres', 'public');

        $livre = Livre::create($data);

        return response()->json(['livre' => new LivreResource($livre)], 201);
    }

    public function destroy(Livre $livre)
    {
        if ($livre->fichier && Storage::disk('public')->exists($livre->fichier)) {
            Storage::disk('public')->delete($livre->fichier);
        }

        $livre->delete();

        return response()->json(['message' => 'Le livre a été supprimé.']);
    }
}
