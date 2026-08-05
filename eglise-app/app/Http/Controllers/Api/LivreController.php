<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Livre;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class LivreController extends Controller
{
    /**
     * Catalogue des livres de l'église : chaque livre indique son prix et si
     * l'utilisateur l'a déjà acheté. Le lien de téléchargement (fichier_url)
     * n'est présent que pour les livres achetés.
     */
    public function index(Request $request)
    {
        $achetes = Payment::where('user_id', $request->user()->id)
            ->where('statut', 'reussi')
            ->whereNotNull('livre_id')
            ->pluck('livre_id')
            ->all();

        return Livre::latest()->get()->map(function (Livre $livre) use ($achetes) {
            $achete = in_array($livre->id, $achetes, true);

            return [
                'id' => $livre->id,
                'titre' => $livre->titre,
                'description' => $livre->description,
                'prix' => $livre->prix,
                'achete' => $achete,
                'fichier_url' => $achete && $livre->fichier
                    ? URL::temporarySignedRoute('livres.telecharger', now()->addHours(6), ['livre' => $livre->id])
                    : null,
            ];
        })->values();
    }
}
